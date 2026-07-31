import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/index.js";
import * as authService from "../services/authService.js";
import { handleController } from "../utils/controller.js";
import { parseWithZod, sendValidationError } from "../utils/validate.js";

export const authController = {
    login: handleController(async (req: Request, res: Response) => {
        const parsed = parseWithZod(loginSchema, req.body);
        if (!parsed.ok) {
            return sendValidationError(res, parsed.error);
        }

        const result = await authService.login(parsed.data);
        return res.status(200).json(result);
    }),

    register: handleController(async (req: Request, res: Response) => {
        const parsed = parseWithZod(registerSchema, req.body);
        if (!parsed.ok) {
            return sendValidationError(res, parsed.error);
        }

        const result = await authService.register(parsed.data);
        return res.status(201).json(result);
    }),
};
