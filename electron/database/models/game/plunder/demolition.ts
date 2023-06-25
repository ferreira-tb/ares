import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$common/guards';
import { DatabaseError } from '$electron/error';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

export class PlunderDemolitionTemplate extends Model<
    InferAttributes<PlunderDemolitionTemplate>,
    InferCreationAttributes<PlunderDemolitionTemplate>>
implements PlunderDemolitionTemplateType {
    declare public readonly id: CreationOptional<number>;
    declare public readonly alias: UserAlias;
    declare public readonly name: string;
    declare public readonly description: string | null;
    declare public readonly units: PlunderDemolitionTemplateType['units'];

    declare public readonly createdAt: CreationOptional<Date>;
    declare public readonly updatedAt: CreationOptional<Date>;
}

PlunderDemolitionTemplate.init({
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
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, { sequelize, tableName: 'plunder_demolition_templates', timestamps: true });