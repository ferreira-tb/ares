import { queryModelData } from "$/farm/model.js";
import { patchPlunderStore } from '@/stores/plunder.js';
import { ClaustrophobicError } from '@/error.js';

export async function loadFarmModule() {
    try {
        await patchPlunderStore();

        queryModelData();

    } catch (err) {
        ClaustrophobicError.handle(err);
    };
};