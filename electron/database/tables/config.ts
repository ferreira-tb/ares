import { DataTypes, Model } from 'sequelize';
import { isString } from '@tb-dev/ts-guard';
import { sequelize } from '$electron/database/database.js';
import { MainProcessError } from '$electron/error.js';
import { assertPanelWindow } from '$electron/utils/helpers.js';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { Rectangle } from 'electron';
import type { UserConfigName } from '$types/database.js';

export class UserConfig extends Model<InferAttributes<UserConfig>, InferCreationAttributes<UserConfig>> {
    declare readonly name: UserConfigName;
    declare readonly json: string;

    public static async savePanelBounds(rectangle: Rectangle) {
        try {
            await sequelize.transaction(async (transaction) => {
                await UserConfig.upsert({
                    name: 'panel_bounds',
                    json: JSON.stringify(rectangle)
                }, { transaction });
            });

        } catch (err) {
            MainProcessError.capture(err);
        };
    };

    public static async setPanelBounds() {
        try {
            const panelWindow = assertPanelWindow();
            const bounds = await UserConfig.findByPk('panel_bounds');
            if (!bounds || !isString(bounds.json)) return;

            const rectangle = JSON.parse(bounds.json) as Rectangle;
            panelWindow.setBounds(rectangle);

        } catch (err) {
            MainProcessError.capture(err);
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
        type: DataTypes.STRING,
        allowNull: true,
    }
}, { sequelize, tableName: 'user_config' });