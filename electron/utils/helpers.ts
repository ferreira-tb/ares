import { app } from 'electron';

export function relaunch(timeout?: number) {
    const fn = () => {
        app.relaunch();
        app.quit();
    };

    if (timeout) setTimeout(fn, timeout);
    else fn();
}