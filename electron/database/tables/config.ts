import { DataTypes, Model } from 'sequelize';
import { isObject } from '@tb-dev/ts-guard';
import { sequelize } from '$database/database';
import { DatabaseError } from '$electron/error';
import { getPanelWindow } from '$electron/utils/helpers';
import type { Rectangle } from 'electron';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { AppConfigName, AppConfigJSON } from '$types/config';

/** Diz respeito a configurações que abrangem toda a aplicação, independentemente do usuário. */
export class AppConfig extends Model<InferAttributes<AppConfig>, InferCreationAttributes<AppConfig>> {
    declare readonly name: AppConfigName;
    declare readonly json: AppConfigJSON;

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
        allowNull: true,
    }
}, { sequelize, tableName: 'user_config', timestamps: true });