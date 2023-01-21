<script setup lang="ts">
import { patchPlunderStore, usePlunderStore } from '@/stores/plunder.js';
import { queryModelData, bestModel, otherModel, canAttack, resources } from '$/farm/models.js';
import { queryVillagesInfo, villagesInfo } from '$/farm/villages.js';
import { ClaustrophobicError } from '@/error.js';
import { queryCurrentVillageCoords } from '$/helpers.js';
import { queryAvailableUnits } from '$/farm/units.js';

const store = usePlunderStore();

try {
    // Atualiza a store do Plunder com os valores salvos no armazenamento.
    await patchPlunderStore();

    // Reune informações necessárias para o funcionamento do Plunder.
    queryCurrentVillageCoords();
    queryModelData();
    queryAvailableUnits();
    queryVillagesInfo();

    // Alea iacta est.
    handleAttack();

} catch (err) {
    ClaustrophobicError.handle(err);
};

async function handleAttack() {
    try {
        if (store.status === false) return;

        // Seleciona todas as aldeias da tabela.
        const plunderList = document.queryAndAssert('#plunder_list:has(tr[id^="village"]) tbody');
        const villages = plunderList.queryAsArray('tr[data-tb-village]');

        for (const village of villages) {
            const villageId = village.assertAttribute('data-tb-village');

            // Ignora a linha caso ela esteja oculta, removendo-a da tabela.
            if (village.getAttribute('style')?.includes('display: none')) {
                village.remove();
                villagesInfo.delete(villageId);
                continue;
            };

            /** Informações sobre a aldeia. */
            const info = villagesInfo.assert(villageId);
            resources.value = info.total;
            
            if (canAttack.value === false) continue;
            console.log(bestModel, otherModel);
        };

    } catch (err) {
        ClaustrophobicError.handle(err);
    };
};
</script>