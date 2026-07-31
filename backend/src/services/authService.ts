import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import type { LoginInput, RegisterInput } from "../schemas/index.js";
import { AppError } from "../utils/AppError.js";
import { buildAddressCreate, userSelect } from "../utils/users.js";

export async function login(input: LoginInput) {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
    });

    if (!user) {
        throw new AppError(400, "User not found");
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) {
        throw new AppError(400, "Invalid password");
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" },
    );

    return { message: "Login successful", token, user };
}

export async function register(input: RegisterInput) {
    const { name, email, password, phone, cpf, address } = input;

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { cpf }],
        },
    });

    if (existingUser) {
        const field = existingUser.email === email ? "email" : "cpf";
        throw new AppError(400, `User with this ${field} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone: phone?.trim() || null,
            cpf,
            address: {
                create: buildAddressCreate(address),
            },
        },
        select: userSelect,
    });

    return { message: "User created successfully", user };
}
