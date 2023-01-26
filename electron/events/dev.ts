import * as fs from 'node:fs/promises';
import { app, ipcMain } from 'electron';
import { resolve } from 'path';
import { assert } from '#/error.js';

export function setDevEvents() {
    ipcMain.on('dev-report-dataset', async (_e, dataset: unknown) => {
        try {
            assert(Array.isArray(dataset), 'O dataset não é uma array.');

            const rows: string[] = [];
            dataset.forEach((data: number[]) => rows.push(data.join(',')));
            const csv = rows.join('\r\n');
    
            const filePath = resolve(app.getPath('userData'), 'reports.csv');
            await fs.writeFile(filePath, csv, { encoding: 'utf-8' });
            
        } catch (err) {
            console.error(err);
        };
    });
};