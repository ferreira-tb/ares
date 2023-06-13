import { storeToRefs } from 'pinia';
import { useIncomingsStore } from '$renderer/stores';
import { ipcOn } from '$renderer/ipc';

export function setIncomingAttacksEvents() {
    const incomingsStore = useIncomingsStore();
    const { amount, incomings } = storeToRefs(incomingsStore);

    ipcOn('game:incomings-amount-did-update', (_e, newAmount: number | null) => {
        amount.value = newAmount;
    });

    ipcOn('game:incomings-info-did-update', (_e, newIncomings: IncomingAttack[]) => {
        incomings.value = newIncomings;
    });
};