import { useAresStore } from "$vue/stores/ares.js";
import { ipcInvoke } from '$global/ipc.js';
import { assert, isString } from '@tb-dev/ts-guard';
import { queryXMLTags } from '$global/utils/helpers.js';
import { allUnits } from '$global/utils/constants.js';
import type { UnitDetails } from '$types/game.js';

export class WorldData {
    /** Data do último fetch. */
    readonly fetch = Date.now();
    /** Velocidade do mundo. */
    readonly speed: number;
    /** Velocidade das unidades. */
    readonly unitSpeed: number;
    /** Indica se o mundo possui arqueiros. */
    readonly archer: boolean;

    /** Configurações do mundo atual. */
    constructor(configXML: XMLDocument) {
        const getValue = queryXMLTags(configXML, 'world');

        this.speed = getValue('speed');
        this.unitSpeed = getValue('unit_speed');
        this.archer = getValue('archer') === 1;
    };
};

export class UnitData {
    /** Data do último fetch. */
    readonly fetch = Date.now();

    readonly spear!: UnitDetails;
    readonly sword!: UnitDetails;
    readonly axe!: UnitDetails;
    readonly archer!: UnitDetails;
    readonly spy!: UnitDetails;
    readonly light!: UnitDetails;
    readonly marcher!: UnitDetails;
    readonly heavy!: UnitDetails;
    readonly ram!: UnitDetails;
    readonly catapult!: UnitDetails;
    readonly knight!: UnitDetails;
    readonly snob!: UnitDetails;
    readonly militia!: UnitDetails;

    /** Velocidade e capacidade de carga individual de cada unidade do jogo. */
    constructor(configXML: XMLDocument) {
        const getValue = queryXMLTags(configXML, 'unit');

        for (const unit of allUnits) {
            this[unit] = {
                speed: getValue(`${unit} speed`),
                carry: getValue(`${unit} carry`) 
            };
        };
    };
};

const getWorldDataUrl = (world: string) => `https://${world}.tribalwars.com.br/interface.php?func=get_config`;
const getUnitDataUrl = (world: string) => `https://${world}.tribalwars.com.br/interface.php?func=get_unit_info`;

/**
 * Verifica se as informações sobre o mundo e suas unidades estão salvas no armazenamento.
 * Se não estiverem, tenta fazer download desses dados.
 * @returns `boolean` indicando o status da operação.
 * Se `true`, os dados estão disponíveis no armazenamento e poderão ser acessados normalmente.
 * Se `false`, eles tanto não estão disponíveis quanto não foi possível obtê-los.
 */
export async function verifyWorldAndUnitData(aresStore?: ReturnType<typeof useAresStore>): Promise<boolean> {
    if (!aresStore) aresStore = useAresStore();
    if (!isString(aresStore.currentWorld)) return false;

    // Verifica se as informações já estão salvas no armazenamento.
    let worldDataStatus = await ipcInvoke('has-world-data', aresStore.currentWorld);
    let unitDataStatus = await ipcInvoke('has-unit-data', aresStore.currentWorld);
    if (worldDataStatus && unitDataStatus) return true;

    const worldDataUrl = getWorldDataUrl(aresStore.currentWorld);
    const unitDataUrl = getUnitDataUrl(aresStore.currentWorld);

    try {
        const worldDocument = await fetchHtmlDocument(worldDataUrl);
        const unitDocument = await fetchHtmlDocument(unitDataUrl);

        const worlData = new WorldData(worldDocument);
        const unitData = new UnitData(unitDocument);

        worldDataStatus = await ipcInvoke('set-world-data', aresStore.currentWorld, worlData);
        unitDataStatus = await ipcInvoke('set-unit-data', aresStore.currentWorld, unitData);
        
        if (worldDataStatus && unitDataStatus) return true;
        return false;

    } catch {
        return false;
    };
};

async function fetchHtmlDocument(url: string): Promise<XMLDocument> {
    const response = await fetch(url);
    assert(response.ok === true, 'Não foi possível obter as informações sobre o mundo.');

    const text = await response.text();
    return new DOMParser().parseFromString(text, 'text/xml');
};