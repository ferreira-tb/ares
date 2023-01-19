import { getCoordsFromTextContent } from '$/helpers.js';
import { assert, assertDOM } from '@/error.js';
import type { WallLevel } from '@/types.js';

export class PlunderVillageInfo {
    /** Data do último ataque contra a aldeia. */
    lastAttack: number = 0;
    /** Indica se há informações obtidas por exploradores. */
    spyStatus: boolean = false;
    /** Nível da muralha. */
    wallLevel: WallLevel = 0;
    /** Distância até à aldeia. */
    distance: number = Infinity;

    /** Estimativa da quantidade de madeira disponível na aldeia. */
    wood: number = 0;
    /** Estimativa da quantidade de argila disponível na aldeia. */
    stone: number = 0;
    /** Estimativa da quantidade de ferro disponível na aldeia. */
    iron: number = 0;
    /** Total de recursos disponíveis na aldeia. */
    total: number = 0;

    /** Botão A do assistente de saque. */
    aButton: HTMLElement | null = null;
    /** Botão B do assistente de saque. */
    bButton: HTMLElement | null = null;
    /** Botão C do assistente de saque. */
    cButton: HTMLElement | null = null;
    /** Botão para abrir a janela de comandos no assistente de saque. */
    place: HTMLElement | null = null;

    /** Indica se o botão C está ativo ou não. */
    cStatus: boolean = false;
};

export function queryVillagesInfo() {
    const plunderListRows = document.querySelectorAll('#plunder_list tbody tr[id^="village_"]');
    for (const row of Array.from(plunderListRows)) {
        if (row.hasAttribute('data-tb-village')) continue;

        // A coerção à string é válida pois já foi verificada a existência do id ao usar querySelectorAll();
        let villageId = row.getAttribute('id') as string;
        villageId = villageId.replace(/\D/g, '');

        // Objeto onde serão armazenadas as informações sobre a aldeia.
        //const info = new PlunderVillageInfo();

        // Facilita o acesso ao id da aldeia.
        row.setAttribute('data-tb-village', villageId);

        // Campo de relatório. É usado para calcular a distância até a aldeia-alvo.
        const report = row.querySelector('td a[href*="screen=report"]');
        assertDOM(report, 'td a[href*="screen=report"]');
        const coords = getCoordsFromTextContent(report.textContent);
        assert(Array.isArray(coords), 'Não foi possível obter as coordenadas da aldeia-alvo.');

    };
};