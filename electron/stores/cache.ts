import { computed, ref } from 'mechanus';
import { isString, isWorld } from '$common/guards';

export function defineCacheStore(mechanus: Mechanus) {
    return mechanus.define('cache', () => {
        const region = ref<GameRegion>('br');
        const world = ref<World | null>(null);
        const player = ref<string | null>(null);

        // Alias do usuário, no padrão `/^[a-z]+\d+_/`, seguido do nome do jogador.
        // Ele é usado para diferenciar tanto diferentes jogadores quanto diferentes mundos do mesmo jogador.
        const userAlias = computed<UserAlias | null>([world, player], () => {
            if (!isString(player.value) || !isWorld(world.value)) return null;
            const playerName = encodeURIComponent(player.value);
            return `${world.value}_${playerName}`;
        });

        return {
            region,
            world,
            player,
            userAlias
        } satisfies MechanusCacheStoreType;
    });
};