import type { Request, Response } from "express";
import {
    createUserSchema,
    idParamSchema,
    updateUserSchema,
} from "../schemas/index.js";
import * as userService from "../services/userService.js";
import { handleController } from "../utils/controller.js";
import { parseWithZod, sendValidationError } from "../utils/validate.js";

export const userController = {
    list: handleController(async (_req: Request, res: Response) => {
        const users = await userService.listUsers();
        return res.status(200).json({ users });
    }),

    getById: handleController(async (req: Request, res: Response) => {
        const parsedParams = parseWithZod(idParamSchema, req.params);
        if (!parsedParams.ok) {
            return sendValidationError(res, parsedParams.error);
        }

        const user = await userService.getUserById(parsedParams.data.id);
        return res.status(200).json({ user });
    }),

    create: handleController(async (req: Request, res: Response) => {
        const parsed = parseWithZod(createUserSchema, req.body);
        if (!parsed.ok) {
            return sendValidationError(res, parsed.error);
        }

        const user = await userService.createUser(parsed.data);
        return res.status(201).json({ user });
    }),

    update: handleController(async (req: Request, res: Response) => {
        const parsedParams = parseWithZod(idParamSchema, req.params);
        if (!parsedParams.ok) {
            return sendValidationError(res, parsedParams.error);
        }

        const parsedBody = parseWithZod(updateUserSchema, req.body ?? {});
        if (!parsedBody.ok) {
            return sendValidationError(res, parsedBody.error);
        }

        const user = await userService.updateUser(
            parsedParams.data.id,
            parsedBody.data,
        );
        return res.status(200).json({ user });
    }),

    remove: handleController(async (req: Request, res: Response) => {
        const parsedParams = parseWithZod(idParamSchema, req.params);
        if (!parsedParams.ok) {
            return sendValidationError(res, parsedParams.error);
        }

        const result = await userService.deleteUser(parsedParams.data.id);
        return res.status(200).json(result);
    }),
};
