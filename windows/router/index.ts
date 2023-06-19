import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import { StandardWindowName } from '$common/constants';
import ConfigView from '$windows/views/ConfigView.vue';
import ConfigAdvanced from '$windows/components/ConfigAdvanced.vue';
import ConfigBuildingsSnob from '$windows/components/ConfigBuildingsSnob.vue';
import ConfigGeneral from '$windows/components/ConfigGeneral.vue';
import ConfigNotifications from '$windows/components/ConfigNotifications.vue';
import ConfigPlunder from '$windows/components/ConfigPlunder.vue';
import DebugView from '$windows/views/DebugView.vue';
import DefaultView from '$renderer/views/DefaultView.vue';
import DemolitionView from '$windows/views/DemolitionView.vue';
import ErrorLogView from '$windows/views/ErrorLogView.vue';
import GroupTemplateView from '$windows/views/GroupTemplateView.vue';
import GroupTemplateSafeZone from '$windows/components/GroupTemplateSafeZone.vue';
import PlunderHistoryView from '$windows/views/PlunderHistoryView.vue';
import PlunderTemplateView from '$windows/views/PlunderTemplateView.vue';
import TroopCounterView from '$windows/views/TroopCounterView.vue';
import UpdateView from '$windows/views/UpdateView.vue';

// Os componentes devem ser passados diretamente.
// Importá-los dinamicamente gera problemas após compilar.

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: StandardWindowName.Default,
        component: DefaultView
    },
    {
        path: '/config',
        name: StandardWindowName.Config,
        component: ConfigView,
        children: [
            {
                path: 'advanced',
                name: StandardWindowName.ConfigAdvanced,
                component: ConfigAdvanced
            },
            {
                path: 'buildings-snob',
                name: StandardWindowName.ConfigBuildingsSnob,
                component: ConfigBuildingsSnob
            },
            {
                path: 'general',
                name: StandardWindowName.ConfigGeneral,
                component: ConfigGeneral
            },
            {
                path: 'notifications',
                name: StandardWindowName.ConfigNotifications,
                component: ConfigNotifications
            },
            {
                path: 'plunder',
                name: StandardWindowName.ConfigPlunder,
                component: ConfigPlunder
            }
        ]
    },
    {
        path: '/debug',
        name: StandardWindowName.Debug,
        component: DebugView
    },
    {
        path: '/demolition-template',
        name: StandardWindowName.DemolitionTemplate,
        component: DemolitionView
    },
    {
        path: '/error-log',
        name: StandardWindowName.ErrorLog,
        component: ErrorLogView
    },
    {
        path: '/group-template',
        name: StandardWindowName.GroupTemplate,
        component: GroupTemplateView,
        children: [
            {
                path: 'safe-zone',
                name: StandardWindowName.GroupTemplateSafeZone,
                component: GroupTemplateSafeZone
            }
        ]
    },
    {
        path: '/plunder-history',
        name: StandardWindowName.PlunderHistory,
        component: PlunderHistoryView
    },
    {
        path: '/plunder-template',
        name: StandardWindowName.PlunderTemplate,
        component: PlunderTemplateView
    },
    {
        path: '/troop-counter',
        name: StandardWindowName.TroopCounter,
        component: TroopCounterView
    },
    {
        path: '/update',
        name: StandardWindowName.Update,
        component: UpdateView
    }
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes
});