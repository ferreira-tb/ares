import { setDevEvents } from '$browser/events/dev';
import { setPlunderEvents } from '$browser/events/plunder';
import { setIpcTribalEvents } from '$browser/events/ipc-tribal';

export function setBrowserEvents() {
    setPlunderEvents();
    setIpcTribalEvents();

    setDevEvents();
}