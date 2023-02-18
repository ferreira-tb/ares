class WorldConfigStore {

};

function setWorldConfigStore() {
    return new Proxy(new WorldConfigStore(), { });
};

export type { WorldConfigStore };
export { setWorldConfigStore };