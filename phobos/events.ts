import { ipcRenderer } from 'electron';
import { assertString } from '@tb-dev/ts-guard';
import { PhobosError } from '$phobos/error';
import { fetchWorldConfig } from '$phobos/world/config';
import { fetchWorldUnit } from '$phobos/world/unit';
import { getVillageGroups } from '$phobos/groups/groups';
import type { PhobosPortMessage } from '$types/phobos';

export function setPhobosEvents() {
    ipcRenderer.on('port', (e) => handlePort(e.ports[0]));
};

function handlePort(port: MessagePort) {
    try {
        port.onmessage = (e) => {
            const { channel } = e.data as PhobosPortMessage;
            assertString(channel, 'O canal não é uma string.');
            
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
                    throw new PhobosError(`Canal desconhecido: ${channel}`);
            };
        };

    } catch (err) {
        PhobosError.catch(err);
    };
};