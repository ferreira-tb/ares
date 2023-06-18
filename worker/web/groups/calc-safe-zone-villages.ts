import { calcDistance } from '$common/helpers';

interface SafeZoneWorkerData {
    playerVillages: WorldVillageType[];
    enemyVillages: WorldVillageType[];
    fields: number;
};

self.onmessage = (e) => {
    const safe: WorldVillageType[] = [];
    const { playerVillages, enemyVillages, fields } = e.data as SafeZoneWorkerData;

    if (playerVillages.length > 0 && enemyVillages.length > 0) {
        for (const village of playerVillages) {
            const enemyVillage = enemyVillages.find((enemy) => {
                const distance = calcDistance(village.x, village.y, enemy.x, enemy.y);
                return distance <= fields;
            });

            if (!enemyVillage) safe.push(village);
        };
    };

    self.postMessage(safe);
};