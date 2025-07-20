import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../sequelize";

export class User extends Model {
    public id!: number;
    public username!: string;
    public password!: string;
}

export const Userinit = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: { type: DataTypes.STRING, allowNull: false },
            password: { type: DataTypes.STRING, allowNull: false },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
            timestamps: false,
        }
    );
    return User;
};
