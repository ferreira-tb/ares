import { ipcRenderer } from 'electron';
import { assertString } from '$shared/guards';
import { PhobosError } from '$phobos/error';
import { fetchWorldConfig } from '$phobos/world/config';
import { fetchWorldUnit } from '$phobos/world/unit';
import { getVillageGroups } from '$phobos/groups/groups';

export function setPhobosEvents() {
    ipcRenderer.on('port', (e) => handlePort(e.ports[0]));
};

function handlePort(port: MessagePort) {
    try {
        port.onmessage = (e) => {
            const { channel } = e.data as PhobosPortMessage;
            assertString(channel, `Channel should be a string, got ${channel}.`);
            
            switch (channel) {
                case 'fetch-world-config':
                    fetchWorldConfig(port);
                    break;
                case 'fetch-world-unit':
                    fetchWorldUnit(port);
                    break;
                case 'get-village-groups':
                    getVillageGroups(port);
                    break;
                default:
                    throw new PhobosError(`Unknown channel: ${channel}`);
            };
        };

    } catch (err) {
        PhobosError.catch(err);
    };
};