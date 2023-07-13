import { ref } from 'mechanus';

export function defineIncomingsStore(mechanus: Mechanus) {
    return mechanus.define('incoming-attacks', () => {
        const amount = ref<number | null>(null);
        const incomings = ref<IncomingAttack[]>([]);

        return {
            amount,
            incomings
        } satisfies MechanusIncomingAttacksStoreType;
    });
}