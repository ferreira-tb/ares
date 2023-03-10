import * as fs from 'fs';
import { join, resolve } from 'path';
import type { World } from '$types/game.js';

// URL
export const aresURL = 'https://tb.dev.br/ares';
export const gameURL = 'https://www.tribalwars.com.br/';
export const authorURL = 'https://github.com/ferreira-tb';
export const repoURL = 'https://github.com/ferreira-tb/ares';
export const issuesURL = 'https://github.com/ferreira-tb/ares/issues';
export const discordURL = 'https://discord.gg/tNQbrqbmdK';

export const worldConfigURL = (world: World) => `https://${world}.tribalwars.com.br/interface.php?func=get_config`;
export const worldUnitURL = (world: World) => `https://${world}.tribalwars.com.br/interface.php?func=get_unit_info`;

// Arquivos
export const favicon = resolve(__dirname, '../public/favicon.ico');
export const indexHtml = join(__dirname, 'index.html');
export const browserJs = join(__dirname, 'browser.js');
export const deimosJs = join(__dirname, 'deimos.js');
export const phobosJs = join(__dirname, 'phobos.js');
export const moduleHtml = join(__dirname, 'modules.html');

// CSS
export const browserCss = fs.readFileSync(join(__dirname, 'browser.css'), { encoding: 'utf8' });

// Regex.
export const worldRegex = /^br([sp](?![sp]))*\d+$/;
export const aliasRegex = /^br([sp](?![sp]))*\d+__USERID__/;

export const gameURLRegex = /\.?tribalwars\.com\.br/;
export const aresURLRegex = /\.?tb\.dev\.br\/ares/;
export const authorURLRegex = /\.?github\.com\/ferreira\-tb/;
export const repoURLRegex = /\.?github\.com\/ferreira\-tb\/ares/;

export const allowedOriginRegexList = [
    gameURLRegex,
    aresURLRegex,
    authorURLRegex
] as const;

// Proxy keys.
export const aresKeys = ['locale', 'world', 'majorVersion', 'groupId', 'screen', 'screenMode', 'pregame'] as const;
export const featuresKeys = ['premium', 'accountManager', 'farmAssistant'] as const;

// Mapas.
export const unitsToDestroyWall = {
    '0': {
        spear: 0,
        sword: 0,
        axe: 0,
        archer: 0,
        spy: 0,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 0,
        catapult: 0
    },
    '1': {
        spear: 0,
        sword: 0,
        axe: 50,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 3,
        catapult: 0
    },
    '2': {
        spear: 0,
        sword: 0,
        axe: 50,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 5,
        catapult: 0
    },
    '3': {
        spear: 0,
        sword: 0,
        axe: 50,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 8,
        catapult: 0
    },
    '4': {
        spear: 0,
        sword: 0,
        axe: 75,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 15,
        catapult: 0
    },
    '5': {
        spear: 0,
        sword: 0,
        axe: 100,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 20,
        catapult: 0
    },
    '6': {
        spear: 0,
        sword: 0,
        axe: 150,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 20,
        catapult: 0
    },
    '7': {
        spear: 0,
        sword: 0,
        axe: 150,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 30,
        catapult: 0
    },
    '8': {
        spear: 0,
        sword: 0,
        axe: 300,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 40,
        catapult: 0
    },
    '9': {
        spear: 0,
        sword: 0,
        axe: 300,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 40,
        catapult: 0
    },
    '10': {
        spear: 0,
        sword: 0,
        axe: 400,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 50,
        catapult: 0
    },
    '11': {
        spear: 0,
        sword: 0,
        axe: 400,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 60,
        catapult: 0
    },
    '12': {
        spear: 0,
        sword: 0,
        axe: 500,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 60,
        catapult: 0
    },
    '13': {
        spear: 0,
        sword: 0,
        axe: 500,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 80,
        catapult: 0
    },
    '14': {
        spear: 0,
        sword: 0,
        axe: 600,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 100,
        catapult: 0
    },
    '15': {
        spear: 0,
        sword: 0,
        axe: 800,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 150,
        catapult: 0
    },
    '16': {
        spear: 0,
        sword: 0,
        axe: 1000,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 180,
        catapult: 0
    },
    '17': {
        spear: 0,
        sword: 0,
        axe: 1000,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 180,
        catapult: 0
    },
    '18': {
        spear: 0,
        sword: 0,
        axe: 1100,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 200,
        catapult: 0
    },
    '19': {
        spear: 0,
        sword: 0,
        axe: 1100,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 200,
        catapult: 0
    },
    '20': {
        spear: 0,
        sword: 0,
        axe: 1300,
        archer: 0,
        spy: 1,
        light: 0,
        marcher: 0,
        heavy: 0,
        ram: 200,
        catapult: 0
    }
} as const;