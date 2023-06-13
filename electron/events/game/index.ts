import { setGroupsEvents } from '$electron/events/game/groups';
import { setIncomingAttacksEvents } from '$electron/events/game/incomings';
import { setPlayerEvents } from '$electron/events/game/player';
import { setPlunderEvents } from '$electron/events/game/plunder';
import { setSnobEvents } from '$electron/events/game/snob';

export function setGameEvents() {
    setGroupsEvents();
    setIncomingAttacksEvents();
    setPlayerEvents();
    setPlunderEvents();
    setSnobEvents();
};