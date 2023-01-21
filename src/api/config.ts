import { usePhobiaStore } from "@/stores/store.js";
import { ipcInvoke } from '@/ipc.js';
import { assert } from "@/error.js";
import { queryXMLTags } from "$/helpers.js";
import { allUnits } from '@/constants.js';
import type { UnitDetails } from '@/types.js';

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
        this.archer = getValue('archer') === 1 ? true : false;
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
export async function verifyWorldAndUnitData() {
    const phobiaStore = usePhobiaStore();
    if (typeof phobiaStore.currentWorld !== 'string') {
        phobiaStore.currentWorld = await ipcInvoke('get-current-world');
        assert(phobiaStore.currentWorld !== null, 'Não há informação sobre o mundo atual.');
    };

    // Verifica se as informações já estão salvas no armazenamento.
    let worldDataStatus = await ipcInvoke('has-world-data', phobiaStore.currentWorld);
    let unitDataStatus = await ipcInvoke('has-unit-data', phobiaStore.currentWorld);
    if (worldDataStatus && unitDataStatus) return true;

    const worldDataUrl = getWorldDataUrl(phobiaStore.currentWorld);
    const unitDataUrl = getUnitDataUrl(phobiaStore.currentWorld);

    try {
        const worldDocument = await fetchHtmlDocument(worldDataUrl);
        const unitDocument = await fetchHtmlDocument(unitDataUrl);

        const worlData = new WorldData(worldDocument);
        const unitData = new UnitData(unitDocument);

        worldDataStatus = await ipcInvoke('set-world-data', phobiaStore.currentWorld, worlData);
        unitDataStatus = await ipcInvoke('set-unit-data', phobiaStore.currentWorld, unitData);
        
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