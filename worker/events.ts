import { ipcRenderer } from 'electron';
import { TribalWorkerError } from '$worker/error';
import { fetchWorldConfig, fetchWorldUnits } from '$worker/world';
import { getVillageGroups } from '$worker/groups';
import { handleIncomingAttacks } from '$worker/incomings';

export function setTribalWorkerEvents() {
    ipcRenderer.on('port', (e) => {
        const port = e.ports[0];
        port.onmessage = listener(port);
    });
};

function listener(port: MessagePort) {
    return function(e: MessageEvent) {
        try {
            const { channel } = e.data as TribalWorkerPortMessage;
            if (typeof channel !== 'string' || channel.length === 0) {
                throw new TribalWorkerError(`Invalid channel: ${String(channel)}`);
            };
            
            switch (channel) {
                case 'fetch-world-config':
                    fetchWorldConfig(port);
                    break;
                case 'fetch-world-unit':
                    fetchWorldUnits(port);
                    break;
                case 'get-village-groups':
                    getVillageGroups(port);
                    break;
                case 'handle-incoming-attacks':
                    void handleIncomingAttacks(port);
                    break;
                default:
                    throw new TribalWorkerError(`Unknown channel: ${channel}`);
            };

        } catch (err) {
            TribalWorkerError.catch(err);
        };
    };
};