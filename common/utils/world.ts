import { assertGameRegion } from '$common/guards';
import type { AresError } from '$common/error';

/** 
 * Obtém a região referente a um mundo.
 * @throws Se a região obtida não for válida.
 */
export function getRegionFromWorld<T extends typeof AresError>(world: World, SomeError: T) {
    const region = world.slice(0, 2);
    assertGameRegion(region, SomeError, `Could not get region from world: ${world}.`);
    return region;
}
