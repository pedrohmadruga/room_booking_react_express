import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import type { CreateUserInput, UpdateUserInput } from "../schemas/index.js";
import { AppError } from "../utils/AppError.js";
import {
    buildAddressCreate,
    buildEmailCpfConflictWhere,
    buildUserUpdateData,
    userSelect,
} from "../utils/users.js";

export async function listUsers() {
    return prisma.user.findMany({ select: userSelect });
}

export async function getUserById(id: number) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: userSelect,
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    return user;
}

export async function createUser(input: CreateUserInput) {
    const { name, email, password, phone, cpf, address, isAdmin } = input;

    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { cpf }] },
    });

    if (existingUser) {
        throw new AppError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone: phone?.trim() || null,
            cpf,
            isAdmin,
            address: {
                create: buildAddressCreate(address),
            },
        },
        select: userSelect,
    });
}

export async function updateUser(id: number, body: UpdateUserInput) {
    const existingUser = await prisma.user.findUnique({
        where: { id },
        select: { id: true },
    });

    if (!existingUser) {
        throw new AppError(404, "User not found");
    }

    const conflictWhere = buildEmailCpfConflictWhere(id, body.email, body.cpf);
    if (conflictWhere) {
        const conflict = await prisma.user.findFirst({ where: conflictWhere });
        if (conflict) {
            throw new AppError(400, "Email or CPF already in use");
        }
    }

    const data = await buildUserUpdateData(body);

    return prisma.user.update({
        where: { id },
        data,
        select: userSelect,
    });
}

export async function deleteUser(id: number) {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
        throw new AppError(404, "User not found");
    }

    await prisma.user.delete({ where: { id } });
    return { message: "User deleted successfully" };
}
