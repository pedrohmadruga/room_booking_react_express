import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { JwtPayload } from "../middlewares/auth.js";
import type {
    CreateBookingInput,
    UpdateBookingInput,
} from "../schemas/index.js";
import { AppError } from "../utils/AppError.js";
import {
    bookingIncludeFull,
    bookingIncludeWithRoom,
    canAccessBooking,
    isBookingInPast,
    parseBookingDay,
    prepareBookingUpdate,
} from "../utils/bookings.js";

function handleUniqueConflict(error: unknown): never {
    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    ) {
        throw new AppError(409, "Room already booked for this day and shift");
    }
    throw error;
}

export async function listBookings(user: JwtPayload) {
    if (user.isAdmin) {
        return prisma.booking.findMany({
            include: bookingIncludeFull,
        });
    }

    return prisma.booking.findMany({
        where: { userId: user.userId },
        include: bookingIncludeWithRoom,
    });
}

export async function getBookingById(id: number, user: JwtPayload) {
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: bookingIncludeFull,
    });

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (!canAccessBooking(user, booking.userId)) {
        throw new AppError(403, "Forbidden");
    }

    return booking;
}

export async function createBooking(input: CreateBookingInput, user: JwtPayload) {
    const { roomId, day, shift, userId: requestedUserId } = input;

    const targetUserId =
        user.isAdmin && requestedUserId !== undefined
            ? requestedUserId
            : user.userId;

    if (requestedUserId !== undefined && !user.isAdmin) {
        throw new AppError(403, "Forbidden");
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
        throw new AppError(404, "Room not found");
    }

    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true },
    });
    if (!targetUser) {
        throw new AppError(404, "User not found");
    }

    const bookingDay = parseBookingDay(day);
    if (!bookingDay) {
        throw new AppError(400, "Invalid day");
    }

    if (isBookingInPast(bookingDay, shift)) {
        throw new AppError(400, "Cannot book a past day or shift");
    }

    try {
        return await prisma.booking.create({
            data: {
                roomId,
                day: bookingDay,
                shift,
                userId: targetUserId,
            },
            include: bookingIncludeFull,
        });
    } catch (error) {
        handleUniqueConflict(error);
    }
}

export async function updateBooking(
    id: number,
    input: UpdateBookingInput,
    user: JwtPayload,
) {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (!canAccessBooking(user, booking.userId)) {
        throw new AppError(403, "Forbidden");
    }

    const { roomId, day, shift } = input;

    if (roomId !== undefined) {
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
            throw new AppError(404, "Room not found");
        }
    }

    const prepared = prepareBookingUpdate(booking, { roomId, day, shift });
    if (!prepared.ok) {
        throw new AppError(prepared.status, prepared.error);
    }

    try {
        return await prisma.booking.update({
            where: { id },
            data: prepared.data,
            include: bookingIncludeFull,
        });
    } catch (error) {
        handleUniqueConflict(error);
    }
}

export async function deleteBooking(id: number, user: JwtPayload) {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (!canAccessBooking(user, booking.userId)) {
        throw new AppError(403, "Forbidden");
    }

    await prisma.booking.delete({ where: { id } });
    return { message: "Booking deleted successfully" };
}

export async function checkRoomAvailability(
    roomId: number,
    day: string | Date,
    shift: CreateBookingInput["shift"],
) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
        throw new AppError(404, "Room not found");
    }

    const bookingDay = parseBookingDay(day);
    if (!bookingDay) {
        throw new AppError(400, "Invalid day");
    }

    const existing = await prisma.booking.findFirst({
        where: {
            roomId,
            shift,
            day: {
                gte: bookingDay,
                lt: new Date(
                    Date.UTC(
                        bookingDay.getUTCFullYear(),
                        bookingDay.getUTCMonth(),
                        bookingDay.getUTCDate() + 1,
                    ),
                ),
            },
        },
    });

    return { available: !existing };
}
