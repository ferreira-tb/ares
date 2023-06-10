import { setIncomingAttacksEvents } from '$ui/events/game/incomings';
import { setSnobEvents } from '$ui/events/game/snob';

export function setGameEvents() {
    setIncomingAttacksEvents();
    setSnobEvents();
};