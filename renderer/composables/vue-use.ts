import {
    computedAsync as computedAsyncOriginal,
    useElementSize as useElementSizeOriginal
} from '@vueuse/core';
import type {
    AsyncComputedOnCancel,
    ElementSize,
    UseResizeObserverOptions
} from '@vueuse/core';

/** Exatamente como o `computedAsync` do vueuse, mas com o estado inicial como primeiro parâmetro. */
export function computedAsync<T>(
    initialState: T,
    evaluationCallback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
    optionsOrRef?: Parameters<typeof computedAsyncOriginal>[2]
) {
    return computedAsyncOriginal<T>(evaluationCallback, initialState, optionsOrRef);
}

/** Exatamente como o useElementSize do vueuse, mas com `{ box: 'border-box' }`. */
export function useElementSize(element: Parameters<typeof useElementSizeOriginal>[0]) {
    const initialSize: ElementSize = { width: 0, height: 0 };
    const options: UseResizeObserverOptions = { box: 'border-box' };
    return useElementSizeOriginal(element, initialSize, options);
}