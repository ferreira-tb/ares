import type { Rectangle } from 'electron';
import type { UnitsToDestroyWall } from '$types/game.js';
import type { UserAlias } from '$types/electron.js';

export type DemolitionTroopsPrimaryKey = `demolition_${UserAlias}`;

export type UserConfigName = 'panel_bounds' | DemolitionTroopsPrimaryKey;
export type UserConfigJSON = Rectangle | UnitsToDestroyWall;