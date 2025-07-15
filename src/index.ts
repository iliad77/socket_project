import express from "express";
import sequelize from "./sequelize";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const PORT = 3000;

sequelize
    .authenticate()
    .then(() => console.log(`DB connected ${process.env.DB_NAME}`))
    .catch((err) => console.error("Connection error:", err));

app.listen(PORT, () => {
    console.log(`connected to ${PORT}`);
});
