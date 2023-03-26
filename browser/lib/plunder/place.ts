import { useMutationObserver } from '@vueuse/core';
import { isInstanceOf, assertInstanceOf } from '@tb-dev/ts-guard';
import { wait } from '$browser/utils/helpers';
import type { PlunderTargetInfo } from '$lib/plunder/villages';

export function openPlace(placeButton: PlunderTargetInfo['button']['place']) {
    return new Promise<void>((resolve, reject) => {
        const observer = useMutationObserver(document.body, (mutations) => {
            const found = mutations.some((mutation) => {
                return Array.from(mutation.addedNodes).some((node) => {
                    if (!isInstanceOf(node, HTMLElement)) return false;
                    const id = node.getAttribute('id');
                    return id === 'command-data-form';
                });
            });

            if (!found) return;
            observer.stop();
            resolve();
        }, { subtree: true, childList: true });

        assertInstanceOf(placeButton, HTMLElement, 'O botão da praça de reunião não existe.');
        placeButton.click();

        // Se não perceber mudanças mesmo após três segundos, rejeita a Promise.
        wait(3000).then(() => observer.stop()).then(() => reject());
    });
};