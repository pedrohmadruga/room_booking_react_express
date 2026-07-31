import type { Request, Response } from "express";
import {
    createRoomSchema,
    idParamSchema,
    roomAvailabilityQuerySchema,
    updateRoomSchema,
} from "../schemas/index.js";
import * as roomService from "../services/roomService.js";
import * as bookingService from "../services/bookingService.js";
import { handleController } from "../utils/controller.js";
import { parseWithZod, sendValidationError } from "../utils/validate.js";

export const roomController = {
    list: handleController(async (_req: Request, res: Response) => {
        const rooms = await roomService.listRooms();
        return res.status(200).json({ rooms });
    }),

    getById: handleController(async (req: Request, res: Response) => {
        const parsedParams = parseWithZod(idParamSchema, req.params);
        if (!parsedParams.ok) {
            return sendValidationError(res, parsedParams.error);
        }

        const room = await roomService.getRoomById(parsedParams.data.id);
        return res.status(200).json({ room });
    }),

    checkAvailability: handleController(async (req: Request, res: Response) => {
        const parsedParams = parseWithZod(idParamSchema, req.params);
        if (!parsedParams.ok) {
            return sendValidationError(res, parsedParams.error);
        }

        const parsedQuery = parseWithZod(roomAvailabilityQuerySchema, req.query);
        if (!parsedQuery.ok) {
            return sendValidationError(res, parsedQuery.error);
        }

        const result = await bookingService.checkRoomAvailability(
            parsedParams.data.id,
            parsedQuery.data.day,
            parsedQuery.data.shift,
        );
        return res.status(200).json(result);
    }),

    create: handleController(async (req: Request, res: Response) => {
        const parsed = parseWithZod(createRoomSchema, req.body);
        if (!parsed.ok) {
            return sendValidationError(res, parsed.error);
        }

        const result = await roomService.createRoom(parsed.data);
        return res.status(201).json(result);
    }),

    update: handleController(async (req: Request, res: Response) => {
        const parsedParams = parseWithZod(idParamSchema, req.params);
        if (!parsedParams.ok) {
            return sendValidationError(res, parsedParams.error);
        }

        const parsedBody = parseWithZod(updateRoomSchema, req.body ?? {});
        if (!parsedBody.ok) {
            return sendValidationError(res, parsedBody.error);
        }

        const result = await roomService.updateRoom(
            parsedParams.data.id,
            parsedBody.data,
        );
        return res.status(200).json(result);
    }),

    remove: handleController(async (req: Request, res: Response) => {
        const parsedParams = parseWithZod(idParamSchema, req.params);
        if (!parsedParams.ok) {
            return sendValidationError(res, parsedParams.error);
        }

        const result = await roomService.deleteRoom(parsedParams.data.id);
        return res.status(200).json(result);
    }),
};
