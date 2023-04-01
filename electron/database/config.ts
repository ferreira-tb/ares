import { DataTypes, Model } from 'sequelize';
import { isObject } from '@tb-dev/ts-guard';
import { sequelize } from '$electron/database';
import { DatabaseError } from '$electron/error';
import { getPanelWindow } from '$electron/utils/helpers';
import type { Rectangle } from 'electron';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { AppConfigName, AppConfigJSON, AppConfigByName } from '$types/config';
import type { useAppGeneralConfigStore, useAppNotificationsStore } from '$interface/index';

type OnlyConfig = Extract<AppConfigName, `config_${string}`>;

type AllConfigStoresReturnType =
    | ReturnType<typeof useAppGeneralConfigStore>
    | ReturnType<typeof useAppNotificationsStore>;

type ConfigStoreByName<T extends OnlyConfig> =
    T extends 'config_general' ? ReturnType<typeof useAppGeneralConfigStore> :
    T extends 'config_notifications' ? ReturnType<typeof useAppNotificationsStore> :
    never;

/** Diz respeito a configurações que abrangem toda a aplicação, independentemente do usuário. */
export class AppConfig extends Model<InferAttributes<AppConfig>, InferCreationAttributes<AppConfig>> {
    declare readonly name: AppConfigName;
    declare readonly json: AppConfigJSON;

    static async saveConfig<T extends OnlyConfig>(name: T, store: AllConfigStoresReturnType) {
        try {
            const json = { ...store };
            await sequelize.transaction(async (transaction) => {
                await AppConfig.upsert({ name, json }, { transaction });
            });

        } catch (err) {
            DatabaseError.catch(err);
        };
    };

    /**
     * Atualiza a store com os valores contidos no objeto `json`.
     * 
     * Se `json` não for passado, os dados serão buscados no banco de dados.
     */
    static async setConfig<T extends OnlyConfig, U extends AppConfigByName<T>, V extends keyof ConfigStoreByName<T>>(
        name: T, store: ConfigStoreByName<T>, json?: U
    ) {
        try {
            if (!json) {
                const previous = (await AppConfig.findByPk(name))?.toJSON();
                if (!previous || !isObject<U>(previous.json)) return;
                json = previous.json;
            };
            
            for (const [key, value] of Object.entries(json) as [V, U[V]][]) {
                if (store[key] === value) continue;
                store[key] = value;
            };

        } catch (err) {
            DatabaseError.catch(err);
        };
    };

    //////// PAINEL
    static async savePanelBounds(rectangle: Rectangle) {
        try {
            await sequelize.transaction(async (transaction) => {
                await AppConfig.upsert({ name: 'panel_bounds', json: rectangle }, { transaction });
            });

        } catch (err) {
            DatabaseError.catch(err);
        };
    };

    static async setPanelBounds() {
        try {
            const panelWindow = getPanelWindow();
            const bounds = (await AppConfig.findByPk('panel_bounds'))?.toJSON();
            if (!bounds || !isObject<Rectangle>(bounds.json)) return;
            panelWindow.setBounds(bounds.json);

        } catch (err) {
            DatabaseError.catch(err);
        };
    };
};

AppConfig.init({
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    json: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, { sequelize, tableName: 'app_config', timestamps: true });