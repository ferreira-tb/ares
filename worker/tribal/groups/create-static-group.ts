import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { Kronos } from '@tb-dev/kronos';
import { ipcInvoke, ipcOn } from '$renderer/ipc';
import { TribalWorkerError } from '$worker/error';

ipcOn('port', (e) => {
    const port = e.ports[0];
    port.onmessageerror = TribalWorkerError.onMessageError;

    port.onmessage = (event) => {
        const groupName = event.data;
        if (typeof groupName !== 'string') return;
        createStaticGroup(port, groupName);
    };
});

async function createStaticGroup(port: MessagePort, groupName: string) {
    try {
        const inputSelector = '#group_management_content #group_config #add_group_form input#add_new_group_name';
        const submitSelector = '#group_management_content #group_config #add_group_form input.btn[type="submit"]';

        const input = document.queryStrict<HTMLInputElement>(inputSelector);
        const submit = document.queryStrict<HTMLInputElement>(submitSelector);

        input.value = groupName;
        const responseTime = (await ipcInvoke('browser:get-response-time')) ?? 1000;
        setTimeout(() => {
            port.postMessage('destroy');
            submit.click();
        }, Kronos.Second + responseTime);

    } catch (err) {
        await TribalWorkerError.catch(err);
        port.postMessage('destroy');
    }
}