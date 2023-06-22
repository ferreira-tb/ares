export function decodeString(str: string) {
    return decodeURIComponent(str).replace(/\+/g, ' ');
};

export function decodeAlly(raw: WorldAllyType) {
    return {
        id: raw.id,
        name: decodeString(raw.name),
        tag: decodeString(raw.tag),
        members: raw.members,
        villages: raw.villages,
        points: raw.points,
        allPoints: raw.allPoints,
        rank: raw.rank
    };
};

export function decodePlayer(raw: WorldPlayerType) {
    return {
        id: raw.id,
        name: decodeString(raw.name),
        villages: raw.villages,
        points: raw.points,
        rank: raw.rank,
        ally: raw.ally
    };
};

export function decodeVillage(raw: WorldVillageType) {
    return {
        id: raw.id,
        name: decodeString(raw.name),
        x: raw.x,
        y: raw.y,
        player: raw.player,
        points: raw.points,
        type: raw.type
    };
};

export function decodeVillageGroups(raw: VillageGroup[]) {
    return raw.map((group) => {
        return {
            id: group.id,
            name: decodeString(group.name),
            type: group.type
        };
    });
};