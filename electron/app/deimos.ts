import * as fs from 'fs/promises';
import { assertString } from '@tb-dev/ts-guard';
import { deimosJs } from '$electron/utils/constants.js';
import { MainProcessError } from '$electron/error.js';

export async function readDeimosFile() {
    try {
        const deimos = await fs.readFile(deimosJs, 'utf8');
        assertString(deimos, 'O arquivo deimos.js não pode estar vazio.');
        return deimos;

    } catch (err) {
        MainProcessError.capture(err);
        return null;
    };
};