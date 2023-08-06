import '@tb-dev/prototype';
import zlib from 'node:zlib';
import csvParser from 'csv-parser';
import { promisify } from 'node:util';
import { Readable } from 'node:stream';
import { assertWorld } from '$common/guards';
import { getRegionFromWorld, getAllyDataUrl, getPlayerDataUrl, getVillageDataUrl } from '$common/utils';
import { ChildProcessError } from '$child-process/error';

const gunzip = promisify(zlib.gunzip);

process.parentPort.once('message', async (e) => {
    const [port] = e.ports;
    try {
        const request = e.data as WorldDataRequest;
        assertWorld(request.world, `Invalid world: ${request.world}.`);
        const region = getRegionFromWorld(request.world);

        const allies = request.ally ? await fetchAllies(request.world, region) : [];
        const players = request.player ? await fetchPlayers(request.world, region) : [];
        const villages = request.village ? await fetchVillages(request.world, region) : [];
        port.postMessage({ allies, players, villages } satisfies WorldDataType);

    } catch (err) {
        if (err instanceof Error) {
            await ChildProcessError.catch(err);
        }
        port.postMessage(null);
        
    } finally {
        port.close();
    }
});

async function fetchDataCSV(url: URL, world: World): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) throw new ChildProcessError(`Could not fetch data for world ${world}`);

    const blob = await response.blob();
    const gzip = await blob.arrayBuffer();
    const csv = await gunzip(gzip);
    return csv;
}

async function fetchAllies(world: World, region: GameRegion): Promise<WorldAllyType[]> {
    try {
        const url = getAllyDataUrl(world, region);
        const csv = await fetchDataCSV(url, world);

        const allies: WorldAllyType[] = [];
        const headers: (keyof WorldAllyType)[] = ['id', 'name', 'tag', 'members', 'villages', 'points', 'allPoints', 'rank'];
        const stream = Readable.from(csv).pipe(csvParser({ headers }));

        await new Promise<void>((resolve, reject) => {
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve());

            stream.on('data', (data: { [key in keyof WorldAllyType]: string }) => {
                const ally: WorldAllyType = {
                    id: data.id.toIntegerStrict(),
                    name: data.name,
                    tag: data.tag,
                    members: data.members.toIntegerStrict(),
                    villages: data.villages.toIntegerStrict(),
                    points: data.points.toIntegerStrict(),
                    allPoints: data.allPoints.toIntegerStrict(),
                    rank: data.rank.toIntegerStrict()
                };

                allies.push(ally);
            });
        });

        return allies;

    } catch (err) {
        await ChildProcessError.catch(err);
        return [];
    }
}

async function fetchPlayers(world: World, region: GameRegion): Promise<WorldPlayerType[]> {
    try {
        const url = getPlayerDataUrl(world, region);
        const csv = await fetchDataCSV(url, world);

        const players: WorldPlayerType[] = [];
        const headers: (keyof WorldPlayerType)[] = ['id', 'name', 'ally', 'villages', 'points', 'rank'];
        const stream = Readable.from(csv).pipe(csvParser({ headers }));

        await new Promise<void>((resolve, reject) => {
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve());

            stream.on('data', (data: { [key in keyof WorldPlayerType]: string }) => {
                const player: WorldPlayerType = {
                    id: data.id.toIntegerStrict(),
                    name: data.name,
                    ally: data.ally.toIntegerStrict(),
                    villages: data.villages.toIntegerStrict(),
                    points: data.points.toIntegerStrict(),
                    rank: data.rank.toIntegerStrict()
                };

                players.push(player);
            });
        });

        return players;

    } catch (err) {
        await ChildProcessError.catch(err);
        return [];
    }
}

async function fetchVillages(world: World, region: GameRegion): Promise<WorldVillageType[]> {
    try {
        const url = getVillageDataUrl(world, region);
        const csv = await fetchDataCSV(url, world);

        const villages: WorldVillageType[] = [];
        const headers: (keyof WorldVillageType)[] = ['id', 'name', 'x', 'y', 'player', 'points', 'type'];
        const stream = Readable.from(csv).pipe(csvParser({ headers }));
    
        await new Promise<void>((resolve, reject) => {
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve());

            stream.on('data', (data: { [key in keyof WorldVillageType]: string }) => {
                const village: WorldVillageType = {
                    id: data.id.toIntegerStrict(),
                    name: data.name,
                    x: data.x.toIntegerStrict(),
                    y: data.y.toIntegerStrict(),
                    player: data.player.toIntegerStrict(),
                    points: data.points.toIntegerStrict(),
                    type: data.type.toIntegerStrict()
                };

                villages.push(village);
            });
        });

        return villages;

    } catch (err) {
        await ChildProcessError.catch(err);
        return [];
    }
}