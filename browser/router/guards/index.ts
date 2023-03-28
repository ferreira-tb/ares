import { setPlunderNavigationGuards, preparePlunderRoute } from '$browser/router/guards/plunder';
import type { Router } from 'vue-router';

export function setNavigationGuards(router: Router) {
    router.beforeEach(async (to) => {
        if (to.name === 'am_farm') await preparePlunderRoute();
    });

    setPlunderNavigationGuards(router);
};