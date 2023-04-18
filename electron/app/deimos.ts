import * as fs from 'fs/promises';
import { assertString } from '$global/guards';
import { deimosJs } from '$electron/utils/files';
import { MainProcessError } from '$electron/error';

/** Retorna o conteúdo do arquivo `deimos.js`. */
export async function readDeimosFile() {
    try {
        const deimos = await fs.readFile(deimosJs, 'utf8');
        assertString(deimos, 'Deimos file is empty.');
        return deimos;

    } catch (err) {
        MainProcessError.catch(err);
        return null;
    };
};