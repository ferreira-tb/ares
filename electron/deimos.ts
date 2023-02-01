import getPort from 'get-port';
import { app } from 'electron';
import { execFile } from 'node:child_process';
import { deimosExe } from './constants.js';
import { MainProcessError } from './error.js';

function openDeimos(port: number) {
    const deimosPort = port.toString(10);
    const args = [deimosPort, app.getPath('userData')];
    execFile(deimosExe, args, (err) => MainProcessError.handleDeimosError(err));

    if (process.env.ARES_MODE === 'dev') console.log('Porta:', deimosPort);

    return deimosPort;
};

function setDeimosPort() {
    let deimosPort = '8000';
    getPort({ port: 8000 }).then((port) => deimosPort = openDeimos(port));

    function port(): string;
    function port(asInt: true): number;
    function port(asInt: false): string;
    function port(asInt: boolean = false): number | string {
        if (asInt !== true) return deimosPort;
        return Number.parseInt(deimosPort, 10);
    };

    return port;
};

export const getDeimosPort = setDeimosPort();

/** Verifica se o Deimos já foi iniciado e pode responder à requisições. */
export async function isDeimosOn() {
    try {
        const port = getDeimosPort();
        const response = await fetch(`http://127.0.0.1:${port}/deimos`);
        if (response.status === 200) return true;
        return false;
    } catch {
        return false;
    };
};