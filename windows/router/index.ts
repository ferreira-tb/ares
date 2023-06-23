import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router';
import { StandardWindowName } from '$common/enum';
import ConfigView from '$windows/views/ConfigView.vue';
import ConfigAdvanced from '$windows/components/ConfigAdvanced.vue';
import ConfigGeneral from '$windows/components/ConfigGeneral.vue';
import ConfigNotifications from '$windows/components/ConfigNotifications.vue';
import ConfigTags from '$windows/components/ConfigTags.vue';
import DebugView from '$windows/views/DebugView.vue';
import DefaultView from '$renderer/views/DefaultView.vue';
import DemolitionView from '$windows/views/DemolitionView.vue';
import ErrorLogView from '$windows/views/ErrorLogView.vue';
import GroupTemplateView from '$windows/views/GroupTemplateView.vue';
import GroupTemplateSafeZone from '$windows/components/GroupTemplateSafeZone.vue';
import PanelBuildingsSnob from '$windows/components/PanelBuildingsSnob.vue';
import PanelOverview from '$windows/components/PanelOverview.vue';
import PanelPlunder from '$windows/components/PanelPlunder.vue';
import PanelView from '$windows/views/PanelView.vue';
import PlunderHistoryView from '$windows/views/PlunderHistoryView.vue';
import PlunderTemplateView from '$windows/views/PlunderTemplateView.vue';
import TroopsCounterView from '$windows/views/TroopsCounterView.vue';
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
                path: 'tags',
                name: StandardWindowName.ConfigTags,
                component: ConfigTags
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
        path: '/panel',
        name: StandardWindowName.Panel,
        component: PanelView,
        children: [
            {
                path: 'buildings-snob',
                name: StandardWindowName.PanelBuildingsSnob,
                component: PanelBuildingsSnob
            },
            {
                path: 'overview',
                name: StandardWindowName.PanelOverview,
                component: PanelOverview
            },
            {
                path: 'plunder',
                name: StandardWindowName.PanelPlunder,
                component: PanelPlunder
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
        path: '/troops-counter',
        name: StandardWindowName.TroopsCounter,
        component: TroopsCounterView
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