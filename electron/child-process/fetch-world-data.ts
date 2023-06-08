import '@tb-dev/prototype';
import zlib from 'node:zlib';
import csvParser from 'csv-parser';
import { promisify } from 'node:util';
import { Readable } from 'node:stream';
import { assertWorld } from '$common/guards';
import { getRegionFromWorld, getPlayerDataUrl, getVillageDataUrl } from '$common/helpers';
import { ChildProcessError } from '$electron/child-process/error';

const gunzip = promisify(zlib.gunzip);

process.parentPort.once('message', async (e) => {
    const [port] = e.ports;
    try {
        const request = e.data as WorldDataRequest;
        assertWorld(request.world, ChildProcessError, `Invalid world: ${request.world}.`);
        const region = getRegionFromWorld(request.world, ChildProcessError);
        
        const players = request.player ? await fetchPlayers(request.world, region) : [];
        const villages = request.village ? await fetchVillages(request.world, region) : [];
        port.postMessage({ players, villages } satisfies WorldDataType);

    } catch (err) {
        if (err instanceof Error) {
            await ChildProcessError.catch(err);
        };
        port.postMessage(null);
        
    } finally {
        port.close();
    };
});

async function fetchDataCSV(url: URL, world: World): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) throw new ChildProcessError(`Could not fetch data for world ${world}`);

    const blob = await response.blob();
    const gzip = await blob.arrayBuffer();
    const csv = await gunzip(gzip);
    return csv;
};

async function fetchPlayers(world: World, region: GameRegion): Promise<WorldPlayersType[]> {
    try {
        const url = getPlayerDataUrl(world, region);
        const csv = await fetchDataCSV(url, world);

        const players: WorldPlayersType[] = [];
        const headers: (keyof WorldPlayersType)[] = ['id', 'name', 'ally', 'villages', 'points', 'rank'];
        const stream = Readable.from(csv).pipe(csvParser({ headers }));

        await new Promise<void>((resolve, reject) => {
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve());

            stream.on('data', (data: { [key in keyof WorldPlayersType]: string }) => {
                const player: WorldPlayersType = {
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
    };
};

async function fetchVillages(world: World, region: GameRegion): Promise<WorldVillagesType[]> {
    try {
        const url = getVillageDataUrl(world, region);
        const csv = await fetchDataCSV(url, world);

        const villages: WorldVillagesType[] = [];
        const headers: (keyof WorldVillagesType)[] = ['id', 'name', 'x', 'y', 'player', 'points', 'type'];
        const stream = Readable.from(csv).pipe(csvParser({ headers }));
    
        await new Promise<void>((resolve, reject) => {
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve());

            stream.on('data', (data: { [key in keyof WorldVillagesType]: string }) => {
                const village: WorldVillagesType = {
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
    };
};