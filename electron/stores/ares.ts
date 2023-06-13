import { ref } from 'mechanus';

export function defineAresStore(mechanus: Mechanus) {
    return mechanus.define('ares', () => {
        const locale = ref<string | null>(null);
        const world = ref<World | null>(null);
        const majorVersion = ref<string | null>(null);

        const screen = ref<string | null>(null);
        const screenMode = ref<string | null>(null);
        const pregame = ref<boolean | null>(null);
        const groupId = ref<number | null>(null);

        const captcha = ref<boolean>(false);
        const responseTime = ref<number | null>(null);

        return {
            locale,
            world,
            majorVersion,

            screen,
            screenMode,
            pregame,
            groupId,

            captcha,
            responseTime
        } satisfies MechanusAresStoreType;
    });
};