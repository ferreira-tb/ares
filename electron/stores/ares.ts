import { ref } from 'mechanus';

export function defineAresStore(mechanus: Mechanus) {
    return mechanus.define('ares', {
        locale: ref<string | null>(null),
        world: ref<World | null>(null),
        majorVersion: ref<string | null>(null),

        screen: ref<string | null>(null),
        screenMode: ref<string | null>(null),
        pregame: ref<boolean | null>(null),
        groupId: ref<number | null>(null),

        captcha: ref<boolean>(false),
        responseTime: ref<number | null>(null)
    } satisfies MechanusAresStoreType);
};