import { DataTypes, Model } from 'sequelize';
import { isObject } from '@tb-dev/ts-guard';
import { sequelize } from '$database/database.js';
import { DatabaseError } from '$electron/error.js';
import { getPanelWindow } from '$electron/utils/helpers.js';
import { assertUserAlias } from '$electron/utils/guards.js';
import { unitsToDestroyWall } from '$electron/utils/constants.js';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import type { Rectangle } from 'electron';
import type { UserConfigName, UserConfigJSON, DemolitionTroopsPrimaryKey } from '$types/database.js';
import type { UnitsToDestroyWall } from '$types/game.js';
import type { UserAlias } from '$types/electron.js';

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
            DatabaseError.catch(err);
        };
    };

    public static async setPanelBounds() {
        try {
            const panelWindow = getPanelWindow();
            const bounds = await UserConfig.findByPk('panel_bounds');
            if (!bounds || !isObject(bounds.json)) return;
            panelWindow.setBounds(bounds.json as Rectangle);

        } catch (err) {
            DatabaseError.catch(err);
        };
    };

    private static generateDemolitionTroopsPrimaryKey(alias: UserAlias): DemolitionTroopsPrimaryKey {
        assertUserAlias(alias, DatabaseError);
        return `demolition_${alias}`;
    };

    public static async saveDemolitionTroopsConfig(alias: UserAlias, config: UnitsToDestroyWall) {
        try {       
            const primaryKey = this.generateDemolitionTroopsPrimaryKey(alias);
            await sequelize.transaction(async (transaction) => {
                await UserConfig.upsert({
                    name: primaryKey,
                    json: config
                }, { transaction });
            });

        } catch (err) {
            DatabaseError.catch(err);
        };
    };

    public static async getDemolitionTroopsConfig(alias: UserAlias): Promise<UnitsToDestroyWall | null> {
        try {
            const primaryKey = this.generateDemolitionTroopsPrimaryKey(alias);
            const config = await UserConfig.findByPk(primaryKey);
            if (!config || !isObject(config.json)) return unitsToDestroyWall;
            return config.json as UnitsToDestroyWall;

        } catch (err) {
            DatabaseError.catch(err);
            return null;
        };
    };

    public static async destroyDemolitionTroopsConfig(alias: UserAlias): Promise<boolean> {
        try {
            const primaryKey = this.generateDemolitionTroopsPrimaryKey(alias);
            await sequelize.transaction(async (transaction) => {
                await UserConfig.destroy({ where: { name: primaryKey }, transaction });
            });
            return true;

        } catch (err) {
            DatabaseError.catch(err);
            return false;
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