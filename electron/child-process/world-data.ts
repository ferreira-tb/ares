import '@tb-dev/prototype';
import zlib from 'node:zlib';
import csvParser from 'csv-parser';
import { promisify } from 'node:util';
import { Readable } from 'node:stream';
import { assertWorld } from '$shared/guards';
import { getRegionFromWorld, getVillagesDataUrl } from '$shared/helpers';
import { ChildProcessError } from '$electron/child-process/error';

const gunzip = promisify(zlib.gunzip);

process.parentPort.once('message', async (e) => {
    const [port] = e.ports;
    try {
        const world = e.data;
        assertWorld(world, ChildProcessError, `Invalid world: ${world}.`);
        const region = getRegionFromWorld(world, ChildProcessError, `Could not get region from world: ${world}.`);
        
        const villages = await fetchVillages(world, region);
        port.postMessage({ villages } satisfies WorldDataType);

    } catch (err) {
        if (err instanceof Error) {
            ChildProcessError.catch(err);
            port.postMessage(err.stack ?? err.message);
        } else {
            port.postMessage('Unknown error.');
        };

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

async function fetchVillages(world: World, region: GameRegion): Promise<WorldVillagesType[]> {
    const url = getVillagesDataUrl(world, region);
    const csv = await fetchDataCSV(url, world);

    const villages: WorldVillagesType[] = [];
    const headers: (keyof WorldVillagesType)[] = ['id', 'name', 'x', 'y', 'player', 'points', 'type'];
    const stream = Readable.from(csv).pipe(csvParser({ headers }));
  
    await new Promise((resolve, reject) => {
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(villages));

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
};