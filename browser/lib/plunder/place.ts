import { useMutationObserver } from '@vueuse/core';
import { isInstanceOf, assertInstanceOf } from '@tb-dev/ts-guard';
import { wait } from '$global/utils/helpers.js';
import type { PlunderVillageInfo } from '$lib/plunder/villages.js';

export function openPlace(placeButton: PlunderVillageInfo['button']['place']) {
    return new Promise<void>((resolve, reject) => {
        const observer = useMutationObserver(document.body, (mutations) => {
            const found = mutations.some((mutation) => {
                return Array.from(mutation.addedNodes).some((node) => {
                    if (!isInstanceOf(node, HTMLElement)) return false;
                    const id = node.getAttribute('id');
                    return id === 'command-data-form';
                });
            });

            if (found) {
                observer.stop();
                resolve();
            };
        }, { subtree: true, childList: true });

        assertInstanceOf(placeButton, HTMLElement, 'O botão da praça de reunião não existe.');
        placeButton.click();

        // Se não perceber mudanças mesmo após três segundos, rejeita a Promise.
        wait(3000).then(() => observer.stop()).then(() => reject());
    });
};