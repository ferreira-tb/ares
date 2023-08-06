import { assertGameRegion } from '$common/guards';

/** 
 * Obtém a região referente a um mundo.
 * @throws Se a região obtida não for válida.
 */
export function getRegionFromWorld(world: World) {
    const region = world.slice(0, 2);
    assertGameRegion(region, `Could not get region from world: ${world}.`);
    return region;
}
