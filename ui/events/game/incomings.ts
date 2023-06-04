import { ipcRenderer } from 'electron';
import { storeToRefs } from 'pinia';
import { useIncomingsStore } from '$renderer/stores';

export function setIncomingAttacksEvents() {
    const incomingsStore = useIncomingsStore();
    const { amount, incomings } = storeToRefs(incomingsStore);

    ipcRenderer.on('game:incomings-amount-did-update', (_e, newAmount: number | null) => {
        amount.value = newAmount;
    });

    ipcRenderer.on('game:incomings-info-did-update', (_e, newIncomings: IncomingAttack[]) => {
        incomings.value = newIncomings;
    });
};