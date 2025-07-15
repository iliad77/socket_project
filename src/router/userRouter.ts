import { Request, Response, Router } from "express";
import { User } from "../models/user";
import { IDmiddleware } from "../middlewares/IDmiddleware";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { SECRET_TOKEN } = process.env;

console.log(SECRET_TOKEN);

const router = Router();

router.get("/allusers", async (request: Request, response: Response) => {
    try {
        const users = await User.findAll();
        if (users.length === 0)
            return response.status(404).json({ msg: "there is no any user" });
        return response.status(200).json(users);
    } catch (error) {
        return response.json(error);
    }
});

router.get(
    "/user/:id",
    IDmiddleware,
    async (request: Request, response: Response) => {
        try {
            const user = await User.findByPk((request as any).parsedID);
            if (!user)
                return response
                    .status(404)
                    .json({ msg: "no user with this ID" });
            return response.status(200).json(user);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.post("/user", async (request: Request, response: Response) => {
    try {
        const { username, password } = request.body;
        if (!username || !password)
            return response
                .status(400)
                .json({ msg: "all field must be provided" });
        const user = await User.findOne({ where: { username: username } });
        if (user)
            return response.status(400).json({ msg: "username already exist" });
        const hash_pass = bcrypt.hash(password, 5);
        const newUser = await User.create(
            { username, hash_pass },
            { returning: true }
        );
        return response
            .status(200)
            .json({ msg: `user ${newUser.username} created successfully` });
    } catch (error) {
        return response.json(error);
    }
});

router.post("/login", async (request: Request, response: Response) => {
    try {
        const { username, password } = request.body;
        if (!username || !password)
            return response
                .status(400)
                .json({ msg: "all field must be provided!" });
        const user = await User.findOne({ where: { username: username } });
        if (!user)
            return response
                .status(404)
                .json({ msg: "username does not exist" });
        if (!(await bcrypt.compare(password, user.password)))
            return response.status(400).json({ msg: "password is incorrect" });
        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, SECRET_TOKEN!, { expiresIn: "20m" });
        return response
            .status(200)
            .json({ msg: "you have logged in successfully", token: token });
    } catch (error) {
        return response.json(error);
    }
});
