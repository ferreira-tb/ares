import { ipcRenderer } from 'electron';
import { TribalWorkerError } from '$worker/error';
import { fetchWorldConfig } from '$worker/world/config';
import { fetchWorldUnit } from '$worker/world/unit';
import { getVillageGroups } from '$worker/groups/groups';

export function setTribalWorkerEvents() {
    ipcRenderer.on('port', (e) => handlePort(e.ports[0]));
};

function handlePort(port: MessagePort) {
    try {
        port.onmessage = (e) => {
            const { channel } = e.data as TribalWorkerPortMessage;
            if (typeof channel !== 'string' || channel.length === 0) {
                throw new TribalWorkerError(`Invalid channel: ${String(channel)}`);
            };
            
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
                    throw new TribalWorkerError(`Unknown channel: ${channel}`);
            };
        };

    } catch (err) {
        TribalWorkerError.catch(err);
    };
};