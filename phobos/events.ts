import { ipcRenderer } from 'electron';
import { assertString } from '@tb-dev/ts-guard';
import { fetchWorldConfig } from '$phobos/world/config.js';
import { fetchWorldUnit } from '$phobos/world/unit.js';
import { PhobosError } from '$phobos/error.js';
import type { PhobosPortMessage } from '$types/phobos.js';

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
                default:
                    throw new PhobosError(`Canal desconhecido: ${channel}`);
            };
        };

    } catch (err) {
        PhobosError.catch(err);
    };
};