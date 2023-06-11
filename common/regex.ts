export const regionRegex = /^(br|en|nl|pt|uk|us)$/;
export const worldRegex = /^(br|en|nl|pt|uk|us)([cps](?![cps]))*\d+$/;
export const aliasRegex = /^(br|en|nl|pt|uk|us)([cps](?![cps]))*\d+_/;
export const unitsRegex = /(spear|sword|axe|archer|spy|light|heavy|ram|catapult|knight|snob|militia)/;

export const gameOriginRegex = /tribalwars\.(com?\.)?(br|net|nl|pt|uk|us)/;
export const tbOriginRegex = /tb\.dev\.br/;
export const githubOriginRegex = /github\.com/;

export const allowedOriginRegexList = [
    gameOriginRegex,
    tbOriginRegex,
    githubOriginRegex
] as const;