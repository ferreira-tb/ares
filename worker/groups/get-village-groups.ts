import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { ipcOn } from '$renderer/ipc';
import { TribalWorkerError } from '$worker/error';

ipcOn('port', (e) => {
    const port = e.ports[0];
    port.onmessage = () => getVillageGroups(port);
    port.onmessageerror = TribalWorkerError.onMessageError;
});

async function getVillageGroups(port: MessagePort) {
    try {
        const selector = '#group_management_content .group-menu-item:not([data-group-id="0"])';
        const groups: Set<VillageGroup> = Set.fromElements(selector, (el) => {
            const groupId = el.getAttributeAsIntStrict('data-group-id');
            const groupName = el.getTextContentStrict().replace(/^([<>[\]])(.*?)([<>[\]])$/, '$2');
            const groupType = el.getAttributeStrict('data-group-type');
            if (groupType !== 'dynamic' && groupType !== 'static') {
                throw new TribalWorkerError(`Invalid group type: ${groupType}`);
            };

            return {
                id: groupId,
                name: encodeURIComponent(groupName),
                type: groupType
            };
        });

        port.postMessage(groups);
    } catch (err) {
        await TribalWorkerError.catch(err);
        port.postMessage(null);
    } finally {
        port.close();
    };
};