import { nextTick } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { Kronos } from '@tb-dev/kronos';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { TribalWorkerError } from '$worker/error';
import { parseGameDate } from '$renderer/utils/parser';

type LabeledAttack = Pick<IncomingAttack, 'arrivalTime' | 'id'>;

export async function handleIncomingAttacks(port: MessagePort) {
    try {
        ipcSend('tribal-worker:will-handle-incoming-attack');

        // Obtêm informações sobre os ataques que estão a caminho.
        const rowSelector = '#incomings_form #incomings_table tr:has(td span.quickedit[data-id])';
        const incomings: Map<Element, IncomingAttack> = Map.fromElements(rowSelector, (el) => el, (el) => {
            const quickedit = el.queryAndAssert('span.quickedit');
            const id = quickedit.getAttributeAsIntStrict('data-id');

            const targetEl = el.queryAndAssert<HTMLAnchorElement>('td a[href*="screen=overview" i]');
            const targetUrl = new URL(targetEl.href, location.origin);
            const target = targetUrl.searchParams.getAsIntegerStrict('village');

            const originEl = el.queryAndAssert<HTMLAnchorElement>('td a[href*="screen=info_village" i]');
            const originUrl = new URL(originEl.href, location.origin);
            const origin = originUrl.searchParams.getAsIntegerStrict('id');

            const attackerEl = el.queryAndAssert<HTMLAnchorElement>('td a[href*="screen=info_player" i]');
            const attackerUrl = new URL(attackerEl.href, location.origin);
            const attacker = attackerUrl.searchParams.getAsIntegerStrict('id');

            const selector = 'td:not(:has(a)):not(:has(input)):has(span.grey)';
            const fields = el.queryAsArray<HTMLTableCellElement>(selector);
            if (fields.length === 0) {
                throw new TribalWorkerError(`Invalid CSS selector: ${selector}.`);
            };

            let arrivalTime: number | null = null;
            for (const field of fields) {
                if (!field.textContent) continue;
                const date = parseGameDate(field.textContent);
                if (date) {
                    arrivalTime = date;
                    break;
                };
            };

            if (!arrivalTime) {
                throw new TribalWorkerError(`Invalid arrival time: ${arrivalTime}.`);
            };


            return { id, target, origin, attacker, arrivalTime, addedAt: Date.now() };
        });

        if (incomings.size === 0) return;
        const previousIncomings = await ipcInvoke('game:get-incomings-info');
        ipcSend('game:update-incomings-info', previousIncomings.concat(
            Array.from(incomings.values()).filter(({ id }) => {
                return !previousIncomings.some((prev) => prev.id === id);
            })
        ));

        // Registra os ataques que já foram etiquetados.
        const playerName = await ipcInvoke('game:player-name');
        if (!playerName) throw new TribalWorkerError('Invalid player name.');

        const labeled = useLocalStorage<LabeledAttack[]>(`${playerName}:labeled-incomings`, []);
        labeled.value = labeled.value.filter(({ arrivalTime }) => arrivalTime < Date.now());

        for (const [row, { id, arrivalTime }] of incomings.entries()) {
            if (labeled.value.some(({ id: labeledId }) => labeledId === id)) continue;
            labeled.value.push({ id, arrivalTime });

            const checkbox = row.queryAndAssert<HTMLInputElement>('td input[name^="id_"][type="checkbox"]');
            if (!checkbox.checked) checkbox.click();
        };

        // Etiqueta os ataques que ainda não foram.
        const buttonSelector = '#incomings_table input.btn[type="submit"][name="label"]';
        const labelButton = document.queryAndAssert<HTMLInputElement>(buttonSelector);

        await nextTick();
        const responseTime = (await ipcInvoke('browser:get-response-time')) ?? 1000;
        setTimeout(() => {
            ipcSend('tribal-worker:did-handle-incoming-attack');
            port.postMessage('destroy');
            labelButton.click();
        }, Kronos.Second + responseTime);

    } catch (err) {
        TribalWorkerError.catch(err);
        port.postMessage('destroy');
        ipcSend('tribal-worker:did-fail-to-handle-incoming-attack');
    };
};