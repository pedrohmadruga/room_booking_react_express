import type { Request, Response } from "express";
import { handleController } from "../utils/controller.js";

export const homeController = {
    index: handleController(async (_req: Request, res: Response) => {
        return res.status(200).json({ message: "Welcome to the API!" });
    }),
};
