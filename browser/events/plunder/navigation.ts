import { ipcRenderer } from 'electron';
import { watch } from 'vue';
import { usePlunderConfigStore } from '$renderer/stores/plunder';

export function setPlunderNavigationEvents() {
    const config = usePlunderConfigStore();
    const eventTarget = new EventTarget();
    
    // Cancela qualquer navegação que esteja pendente.
    watch(() => config.active, () => {
        eventTarget.dispatchEvent(new Event('cancel'));
    });

    ipcRenderer.on('plunder:set-navigation-timer', (_e, url: string, delay: number) => {
        if (!config.active) return;

        // Não é preciso remover o listener se a navegacao for bem sucedida.
        const timeout = setTimeout(() => location.assign(url), delay);
        eventTarget.addEventListener('cancel', () => clearTimeout(timeout), { once: true });
    });
};