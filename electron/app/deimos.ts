import * as fs from 'fs/promises';
import { deimosJs } from '$electron/utils/constants.js';
import { MainProcessError } from '$electron/error.js';
import { assertType } from '$electron/utils/assert.js';

export async function readDeimosFile() {
    try {
        const deimos = await fs.readFile(deimosJs, 'utf8');
        assertType(typeof deimos === 'string' && deimos.length > 0, 'O arquivo deimos.js não pode estar vazio.');
        return deimos;

    } catch (err) {
        MainProcessError.handle(err);
        return null;
    };
};