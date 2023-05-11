import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { saveConfig, setConfig } from '$database/config/config';
import { savePanelBounds, setPanelBounds } from '$database/config/panel';
import { getLastRegionGameUrl, setGameRegion, saveGameRegion } from '$database/config/state';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

/** Diz respeito a configurações que abrangem toda a aplicação, independentemente do usuário. */
export class AppConfig extends Model<InferAttributes<AppConfig>, InferCreationAttributes<AppConfig>> {
    declare readonly name: AppConfigName;
    declare readonly json: AppConfigJSON;

    // Estado
    static readonly setGameRegion = setGameRegion(this);
    static readonly saveGameRegion = saveGameRegion(this);
    static readonly getLastRegionGameUrl = getLastRegionGameUrl(this);

    // Configurações
    static readonly setConfig = setConfig(this);
    static readonly saveConfig = saveConfig(this);
    
    // Painel
    static readonly setPanelBounds = setPanelBounds(this);
    static readonly savePanelBounds = savePanelBounds(this);
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