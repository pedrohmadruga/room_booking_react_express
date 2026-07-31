import { prisma } from "../lib/prisma.js";
import type { CreateRoomInput, UpdateRoomInput } from "../schemas/index.js";
import { AppError } from "../utils/AppError.js";

export async function listRooms() {
    return prisma.room.findMany();
}

export async function getRoomById(id: number) {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
        throw new AppError(404, "Room not found");
    }
    return room;
}

export async function createRoom(input: CreateRoomInput) {
    const { name, description, capacity, price } = input;

    const room = await prisma.room.create({
        data: {
            name,
            description: description?.trim() || null,
            capacity,
            price,
        },
    });

    return { message: "Room created successfully", room };
}

export async function updateRoom(id: number, body: UpdateRoomInput) {
    const existingRoom = await prisma.room.findUnique({ where: { id } });
    if (!existingRoom) {
        throw new AppError(404, "Room not found");
    }

    const { name, description, capacity, price } = body;
    const data: {
        name?: string;
        description?: string | null;
        capacity?: number;
        price?: number;
    } = {};

    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description?.trim() || null;
    if (capacity !== undefined) data.capacity = capacity;
    if (price !== undefined) data.price = price;

    const room = await prisma.room.update({
        where: { id },
        data,
    });

    return { message: "Room updated successfully", room };
}

export async function deleteRoom(id: number) {
    const existingRoom = await prisma.room.findUnique({ where: { id } });
    if (!existingRoom) {
        throw new AppError(404, "Room not found");
    }

    await prisma.room.delete({ where: { id } });
    return { message: "Room deleted successfully" };
}
