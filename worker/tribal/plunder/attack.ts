import { storeToRefs } from 'pinia';
import { useEventListener, useMutationObserver } from '@vueuse/core';
import { assertInteger, isInstanceOf, assertString } from '$common/guards';
import { useGameDataStore, usePlunderConfigStore } from '$renderer/stores';
import { generateRandomDelay } from '$common/utils';
import { wait } from '$renderer/utils/timers';
import { unitsRegex } from '$common/regex';
import { ipcSend, ipcInvoke } from '$renderer/ipc';
import { PlunderError } from '$browser/error';
import type { PlunderAttack } from '$common/templates';

export const eventTarget = new EventTarget();

export function prepareAttack(plunderAttack: PlunderAttack, button: HTMLAnchorElement) {
    const config = usePlunderConfigStore();
    const gameData = useGameDataStore();

    const { village } = storeToRefs(gameData);

    return new Promise<void>((resolve, reject) => {
        // O jogo possui um limite de cinco ações por segundo.
        const delay = config.ignoreDelay ? 0 : generateRandomDelay(config.attackDelay);
        const attackTimeout = setTimeout(attack, delay);
        const cleanup = useEventListener(eventTarget, 'stop', stop, { once: true });

        function attack() {
            sendAttack(button)
                .then(() => ipcSend('plunder:attack-sent', village.value.id, plunderAttack))
                .then(() => resolve())
                .catch((err: unknown) => reject(err))
                .finally(() => cleanup());
        }

        function stop() {
            clearTimeout(attackTimeout);
            reject();
        }
    });
}

/**
 * O Plunder cumpre sua tarefa bem mais rápido que o servidor consegue responder.
 * No entanto, como ele depende do número de tropas ditado pelo jogo, é necessário esperar o valor ser atualizado.
 * @param button Botão usado para atacar com o modelo.
 */
function sendAttack(button: HTMLAnchorElement) {
    return new Promise<void>(async (resolve, reject) => {
        const selector = '#farm_units #units_home tr:has(td#spear):has(td#sword)';
        const unitsRow = document.queryStrict<HTMLTableRowElement>(selector);

        const observer = useMutationObserver(unitsRow, () => {
            observer.stop();
            resolve();
        }, { subtree: true, childList: true });

        button.click();

        // Se não perceber mudanças mesmo após três segundos, rejeita a Promise.
        await wait(3000);
        observer.stop();
        reject();
    });
}

/**
 * Envia um ataque com as unidades especificadas a partir da praça de reunião.
 * É necessário primeiro abrir a praça de reunião usando a função `openPlace()`.
 * @param units Unidades que serão enviadas.
 * @returns `true` se o ataque foi enviado com sucesso, `false` caso contrário.
 */
export async function sendAttackFromPlace(units: PlaceUnitAmount): Promise<boolean> {
    try {
        const isArcherWorld = await ipcInvoke('world:is-archer-world');
        if (typeof isArcherWorld !== 'boolean') {
            throw new PlunderError('Could not determine if world is archer world.');
        }
        
        const commandForm = document.queryStrict('#command-data-form[action*="place" i]');
        for (const [key, value] of Object.entries(units)) {
            if (!isArcherWorld && /archer/.test(key)) continue;
            assertInteger(value, `Expected integer value for ${key}, but got ${value}.`);

            const selector = `input#unit_input_${key}[name*="${key}" i][class*="unitsInput" i]`;
            const input = commandForm.queryStrict<HTMLInputElement>(selector);
            input.value = value.toString(10);
        }

        await submitAndWaitConfirmationPopup(commandForm);

        const buttonSelector = '#troop_confirm_submit[class*="troop_confirm_go" i][type="submit"]';
        const confirmationButton = document.queryStrict<HTMLAnchorElement>(buttonSelector);

        const unitsSelector = '#place_confirm_units tr.units-row td[class*="unit-item" i]:not(.hidden)';
        const unitsBeingSent = document.queryAsArray(unitsSelector);

        // Confirma se a quantidade de tropas sendo enviada é igual à quantidade de tropas exigida.
        for (const unit of unitsBeingSent) {
            const elClass = unit.getAttributeStrict('class');
            const unitName = elClass.match(unitsRegex)?.[0] as keyof PlaceUnitAmount | undefined;
            assertString(unitName, `Could not determine unit name from class "${elClass}".`);
            const unitAmount = unit.parseIntStrict(10, false);
            assertInteger(unitAmount, `Could not determine ${unitName} amount.`);

            if (unitAmount !== units[unitName]) {
                throw new PlunderError(`${unitName} amount is not equal to the required amount.`);
            }
        }

        await sendAttack(confirmationButton);
        return true;

    } catch (err) {
        PlunderError.catch(err);
        const selector = '#popup_box_popup_command a.popup_box_close';
        const closeButton = document.querySelector<HTMLAnchorElement>(selector);
        if (closeButton) closeButton.click();
        return false;
    }
}

/** Confirma o envio do ataque pela pop-up da praça de reunião. */
function submitAndWaitConfirmationPopup(commandForm: Element) {
    return new Promise<void>(async (resolve, reject) => {
        const observer = useMutationObserver(document.body, (mutations) => {
            const found = mutations.some((mutation) => {
                return Array.from(mutation.addedNodes).some((node) => {
                    if (!isInstanceOf(node, HTMLElement)) return false;
                    return node.matches('#command-data-form');
                });
            });

            if (!found) return;
            observer.stop();
            resolve();
        }, { subtree: true, childList: true });

        const selector = '#target_attack[class*="attack" i][type="submit"]';
        const submitButton = commandForm.queryStrict<HTMLInputElement>(selector);

        // É preciso esperar um breve intervalo antes de emitir o clique.
        // Do contrário, o servidor não tem tempo suficiente para processar o comando.
        await wait();
        submitButton.click();

        // Se não perceber mudanças mesmo após três segundos, rejeita a Promise.
        await wait(3000);
        observer.stop();
        reject();
    });
}