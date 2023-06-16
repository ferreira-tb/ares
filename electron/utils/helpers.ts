import { app } from 'electron';

export function restartAres() {
    app.relaunch();
    app.quit();
};