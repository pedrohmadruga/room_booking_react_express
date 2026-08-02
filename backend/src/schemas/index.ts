import { z } from "zod";
import { Shift } from "../../generated/prisma/enums.js";

export const idParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const addressSchema = z.object({
    street: z.string().trim().min(1),
    number: z.string().trim().min(1),
    complement: z.string().trim().optional().nullable(),
    neighborhood: z.string().trim().min(1),
    cep: z.string().trim().min(1),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
});

export const addressUpdateSchema = addressSchema.partial();

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export const registerSchema = z.object({
    name: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(1),
    phone: z.string().trim().optional().nullable(),
    cpf: z.string().trim().min(1),
    address: addressSchema,
});

export const createUserSchema = registerSchema.extend({
    isAdmin: z.boolean().optional().default(false),
});

export const updateUserSchema = z.object({
    name: z.string().trim().min(1).optional(),
    email: z.email().optional(),
    password: z.string().min(1).optional(),
    phone: z.string().trim().optional().nullable(),
    cpf: z.string().trim().min(1).optional(),
    isAdmin: z.boolean().optional(),
    address: addressUpdateSchema.optional(),
});

export const createRoomSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().optional().nullable(),
    capacity: z.coerce.number().int().nonnegative(),
    price: z.coerce.number().nonnegative(),
    imageUrl: z.string().trim().min(1).optional().nullable(),
});

export const updateRoomSchema = z.object({
    name: z.string().trim().min(1).optional(),
    description: z.string().trim().optional().nullable(),
    capacity: z.coerce.number().int().nonnegative().optional(),
    price: z.coerce.number().nonnegative().optional(),
    imageUrl: z.string().trim().min(1).optional().nullable(),
});

export const createBookingSchema = z.object({
    roomId: z.coerce.number().int().positive(),
    day: z.union([z.string().min(1), z.date()]),
    shift: z.enum(Shift),
});

export const updateBookingSchema = z.object({
    roomId: z.coerce.number().int().positive().optional(),
    day: z.union([z.string().min(1), z.date()]).optional(),
    shift: z.enum(Shift).optional(),
});

export const roomAvailabilityQuerySchema = z.object({
    day: z.union([z.string().min(1), z.date()]),
    shift: z.enum(Shift),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type AddressUpdateInput = z.infer<typeof addressUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type RoomAvailabilityQuery = z.infer<typeof roomAvailabilityQuerySchema>;