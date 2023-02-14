import { BrowserWindow } from 'electron';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database/database.js';
import { MainProcessError } from '$electron/error.js';
import { getPanelWindow } from '$electron/utils/helpers.js';
import { assertType } from '$electron/utils/assert.js';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { Rectangle } from 'electron';

export class UserConfig extends Model<InferAttributes<UserConfig>, InferCreationAttributes<UserConfig>> {
    declare readonly name: string;
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
            MainProcessError.handle(err);
        };
    };

    public static async setPanelBounds() {
        try {
            const panelWindow = getPanelWindow();
            assertType(panelWindow instanceof BrowserWindow, 'Não foi possível obter a janela do painel.');

            const bounds = await UserConfig.findByPk('panel_bounds');
            if (!bounds || typeof bounds.json !== 'string') return;

            const rectangle = JSON.parse(bounds.json) as Rectangle;
            panelWindow.setBounds(rectangle);

        } catch (err) {
            MainProcessError.handle(err);
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