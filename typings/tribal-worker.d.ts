type TribalWorkerName =
    | 'fetch-world-config'
    | 'fetch-world-unit'
    | 'get-village-groups'
    | 'handle-incoming-attacks';

type TribalWorkerChannel = TribalWorkerName;

interface TribalWorkerPortMessage extends Record<string, unknown> {
    channel: TribalWorkerChannel;
};