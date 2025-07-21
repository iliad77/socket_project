import express from "express";
import dotenv from "dotenv";
import path from "path";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import sequelize, { Message, User } from "./sequelize";
import UserRouter from "./router/userRouter";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import messageRouter from "./router/messages";

dotenv.config();
const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: { origin: "http://localhost:3000" },
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/v0", UserRouter);
app.use("/api/v0", messageRouter);

const PORT = process.env.PORT;
const secret = process.env.SECRET_TOKEN;

sequelize
    .authenticate()
    .then(() => console.log(`DB connected: ${process.env.DB_NAME}`))
    .catch((err) => console.error("Connection error:", err));

io.use(async (socket, next) => {
    const token = socket.handshake.headers["authorization"]?.split(" ")[1];
    if (!token) return next(new Error("unauthorized"));
    try {
        const decode = jwt.verify(token, secret!);
        const user = await User.findByPk((decode as any).id);
        if (!user) {
            return next(new Error("User not found"));
        }
        socket.data.username = user.username;
        console.log("Authenticated user:", user.username);
        next();
    } catch (error) {
        console.log("auth error:", (error as any).message);
        next(new Error("Invalid token"));
    }
});

const connectedSockets = new Map();

io.on("connect", (socket) => {
    const username = socket.data.username;
    connectedSockets.set(username, socket.id);
    console.log(`user ${username} connected by this socket ${socket.id}`);

    socket.on("message", async ({ to, message }) => {
        const targetSocketID = connectedSockets.get(to);
        socket.emit("message", `${username}:${message}`);
        if (targetSocketID) {
            const sender = await User.findOne({
                where: { username: username },
            });
            socket
                .to(targetSocketID)
                .emit("message", `${sender?.username}:${message}`);
            const reciever = await User.findOne({ where: { username: to } });
            await Message.create({
                senderID: sender?.id,
                recieverID: reciever?.id,
                content: message,
            });
        } else {
            const sender = await User.findOne({
                where: { username: username },
            });
            const reciever = await User.findOne({ where: { username: to } });
            await Message.create({
                senderID: sender?.id,
                recieverID: reciever?.id,
                content: message,
            });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
