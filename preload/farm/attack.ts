import { usePlunderStore } from '@/stores/plunder.js';
import { generateIntegerBetween, wait } from '$/helpers.js';
import { ipcSend } from '@/ipc.js';
import type { ExpectedResources } from '$/farm/resources.js';

export const eventTarget = new EventTarget();

export async function prepareAttack(resources: ExpectedResources, button: HTMLAnchorElement) {
    const store = usePlunderStore();
    return new Promise<void>((resolve, reject) => {
        const attackCtrl = new AbortController();
        const delay = store.ignoreDelay === true ? 0 : generateIntegerBetween(200, 300);
        const attackTimeout = setTimeout(() => {
            sendAttack(button)
                .then(() => ipcSend('update-plundered-amount', resources))
                .then(() => resolve())
                .catch((err: unknown) => reject(err))
                .finally(() => attackCtrl.abort());
        // O jogo possui um limite de cinco ações por segundo.
        }, delay);

        eventTarget.addEventListener('stop', () => {
            clearTimeout(attackTimeout);
            attackCtrl.abort();
            reject();
        }, { signal: attackCtrl.signal });
    });
};

/**
 * O Plunder cumpre sua tarefa bem mais rápido que o servidor consegue responder.
 * No entanto, como ele depende do número de tropas ditado pelo jogo, é necessário esperar o valor ser atualizado.
 * @param villageID ID da aldeia.
 * @param model Modelo escolhido para o ataque.
 */
function sendAttack(button: HTMLAnchorElement) {
    return new Promise<void>((resolve, reject) => {
        const observeTroops = new MutationObserver(() => {
            observeTroops.disconnect();
            resolve();
        });

        const unitsRow = document.queryAndAssert('#farm_units #units_home tr:has(td#spear):has(td#sword)');
        observeTroops.observe(unitsRow, { subtree: true, childList: true });
        button.click();

        // Caso o observer não perceber mudanças mesmo após três segundos, emite um erro.
        wait(3000)
            .then(() => observeTroops.disconnect())
            .then(() => reject('TIMEOUT: O servidor demorou demais para responder.'));
    });
};