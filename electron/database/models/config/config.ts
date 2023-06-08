import { sequelize } from '$electron/database';
import { DatabaseError } from '$electron/error';
import type { AppConfig as AppConfigTable } from '$electron/database/models/config';
import type { useAppGeneralConfigStore, useAppNotificationsStore } from '$electron/interface';

type OnlyConfig = Extract<AppConfigName, `config_${string}`>;
type ConfigStoreByName<T extends OnlyConfig> =
    T extends 'config_general' ? ReturnType<typeof useAppGeneralConfigStore> :
    T extends 'config_notifications' ? ReturnType<typeof useAppNotificationsStore> :
    never;

// Atualiza a store com os valores contidos no objeto json.
// Se o objeto não for passado, os dados serão buscados no banco de dados.
export function setConfig(AppConfig: typeof AppConfigTable) {
    return async function<T extends OnlyConfig, U extends AppConfigByName<T>, V extends keyof ConfigStoreByName<T>>(
        name: T, store: ConfigStoreByName<T>, json?: U
    ) {
        try {
            if (!json) {
                const previous = (await AppConfig.findByPk(name))?.toJSON();
                if (!previous?.json) return;
                json = previous.json as U;
            };
            
            for (const [key, value] of Object.entries(json) as [V, U[V]][]) {
                if (store[key] === value) continue;
                store[key] = value;
            };
    
        } catch (err) {
            DatabaseError.catch(err);
        };
    };
};

export function saveConfig(AppConfig: typeof AppConfigTable) {
    return async function<T extends OnlyConfig>(name: T, store: ConfigStoreByName<T>) {
        try {
            const json = { ...store };
            await sequelize.transaction(async () => {
                await AppConfig.upsert({ name, json });
            });
    
        } catch (err) {
            DatabaseError.catch(err);
        };
    };
};