import { computed } from 'vue';
import { assert } from "@/error.js";
import type { ComputedRef, Ref } from 'vue';

/** Obtém o valor de algum campo da URL. */
function useCurrentField(fieldName: string) {
    return function(url: Ref<string>): ComputedRef<string | null> {
        assert(typeof url.value === 'string', 'A URL é inválida.');

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