import { usePlunderStore } from '#/vue/stores/plunder.js';
import { generateIntegerBetween, wait } from '#/helpers.js';
import { ipcSend } from '#/ipc.js';
import type { PlunderedResources } from '$/farm/resources.js';

export const eventTarget = new EventTarget();

export class PlunderAttack {
    /** Tipo do modelo ("a" ou "b", por exemplo). */
    readonly type: string;
    /**
     * Quantidade de recursos que se estima obter com o ataque.
     * Se o Deimos puder fazer previsões no mundo, o valor dessa propriedade será a previsão feita por ele.
     * Do contrário, é usada a capacidade de carga do modelo.
     */
    readonly loot: number;

    constructor(type: string, loot: number) {
        this.type = type;
        this.loot = loot;
    };
};

export async function prepareAttack(resources: PlunderedResources, button: HTMLAnchorElement) {
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
 * @param button Botão usado para atacar com o modelo.
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