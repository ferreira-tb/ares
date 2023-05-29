import { DataTypes, Model } from 'sequelize';
import { assertInteger } from '$shared/guards';
import { sequelize } from '$electron/database';
import { assertUserAlias } from '$shared/guards';
import { DatabaseError } from '$electron/error';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class CustomPlunderTemplate extends Model<
    InferAttributes<CustomPlunderTemplate>,
    InferCreationAttributes<CustomPlunderTemplate>>
implements CustomPlunderTemplateType {
    declare readonly id: CreationOptional<number>;
    declare readonly alias: UserAlias;
    declare readonly type: string;
    declare readonly description: string | null;
    declare readonly units: CustomPlunderTemplateType['units'];

    public static async getCustomPlunderTemplates(alias: UserAlias): Promise<CustomPlunderTemplateType[] | null> {
        try {
            assertUserAlias(alias, DatabaseError);
            const templates = await CustomPlunderTemplate.findAll({ where: { alias } });
            return templates.map((template) => template.toJSON());

        } catch (err) {
            DatabaseError.catch(err);
            return null;
        };
    };

    public static async saveCustomPlunderTemplate(template: CustomPlunderTemplateType): Promise<boolean> {
        try {
            for (const [unit, amount] of Object.entries(template.units)) {
                assertInteger(amount, `Invalid ${unit} amount: ${amount}`);
                if (amount < 0) throw new DatabaseError(`${unit} amount cannot be negative`);
            };

            await sequelize.transaction(async () => {
                await CustomPlunderTemplate.upsert({ ...template });
            });

            return true;

        } catch (err) {
            DatabaseError.catch(err);
            return false;
        };
    };

    public static async destroyCustomPlunderTemplate(template: CustomPlunderTemplateType): Promise<boolean> {
        try {
            assertUserAlias(template.alias, DatabaseError);
            await sequelize.transaction(async () => {
                await CustomPlunderTemplate.destroy({ where: { alias: template.alias, type: template.type } });
            });

            return true;

        } catch (err) {
            DatabaseError.catch(err);
            return false;
        };
    };
};

CustomPlunderTemplate.init({
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
    type: {
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
}, { sequelize, tableName: 'custom_plunder_template', timestamps: true });