import { ipcInvoke } from '$renderer/ipc';
import { RendererWorkerError } from '$renderer/error';
import type { RendererWorkerName } from '$common/enum';

export class RendererWorker {
    private active = false;
    private readonly objectUrl: string;
    private readonly worker: Worker;
    
    private constructor(objectUrl: string) {
        this.objectUrl = objectUrl;
        this.worker = new Worker(objectUrl);
        this.active = true;
    }

    public destroy() {
        this.worker.terminate();
        URL.revokeObjectURL(this.objectUrl);
        this.active = false;
    }

    public invoke<T = unknown>(...args: Parameters<Worker['postMessage']>) {
        return new Promise<T>((resolve, reject) => {
            if (!this.active) {
                reject(new RendererWorkerError('Worker is not active'));
                return;
            }

            this.worker.onerror = (e) => {
                if (e.error instanceof Error) {
                    reject(e.error);
                } else {
                    reject(new RendererWorkerError(e.message));
                }
            };

            this.worker.onmessage = (e) => {
                const { data } = e;
                resolve(data);
            };

            this.worker.postMessage(...args);
        });
    }

    public static async create(workerName: RendererWorkerName) {
        let objectUrl: string | null = null;
        try {
            const workerFile = await ipcInvoke('renderer-worker:get-js-file', workerName);
            if (!workerFile) throw new RendererWorkerError(`Worker file not found: ${workerName}`);

            const blob = new Blob([workerFile], { type: 'text/javascript' });
            objectUrl = URL.createObjectURL(blob);
            const worker = new RendererWorker(objectUrl);
            return worker;

        } catch (err) {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            RendererWorkerError.catch(err);
            return null;
        }
    }
}