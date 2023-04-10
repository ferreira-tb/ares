import { setDevEvents } from '$browser/events/dev';
import { setPlunderEvents } from '$browser/events/plunder';
import { setDeimosEvents } from '$browser/events/deimos';
import { ipcInvoke } from '$renderer/ipc';
import { BrowserEventError } from '$browser/error';

export function setBrowserEvents() {
    setPlunderEvents();
    setDeimosEvents();

    ipcInvoke('is-dev')
        .then((isDev) => setDevEvents(isDev))
        .catch((err: unknown) => BrowserEventError.catch(err));
};