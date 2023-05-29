import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$shared/guards';
import { DatabaseError } from '$electron/error';
import { unitsToDestroyWall } from '$shared/constants';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class DemolitionTemplate extends Model<
    InferAttributes<DemolitionTemplate>,
    InferCreationAttributes<DemolitionTemplate>>
implements DemolitionTemplateType {
    declare readonly id: CreationOptional<number>;
    declare readonly alias: UserAlias;
    declare readonly units: UnitsToDestroyWall;

    public static async getDemolitionTroopsConfig(alias: UserAlias): Promise<DemolitionTemplateType | null> {
        try {
            assertUserAlias(alias, DatabaseError);
            const demolitionTemplate = await DemolitionTemplate.findOne({ where: { alias } });
            if (!demolitionTemplate) {
                return { alias, units: unitsToDestroyWall };
            };
            
            return demolitionTemplate.toJSON();

        } catch (err) {
            DatabaseError.catch(err);
            return null;
        };
    };

    public static async saveDemolitionTroopsConfig(template: DemolitionTemplateType): Promise<boolean> {
        try {
            await sequelize.transaction(async (transaction) => {
                await DemolitionTemplate.upsert({ ...template }, { transaction });
            });
            return true;

        } catch (err) {
            DatabaseError.catch(err);
            return false;
        };
    };

    public static async destroyDemolitionTroopsConfig(alias: UserAlias): Promise<boolean> {
        try {
            assertUserAlias(alias, DatabaseError);
            await sequelize.transaction(async (transaction) => {
                await DemolitionTemplate.destroy({ where: { alias }, transaction });
            });
            return true;

        } catch (err) {
            DatabaseError.catch(err);
            return false;
        };
    };
};

DemolitionTemplate.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    alias: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isUserAlias(value: unknown) {
                assertUserAlias(value, DatabaseError);
            }
        }
    },
    units: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, { sequelize, tableName: 'demolition_template', timestamps: true });