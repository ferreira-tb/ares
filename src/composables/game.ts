import { computed } from 'vue';
import { assertType } from "@/error.js";
import type { ComputedRef, Ref } from 'vue';
import type { GameScreen } from '@/types.js';

/** Obtém o valor de algum campo da URL. */
type CurrentFieldReturnType<T extends string> = (url: Ref<string>) => ComputedRef<T | null>
function useCurrentField(fieldName: 'screen'): CurrentFieldReturnType<GameScreen>;
function useCurrentField(fieldName: 'mode'): CurrentFieldReturnType<string>;
function useCurrentField(fieldName: 'subtype'): CurrentFieldReturnType<string>;
function useCurrentField(fieldName: 'village'): CurrentFieldReturnType<string>;
function useCurrentField(fieldName: string) {
    return function(url: Ref<string>): ComputedRef<string | null> {
        assertType(typeof url.value === 'string', 'A URL é inválida.');

        return computed(() => {
            const urlObject = new URL(url.value);
            return urlObject.searchParams.get(fieldName);
        });
    };
};

export const useCurrentScreen = useCurrentField('screen');
export const useCurrentMode = useCurrentField('mode');
export const useCurrentSubType = useCurrentField('subtype');
export const useCurrentVillageId = useCurrentField('village');