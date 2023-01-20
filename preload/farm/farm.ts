import { patchPlunderStore } from '@/stores/plunder.js';
import { queryModelData } from "$/farm/models.js";
import { queryVillagesInfo } from '$/farm/villages.js';
import { ClaustrophobicError } from '@/error.js';
import { queryCurrentVillageCoords } from '$/helpers.js';

export async function loadFarmModule() {
    try {
        await patchPlunderStore();

        queryCurrentVillageCoords();
        queryModelData();
        queryVillagesInfo();

    } catch (err) {
        ClaustrophobicError.handle(err);
    };
};