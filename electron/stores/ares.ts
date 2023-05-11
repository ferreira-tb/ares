import { ref } from 'mechanus';

import {
    stringOrNullRef,
    worldOrNullRef,
    booleanOrNullRef,
    booleanRef,
    integerOrNullRef
} from '$electron/utils/mechanus';

export function defineAresStore(mechanus: Mechanus) {
    return mechanus.define('ares', {
        locale: ref<string | null>(null, stringOrNullRef),
        world: ref<World | null>(null, worldOrNullRef),
        majorVersion: ref<string | null>(null, stringOrNullRef),

        screen: ref<string | null>(null, stringOrNullRef),
        screenMode: ref<string | null>(null, stringOrNullRef),
        pregame: ref<boolean | null>(null, booleanOrNullRef),

        captcha: ref<boolean>(false, booleanRef),
        responseTime: ref<number | null>(null, integerOrNullRef)
    } satisfies MechanusAresStoreType);
};