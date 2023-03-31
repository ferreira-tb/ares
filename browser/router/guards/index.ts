import { setPlunderNavigationGuards, preparePlunderRoute } from '$browser/router/guards/plunder';
import { BrowserRouterError } from '$browser/error';
import type { Router } from 'vue-router';

export function setNavigationGuards(router: Router) {
    router.beforeEach(async (to) => {
        try {
            if (to.name === 'am_farm') await preparePlunderRoute();
        } catch (err) {
            BrowserRouterError.catch(err);
        };
    });

    setPlunderNavigationGuards(router);
};