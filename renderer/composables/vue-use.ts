import { useElementSize as useElementSizeOriginal } from '@vueuse/core';
import type { ElementSize, UseResizeObserverOptions } from '@vueuse/core';

/** Exatamente como o useElementSize do vueuse, mas com `{ box: 'border-box' }`. */
export function useElementSize(element: Parameters<typeof useElementSizeOriginal>[0]) {
    const initialSize: ElementSize = { width: 0, height: 0 };
    const options: UseResizeObserverOptions = { box: 'border-box' };
    const { width, height } = useElementSizeOriginal(element, initialSize, options);
    return { width, height };
}