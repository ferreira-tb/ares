import { ref } from 'mechanus';

export function defineIncomingsStore(mechanus: Mechanus) {
    return mechanus.define('incoming-attacks', {
        amount: ref<number | null>(null),
        incomings: ref<IncomingAttack[]>([])
    } satisfies MechanusIncomingAttacksStoreType);
};