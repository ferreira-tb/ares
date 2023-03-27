import { storeToRefs } from 'pinia';
import { useAresStore } from '$global/stores/ares';
import type { Router } from 'vue-router';

export function setNavigationGuards(router: Router) {
    const aresStore = useAresStore();
    const { captcha } = storeToRefs(aresStore);

    router.beforeEach((to) => {
        if (captcha.value && to.name !== 'captcha') {
            return { name: 'captcha' };
        };

        return true;
    });
};