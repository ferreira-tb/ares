export const worldRegex = /^br([sp](?![sp]))*\d+$/;
export const aliasRegex = /^br([sp](?![sp]))*\d+__USERID__/;
export const unitsRegex = /(spear|sword|axe|archer|spy|light|heavy|ram|catapult|knight|snob|militia)/;

export const gameOriginRegex = /tribalwars\.com\.br/;
export const tbOriginRegex = /tb\.dev\.br/;
export const githubOriginRegex = /github\.com/;

export const allowedOriginRegexList = [
    gameOriginRegex,
    tbOriginRegex,
    githubOriginRegex
] as const;