import { ref } from 'mechanus';

export function defineBrowserStore(mechanus: Mechanus) {
    return mechanus.define('browser', () => {
        const captcha = ref<boolean>(false);
        const responseTime = ref<number | null>(null);

        return {
            captcha,
            responseTime
        } satisfies MechanusBrowserStoreType;
    });
}