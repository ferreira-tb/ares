import { patchPlunderStore } from '@/stores/plunder.js';
import { queryModelData } from '$/farm/models.js';
import { queryVillagesInfo } from '$/farm/villages.js';
import { ClaustrophobicError } from '@/error.js';
import { queryCurrentVillageCoords } from '$/helpers.js';
import { queryAvailableUnits } from '$/farm/units.js';

export async function loadFarmModule() {
    try {
        await patchPlunderStore();

        queryCurrentVillageCoords();
        queryModelData();
        queryAvailableUnits();
        queryVillagesInfo();

    } catch (err) {
        ClaustrophobicError.handle(err);
    };
};