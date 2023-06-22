import { GameUrl, GameEndpoints } from '$common/enum';

export function getGameRegionUrl(region: unknown): GameUrl {
    if (typeof region !== 'string') return GameUrl.Brazil;
    switch (region) {
        case 'br': return GameUrl.Brazil;
        case 'en': return GameUrl.Global;
        case 'nl': return GameUrl.Netherlands;
        case 'pt': return GameUrl.Portugal;
        case 'uk': return GameUrl.UnitedKingdom;
        case 'us': return GameUrl.UnitedStates;
        default: return GameUrl.Brazil;
    };
};

export function getWorldUrl(world: World, region: GameRegion) {
    const url = getGameRegionUrl(region).replace('www', world);
    return new URL(url);
};

function getEndPointUrl(world: World, region: GameRegion, endpoint: keyof typeof GameEndpoints) {
    const { origin } = getWorldUrl(world, region);
    const url = (e: GameEndpoints) => new URL(`${origin}/${e}`);
    switch (endpoint) {
        case 'GetConfig': return url(GameEndpoints.GetConfig);
        case 'GetUnitInfo': return url(GameEndpoints.GetUnitInfo);
        case 'Ally': return url(GameEndpoints.Ally);
        case 'Conquer': return url(GameEndpoints.Conquer);
        case 'Player': return url(GameEndpoints.Player);
        case 'Village': return url(GameEndpoints.Village);
        default: throw new TypeError(`Invalid endpoint: ${endpoint}.`);
    };
};

export const getWorldConfigUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'GetConfig');
export const getWorldUnitInfoUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'GetUnitInfo');
export const getAllyDataUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'Ally');
export const getConquerDataUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'Conquer');
export const getPlayerDataUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'Player');
export const getVillageDataUrl = (world: World, region: GameRegion) => getEndPointUrl(world, region, 'Village');