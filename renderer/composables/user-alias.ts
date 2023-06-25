import { effectScope, readonly, ref } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';
import { ipcInvoke } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables';
import { RendererProcessError } from '$renderer/error';

export function useUserAlias() {
    const scope = effectScope();
    const userAlias = ref<UserAlias | null>(null);

    ipcInvoke('user:get-alias').then(
        (newAlias) => (userAlias.value = newAlias),
        (err: unknown) => RendererProcessError.catch(err)
    );

    scope.run(() => {
        useIpcOn('user:did-change-alias', (_e, newAlias: UserAlias | null) => {
            userAlias.value = newAlias;
        });
    });

    tryOnScopeDispose(() => scope.stop());

    return readonly(userAlias);
}