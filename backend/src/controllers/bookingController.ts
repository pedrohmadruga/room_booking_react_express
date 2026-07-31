import type { Request, Response } from "express";
import {
    createBookingSchema,
    idParamSchema,
    updateBookingSchema,
} from "../schemas/index.js";
import * as bookingService from "../services/bookingService.js";
import { handleController } from "../utils/controller.js";
import { parseWithZod, sendValidationError } from "../utils/validate.js";

export const bookingController = {
    list: handleController(async (req: Request, res: Response) => {
        const bookings = await bookingService.listBookings(req.user!);
        return res.status(200).json({ bookings });
    }),

    getById: handleController(async (req: Request, res: Response) => {
        const parsedParams = parseWithZod(idParamSchema, req.params);
        if (!parsedParams.ok) {
            return sendValidationError(res, parsedParams.error);
        }

        const booking = await bookingService.getBookingById(
            parsedParams.data.id,
            req.user!,
        );
        return res.status(200).json({ booking });
    }),

    create: handleController(async (req: Request, res: Response) => {
        const parsed = parseWithZod(createBookingSchema, req.body);
        if (!parsed.ok) {
            return sendValidationError(res, parsed.error);
        }

        const booking = await bookingService.createBooking(
            parsed.data,
            req.user!.userId,
        );
        return res.status(201).json({ booking });
    }),

    update: handleController(async (req: Request, res: Response) => {
        const parsedParams = parseWithZod(idParamSchema, req.params);
        if (!parsedParams.ok) {
            return sendValidationError(res, parsedParams.error);
        }

        const parsedBody = parseWithZod(updateBookingSchema, req.body ?? {});
        if (!parsedBody.ok) {
            return sendValidationError(res, parsedBody.error);
        }

        const booking = await bookingService.updateBooking(
            parsedParams.data.id,
            parsedBody.data,
            req.user!,
        );
        return res.status(200).json({ booking });
    }),

    remove: handleController(async (req: Request, res: Response) => {
        const parsedParams = parseWithZod(idParamSchema, req.params);
        if (!parsedParams.ok) {
            return sendValidationError(res, parsedParams.error);
        }

        const result = await bookingService.deleteBooking(
            parsedParams.data.id,
            req.user!,
        );
        return res.status(200).json(result);
    }),
};
