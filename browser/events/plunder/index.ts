import { setPlunderConfigEvents } from '$browser/events/plunder/config';
import { setPlunderNavigationEvents } from '$browser/events/plunder/navigation';

export function setPlunderEvents() {
    setPlunderConfigEvents();
    setPlunderNavigationEvents();
};