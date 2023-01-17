import { ipcRenderer } from 'electron';

export async function ipcInvoke(channel: 'get-plunder-state'): Promise<PlunderState | null>
export async function ipcInvoke(
    channel: 'set-plunder-state',
    name: keyof PlunderState,
    value: PlunderStateValue
): Promise<boolean | string>

export async function ipcInvoke(channel: string, ...args: any[]): Promise<unknown> {
    const response = await ipcRenderer.invoke(channel, ...args);
    return response;
};