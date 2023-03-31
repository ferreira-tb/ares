import { DataTypes, Model } from 'sequelize';
import { isObject } from '@tb-dev/ts-guard';
import { sequelize } from '$database/database';
import { DatabaseError } from '$electron/error';
import { getPanelWindow } from '$electron/utils/helpers';
import type { Rectangle } from 'electron';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { AppConfigName, AppConfigJSON, GeneralAppConfigType } from '$types/config';
import type { useAppGeneralConfigStore } from '$interface/index';

/** Diz respeito a configurações que abrangem toda a aplicação, independentemente do usuário. */
export class AppConfig extends Model<InferAttributes<AppConfig>, InferCreationAttributes<AppConfig>> {
    declare readonly name: AppConfigName;
    declare readonly json: AppConfigJSON;

    public static async saveGeneralConfig(configStore: ReturnType<typeof useAppGeneralConfigStore>) {
        try {
            const config = { ...configStore };
            await sequelize.transaction(async (transaction) => {
                await AppConfig.upsert({ name: 'general_config', json: config }, { transaction });
            });

        } catch (err) {
            DatabaseError.catch(err);
        };
    };

    public static async setGeneralConfig(configStore: ReturnType<typeof useAppGeneralConfigStore>) {
        try {
            const previousConfig = (await AppConfig.findByPk('general_config'))?.toJSON();
            if (!previousConfig || !isObject<GeneralAppConfigType>(previousConfig.json)) return;

            type ConfigEntries = [keyof GeneralAppConfigType, GeneralAppConfigType[keyof GeneralAppConfigType]][];
            for (const [key, value] of Object.entries(previousConfig.json) as ConfigEntries) {
                if (configStore[key] === value) continue;
                configStore[key] = value;
            };

        } catch (err) {
            DatabaseError.catch(err);
        };
    };

    //////// PAINEL
    public static async savePanelBounds(rectangle: Rectangle) {
        try {
            await sequelize.transaction(async (transaction) => {
                await AppConfig.upsert({ name: 'panel_bounds', json: rectangle }, { transaction });
            });

        } catch (err) {
            DatabaseError.catch(err);
        };
    };

    public static async setPanelBounds() {
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