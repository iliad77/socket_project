import express from "express";
import sequelize from "./sequelize";
import dotenv from "dotenv";
import path from "path";
import { Server } from "socket.io";
import { createServer } from "http";
dotenv.config();
const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("message", (data) => {
        console.log(`Received message: ${data}`);
        io.emit("message", data);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = 3000;

sequelize
    .authenticate()
    .then(() => console.log(`DB connected ${process.env.DB_NAME}`))
    .catch((err) => console.error("Connection error:", err));

server.listen(PORT, () => {
    console.log(`connected to ${PORT}`);
});
