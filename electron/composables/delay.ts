import { computed, storeToRefs } from 'mechanus';
import { Kronos } from '@tb-dev/kronos';
import { useCacheStore } from '$electron/stores';

function createUseDelay() {
    const cacheStore = useCacheStore();
    const { responseTime } = storeToRefs(cacheStore);

    const delay = computed([responseTime], () => {
        return (Kronos.Second * 5) + (responseTime.value ?? 1000);
    });

    return () => delay;
};

/** Delay baseado no tempo de resposta do servidor. */
export const useDelay = createUseDelay();