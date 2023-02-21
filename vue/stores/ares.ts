import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { World } from '$types/game.js';

/** `null` indica que o usuário se encontra numa página a partir da qual não é possível obter essas informações. */
export const useAresStore = defineStore('ares', () => {
    /** Localização do jogo. */
    const locale = ref<string | null>(null);
    /** Mundo atual. */
    const currentWorld = ref<World | null>(null);
    /** Versão do Tribal Wars. */
    const majorVersion = ref<string | null>(null);
    /** Jogador logado no momento. */
    const currentPlayer = ref<string | null>(null);
    /** ID do jogador. */
    const currentPlayerId = ref<number | null>(null);
    /** Pontuação do jogador. */
    const currentPlayerPoints = ref<number | null>(null);
    /** Quantidade de aldeias que o jogador possui. */
    const villageAmount = ref<number | null>(null);
    /** ID do grupo de aldeia atual. */
    const groupId = ref<number | null>(null);

    /** Indica se o jogador possui conta premium. */
    const premium = ref<boolean | null>(null);
    /** Indica se o jogador possui gerente de conta. */
    const accountManager = ref<boolean | null>(null);
    /** Indica se o jogador possui assistente de saque. */
    const farmAssistant = ref<boolean | null>(null);

    /** Página atual. */
    const currentScreen = ref<string | null>(null);
    /** Modo da janela atual. */
    const screenMode = ref<string | null>(null);
    /** Indica se está no modo de pré-jogo. */
    const pregame = ref<boolean | null>(null);

    /** Coordenada X da aldeia atual. */
    const currentX = ref<number | null>(null);
    /** Coordenada Y da aldeia atual. */
    const currentY = ref<number | null>(null);
    /** Coordenadas da aldeia atual no formato de tupla. */
    const currentCoords = computed(() => [currentX.value, currentY.value]);
    /** ID da aldeia atual. */
    const currentVillageId = ref<number | null>(null);
    /** Nome da aldeia atual. */
    const currentVillageName = ref<string | null>(null);
    /** População da aldeia atual. */
    const currentVillagePopulation = ref<number | null>(null);
    /** População máxima da aldeia atual. */
    const currentVillageMaxPopulation = ref<number | null>(null);
    /** Pontos da aldeia atual. */
    const currentVillagePoints = ref<number | null>(null);
    /** Quantidade de madeira na aldeia atual. */
    const currentVillageWood = ref<number | null>(null);
    /** Quantidade de argila na aldeia atual. */
    const currentVillageStone = ref<number | null>(null);
    /** Quantidade de ferro na aldeia atual. */
    const currentVillageIron = ref<number | null>(null);
    /** Quantidade total de recursos na aldeia atual. */
    const currentVillageTotalResources = computed(() => {
        if (currentVillageWood.value === null) return null;
        if (currentVillageStone.value === null) return null;
        if (currentVillageIron.value === null) return null;
        return currentVillageWood.value + currentVillageStone.value + currentVillageIron.value;
    });
    /** Capacidade de armazenamento máximo da aldeia atual. */
    const currentVillageMaxStorage = ref<number | null>(null);

    return {
        locale,
        majorVersion,
        currentPlayer,
        currentPlayerId,
        currentPlayerPoints,
        villageAmount,
        groupId,
        currentScreen,
        currentWorld,
        premium,
        accountManager,
        farmAssistant,
        screenMode,
        pregame,
        currentX,
        currentY,
        currentCoords,
        currentVillageId,
        currentVillageName,
        currentVillagePopulation,
        currentVillageMaxPopulation,
        currentVillagePoints,
        currentVillageWood,
        currentVillageStone,
        currentVillageIron,
        currentVillageTotalResources,
        currentVillageMaxStorage,
    };
});