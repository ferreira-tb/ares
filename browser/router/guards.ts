import { getPlunderInfo } from '$lib/plunder/info';
import type { Router } from 'vue-router';

export function setNavigationGuards(router: Router) {
    router.beforeEach(async (to) => {
        if (to.name === 'am_farm') await getPlunderInfo();
    });
};