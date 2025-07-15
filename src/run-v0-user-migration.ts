import dotenv from "dotenv";
dotenv.config();

console.log(typeof process.env.DB_PASSWORD);
console.log(process.env.DB_PASSWORD);

import sequelize from "./sequelize";
import { up } from "./migrations/v0_create_user_migration";

(async () => {
    try {
        await sequelize.authenticate();
        console.log("db connected");
        await up(sequelize.getQueryInterface());
        console.log("migration completed");
    } catch (error) {
        console.log(error);
    } finally {
        await sequelize.close();
    }
})();
