import { ipcRenderer } from 'electron';
import { assert, AresError } from '#/error.js';
import { fetchPlunderReportsForDeimos } from './reports.js';

export function setPhobosEvents() {
    ipcRenderer.on('fetch-deimos-report-url', async (_e, urls: string[]) => {
        try {
            const response = await fetchPlunderReportsForDeimos(urls);
            assert(response.ok, await response.text());
        } catch (err) {
            AresError.handle(err);
        };
    });
};