import { DataTypes, Model } from 'sequelize';
import { isObject } from '@tb-dev/ts-guard';
import { sequelize } from '$database/database.js';
import { MainProcessError } from '$electron/error.js';
import { assertPanelWindow } from '$electron/utils/helpers.js';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { Rectangle } from 'electron';
import type { UserConfigName, UserConfigJSON } from '$types/database.js';

export class UserConfig extends Model<InferAttributes<UserConfig>, InferCreationAttributes<UserConfig>> {
    declare readonly name: UserConfigName;
    declare readonly json: UserConfigJSON;

    public static async savePanelBounds(rectangle: Rectangle) {
        try {
            await sequelize.transaction(async (transaction) => {
                await UserConfig.upsert({
                    name: 'panel_bounds',
                    json: rectangle
                }, { transaction });
            });

        } catch (err) {
            MainProcessError.catch(err);
        };
    };

    public static async setPanelBounds() {
        try {
            const panelWindow = assertPanelWindow();
            const bounds = await UserConfig.findByPk('panel_bounds');
            if (!bounds || !isObject(bounds.json)) return;
            panelWindow.setBounds(bounds.json as Rectangle);

        } catch (err) {
            MainProcessError.catch(err);
        };
    };
};

UserConfig.init({
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