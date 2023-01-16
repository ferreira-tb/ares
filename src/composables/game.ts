import { storeToRefs } from 'pinia';
import { assert } from "@/error.js";
import { usePhobiaStore } from '@/stores/store.js';
import { computed } from 'vue';
import type { ComputedRef, Ref } from 'vue';

/** Obtém o valor de algum campo da URL. */
function useCurrentField(fieldName: string) {
    const phobiaStore = usePhobiaStore();
    const { currentURL } = storeToRefs(phobiaStore);

    return function(url: Ref<string> = currentURL): ComputedRef<string | null> {
        assert(typeof url.value === 'string', 'A URL fornecida é inválida.');

        return computed(() => {
            const urlFields = (url.value.replace('\?', '')).split('\&');
            for (const field of urlFields) {
                if (field.includes(`${fieldName}=`)) return field.replace(`${fieldName}=`, '');
            };
            return null;
        });
    };
};

export const useCurrentScreen = useCurrentField('screen');
export const useCurrentMode = useCurrentField('mode');
export const useCurrentSubType = useCurrentField('subtype');