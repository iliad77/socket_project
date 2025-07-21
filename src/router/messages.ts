import { Router, Request, Response } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { Message, User } from "../sequelize";
import { Op } from "sequelize";

const router = Router();

router.get(
    "/messages/:sender/:reciever",
    AuthMiddleware,
    async (request: Request, response: Response) => {
        try {
            const { sender, reciever } = request.params;
            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        { senderID: sender, recieverID: reciever },
                        { senderID: reciever, recieverID: sender },
                    ],
                },
                include: [
                    {
                        model: User,
                        as: "sender",
                        attributes: ["username"],
                    },
                ],
                order: [["createdAt", "ASC"]],
            });
            response.json(messages);
        } catch (error) {
            return response.json(error);
        }
    }
);

export default router;
