import { useEventListener, useMutationObserver } from '@vueuse/core';
import { assertInteger, isInstanceOf, assertString, assert } from '@tb-dev/ts-guard';
import { usePlunderConfigStore } from '$vue/stores/plunder.js';
import { generateRandomDelay, wait } from '$global/utils/helpers.js';
import { unitsRegex } from '$global/utils/constants.js';
import { ipcSend, ipcInvoke } from '$global/ipc.js';
import { PlunderError } from '$browser/error.js';
import type { PlaceUnitsAmount } from '$types/game.js';
import type { PlunderAttackDetails } from '$types/plunder.js';

export const eventTarget = new EventTarget();

export abstract class PlunderAttack implements Omit<PlunderAttackDetails, 'total'> {
    // Já incluso o ataque enviado.
    readonly attackAmount: number = 1;
    destroyedWalls: number = 0;

    abstract wood: number;
    abstract stone: number;
    abstract iron: number;
};

export function prepareAttack(plunderAttack: PlunderAttack, button: HTMLAnchorElement) {
    const config = usePlunderConfigStore();
    return new Promise<void>((resolve, reject) => {
        // O jogo possui um limite de cinco ações por segundo.
        const delay = config.ignoreDelay ? 0 : generateRandomDelay(config.attackDelay);
        const attackTimeout = setTimeout(attack, delay);
        const cleanup = useEventListener(eventTarget, 'stop', stop, { once: true });

        function attack() {
            sendAttack(button)
                .then(() => ipcSend('plunder-attack-sent', plunderAttack))
                .then(() => resolve())
                .catch((err: unknown) => reject(err))
                .finally(() => cleanup());
        };

        function stop() {
            clearTimeout(attackTimeout);
            reject();
        };
    });
};

/**
 * O Plunder cumpre sua tarefa bem mais rápido que o servidor consegue responder.
 * No entanto, como ele depende do número de tropas ditado pelo jogo, é necessário esperar o valor ser atualizado.
 * @param button Botão usado para atacar com o modelo.
 */
function sendAttack(button: HTMLAnchorElement) {
    return new Promise<void>((resolve, reject) => {
        const selector = '#farm_units #units_home tr:has(td#spear):has(td#sword)';
        const unitsRow = document.queryAndAssert<HTMLTableRowElement>(selector);

        const observer = useMutationObserver(unitsRow, () => {
            observer.stop();
            resolve();
        }, { subtree: true, childList: true });

        button.click();

        // Se não perceber mudanças mesmo após três segundos, rejeita a Promise.
        wait(3000).then(() => observer.stop()).then(() => reject());
    });
};

/**
 * Envia um ataque com as unidades especificadas a partir da praça de reunião.
 * É necessário primeiro abrir a praça de reunião usando a função `openPlace()`.
 * @param units Unidades que serão enviadas.
 * @returns `true` se o ataque foi enviado com sucesso, `false` caso contrário.
 */
export async function sendAttackFromPlace(units: PlaceUnitsAmount): Promise<boolean> {
    try {
        const isArcherWorld = await ipcInvoke('is-archer-world');
        const commandForm = document.queryAndAssert('#command-data-form[action*="place" i]');

        for (const [key, value] of Object.entries(units)) {
            if (!isArcherWorld && /archer/.test(key)) continue;
            assertInteger(value, `O valor de ${key} não é um número inteiro.`);

            const selector = `input#unit_input_${key}[name*="${key}" i][class*="unitsInput" i]`;
            const input = commandForm.queryAndAssert<HTMLInputElement>(selector);
            input.value = value.toString(10);
        };

        await submitAndWaitConfirmationPopup(commandForm);

        const buttonSelector = '#troop_confirm_submit[class*="troop_confirm_go" i][type="submit"]';
        const confirmationButton = document.queryAndAssert<HTMLAnchorElement>(buttonSelector);

        const unitsSelector = '#place_confirm_units tr.units-row td[class*="unit-item" i]:not(.hidden)';
        const unitsBeingSent = document.queryAsArray(unitsSelector);

        // Confirma se a quantidade de tropas sendo enviada é igual à quantidade de tropas exigida.
        for (const unit of unitsBeingSent) {
            const elClass = unit.getAttributeStrict('class');
            const unitName = elClass.match(unitsRegex)?.[0] as keyof PlaceUnitsAmount | undefined;
            assertString(unitName, `Não foi possível extrair o nome da unidade a partir da classe \"${elClass}\".`);
            const unitAmount = unit.parseIntStrict(10, false);
            assertInteger(unitAmount, `Não foi possível extrair a quantidade da unidade \"${unitName}\".`);
            assert(unitAmount === units[unitName], `A quantidade de tropas sendo enviada é diferente da quantidade exigida.`);
        };

        await sendAttack(confirmationButton);
        return true;

    } catch (err) {
        PlunderError.catch(err);
        const selector = '#popup_box_popup_command a.popup_box_close';
        const closeButton = document.querySelector<HTMLAnchorElement>(selector);
        if (closeButton) closeButton.click();
        return false;
    };
};

/** Confirma o envio do ataque pela pop-up da praça de reunião. */
function submitAndWaitConfirmationPopup(commandForm: Element) {
    return new Promise<void>(async (resolve, reject) => {
        const observer = useMutationObserver(document.body, (mutations) => {
            const found = mutations.some((mutation) => {
                return Array.from(mutation.addedNodes).some((node) => {
                    if (!isInstanceOf(node, HTMLElement)) return false;
                    const id = node.getAttribute('id');
                    return id === 'command-data-form';
                });
            });

            if (found) {
                observer.stop();
                resolve();
            };
        }, { subtree: true, childList: true });

        const selector = '#target_attack[class*="attack" i][type="submit"]';
        const submitButton = commandForm.queryAndAssert<HTMLInputElement>(selector);

        // É preciso esperar um breve intervalo antes de emitir o clique.
        // Do contrário, o servidor não tem tempo suficiente para processar o comando.
        await wait();
        submitButton.click();

        // Se não perceber mudanças mesmo após três segundos, rejeita a Promise.
        wait(3000).then(() => observer.stop()).then(() => reject());
    });
};