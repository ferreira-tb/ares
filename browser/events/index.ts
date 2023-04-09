import { setDevEvents } from '$browser/events/dev';
import { setPlunderEvents } from '$browser/events/plunder';
import { setDeimosEvents } from '$browser/events/deimos';

export function setBrowserEvents() {
    setDevEvents();
    setPlunderEvents();
    setDeimosEvents();
};