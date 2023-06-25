import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$common/guards';
import { DatabaseError } from '$electron/error';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class PlunderCustomTemplate extends Model<
    InferAttributes<PlunderCustomTemplate>,
    InferCreationAttributes<PlunderCustomTemplate>>
implements PlunderCustomTemplateType {
    declare public readonly id: CreationOptional<number>;
    declare public readonly alias: UserAlias;
    declare public readonly name: string;
    declare public readonly description: string | null;
    declare public readonly units: PlunderCustomTemplateType['units'];
}

PlunderCustomTemplate.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    alias: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUserAlias(value: unknown) {
                assertUserAlias(value, DatabaseError);
            }
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    units: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, { sequelize, tableName: 'custom_plunder_templates', timestamps: true });