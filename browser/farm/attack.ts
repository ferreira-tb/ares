import { useEventListener, useMutationObserver } from '@vueuse/core';
import { usePlunderStore } from '$vue/stores/plunder.js';
import { generateIntegerBetween, wait } from '$global/helpers.js';
import { ipcSend } from '$global/ipc.js';
import type { PlunderedResources } from '$browser/farm/resources.js';

export const eventTarget = new EventTarget();

export function prepareAttack(resources: PlunderedResources, button: HTMLAnchorElement) {
    const store = usePlunderStore();
    return new Promise<void>((resolve, reject) => {
        // O jogo possui um limite de cinco ações por segundo.
        const delay = store.ignoreDelay === true ? 0 : generateIntegerBetween(200, 300);
        const attackTimeout = setTimeout(attack, delay);
        const cleanup = useEventListener(eventTarget, 'stop', stop, { once: true });

        function attack() {
            sendAttack(button)
                .then(() => ipcSend('update-plundered-amount', resources))
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

        // Caso o observer não perceber mudanças mesmo após três segundos, emite um erro.
        wait(3000).then(() => observer.stop())
            .then(() => reject('TIMEOUT: O servidor demorou demais para responder.'));
    });
};