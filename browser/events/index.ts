import { setDevEvents } from '$browser/events/dev';
import { setIpcTribalEvents } from '$browser/events/ipc-tribal';

export function setBrowserEvents() {
    setDevEvents();
    setIpcTribalEvents();
}