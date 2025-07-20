import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { User, Userinit } from "./models/user";
import { Message, Messageinit } from "./models/messages";
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "",
    process.env.DB_USERNAME || "",
    process.env.DB_PASSWORD || "",
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: console.log,
    }
);

Userinit(sequelize);
Messageinit(sequelize);

User.hasMany(Message, { foreignKey: "senderID" });
User.hasMany(Message, { foreignKey: "recieverID" });
Message.belongsTo(User, { foreignKey: "senderID" });
Message.belongsTo(User, { foreignKey: "recieverID" });

export default sequelize;
export { Message, User };
