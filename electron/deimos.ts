import getPort from 'get-port';
import { app } from 'electron';
import { execFile } from 'node:child_process';
import { deimosExe } from './constants.js';
import { MainProcessError } from './error.js';
import { DeimosEndpoint } from '$types/deimos.js';

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
export const getDeimosEndpoint = (): DeimosEndpoint => `http://127.0.0.1:${getDeimosPort()}/deimos`;

/** Verifica se o Deimos já foi iniciado e pode responder à requisições. */
export async function isDeimosOn() {
    try {
        const response = await fetch(getDeimosEndpoint());
        if (response.status === 200) return true;
        return false;
    } catch {
        return false;
    };
};