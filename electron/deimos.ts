import getPort from 'get-port';
import { app } from 'electron';
import { execFile } from 'node:child_process';
import { deimosExe } from './constants.js';
import { MainProcessError } from './error.js';

// Inicia o Deimos e retorna uma função que permite obter a porta à qual ele está conectado.
function openDeimos() {
    let deimosPort = '8000';

    getPort({ port: 8000 }).then((port) => {
        deimosPort = port.toString(10);
        const args = [deimosPort, app.getPath('userData')];
        execFile(deimosExe, args, (err) => MainProcessError.handleDeimosError(err));
    
        if (process.env.ARES_MODE === 'dev') console.log('Porta:', deimosPort);
    });

    function port(): number;
    function port(returnAsString: true): string;
    function port(returnAsString: false): number;
    function port(returnAsString: boolean = false): number | string {
        if (returnAsString === true) return deimosPort;
        return Number.parseInt(deimosPort, 10);
    };

    return port;
};

export const getDeimosPort = openDeimos();

/** Verifica se o Deimos já foi iniciado e pode responder à requisições. */
export async function isDeimosOn() {
    try {
        const response = await fetch(`http://127.0.0.1:${getDeimosPort(true)}/deimos`);
        if (response.status === 200) return true;
        return false;
    } catch {
        return false;
    };
};