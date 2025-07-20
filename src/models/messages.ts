import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../sequelize";

export class Message extends Model {
    public id!: number;
    public senderID!: number;
    public recieverID!: number;
    public content!: string;
    public createdAt!: Date;
}
export const Messageinit = (sequelize: Sequelize) => {
    Message.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            senderID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onDelete: "CASCADE",
            },
            recieverID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onDelete: "CASCADE",
            },
            content: { type: DataTypes.STRING, allowNull: true },
        },
        {
            sequelize,
            modelName: "Message",
            tableName: "message",
            timestamps: false,
        }
    );
    return Message;
};
