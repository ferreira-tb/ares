import { arrayIncludes } from '@tb-dev/ts-guard';
import { routeNames, router } from '$panel/router/router';
import type { useAresStore } from '$vue/stores/ares';

export function pushRoute(screenName: ReturnType<typeof useAresStore>['screen']) {
    if (screenName && arrayIncludes(routeNames, screenName)) {
        router.push({ name: screenName });
    } else {
        router.push('/');
    };
};