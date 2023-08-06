import { useMutationObserver } from '@vueuse/core';
import { isInstanceOf, assertInstanceOf } from '$common/guards';
import { wait } from '$renderer/utils/timers';
import type { PlunderTargetInfo } from '$browser/lib/plunder/targets';

export function openPlace(placeButton: PlunderTargetInfo['button']['place']) {
    return new Promise<void>(async (resolve, reject) => {
        const observer = useMutationObserver(document.body, (mutations) => {
            const found = mutations.some((mutation) => {
                return Array.from(mutation.addedNodes).some((node) => {
                    if (!isInstanceOf(node, HTMLElement)) return false;
                    return node.matches('#command-data-form');
                });
            });

            if (!found) return;
            observer.stop();
            resolve();
        }, { subtree: true, childList: true });

        assertInstanceOf(placeButton, HTMLElement, 'Place button does not exist.');
        placeButton.click();

        // Se não perceber mudanças mesmo após três segundos, rejeita a Promise.
        await wait(3000);
        observer.stop();
        reject();
    });
}