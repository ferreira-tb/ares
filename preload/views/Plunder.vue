<script setup lang="ts">
import { watchEffect } from 'vue';
import { patchPlunderStore, usePlunderStore } from '@/stores/plunder.js';
import { queryModelData, attackModel, resources } from '$/farm/models.js';
import { queryVillagesInfo, villagesInfo } from '$/farm/villages.js';
import { queryCurrentVillageCoords } from '$/helpers.js';
import { queryAvailableUnits } from '$/farm/units.js';
import { ExpectedResources } from '$/farm/resources.js';
import { prepareAttack, eventTarget as attackEventTarget } from '$/farm/attack.js';
import { assert, ClaustrophobicError } from '@/error.js';

const store = usePlunderStore();

// Atualiza a store do Plunder com os valores salvos no armazenamento.
await patchPlunderStore();

// Reune informações necessárias para o funcionamento do Plunder.
queryCurrentVillageCoords();
queryModelData();
queryAvailableUnits();
queryVillagesInfo();

watchEffect(() => {
    if (store.status === true) {
        const event = new Event('stop');
        attackEventTarget.dispatchEvent(event);
        handleAttack();
    };
});

async function handleAttack(): Promise<void> {
    if (store.status === false) return;

    // Seleciona todas as aldeias da tabela.
    const plunderList = document.queryAndAssert('#plunder_list:has(tr[id^="village"]) tbody');
    const villages = plunderList.queryAsArray<HTMLTableRowElement>('tr[data-tb-village]');

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

        if (attackModel.value === null) continue;

        const expectedResources = new ExpectedResources(info, attackModel.value.carry);
        const attackButton = info[attackModel.value.type];
        assert(attackButton, `O botão do modelo ${attackModel.value.type.toUpperCase()} não foi encontrado.`);

        return prepareAttack(expectedResources, attackButton)
            .then(() => village.remove())
            .then(() => handleAttack())
            .catch((err: unknown) => ClaustrophobicError.handle(err));
    };
};
</script>