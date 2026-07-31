import bcrypt from "bcrypt";
import type { Prisma } from "../../generated/prisma/client.js";
import type {
    AddressInput,
    AddressUpdateInput,
    UpdateUserInput,
} from "../schemas/index.js";

export const userSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    cpf: true,
    isAdmin: true,
    createdAt: true,
    updatedAt: true,
    address: {
        select: {
            id: true,
            street: true,
            number: true,
            complement: true,
            neighborhood: true,
            cep: true,
            city: true,
            state: true,
        },
    },
} satisfies Prisma.UserSelect;

export function buildAddressCreate(address: AddressInput) {
    return {
        street: address.street,
        number: address.number,
        complement: address.complement ?? null,
        neighborhood: address.neighborhood,
        cep: address.cep,
        city: address.city,
        state: address.state,
    };
}

export function buildAddressUpdate(
    address: AddressUpdateInput,
): Prisma.AddressUpdateWithoutUsersInput {
    const data: Prisma.AddressUpdateWithoutUsersInput = {};

    if (address.street !== undefined) data.street = address.street;
    if (address.number !== undefined) data.number = address.number;
    if (address.complement !== undefined) data.complement = address.complement ?? null;
    if (address.neighborhood !== undefined) data.neighborhood = address.neighborhood;
    if (address.cep !== undefined) data.cep = address.cep;
    if (address.city !== undefined) data.city = address.city;
    if (address.state !== undefined) data.state = address.state;

    return data;
}

export function buildEmailCpfConflictWhere(
    id: number,
    email?: string,
    cpf?: string,
): Prisma.UserWhereInput | null {
    if (!email && !cpf) {
        return null;
    }

    return {
        AND: [
            { id: { not: id } },
            {
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(cpf ? [{ cpf }] : []),
                ],
            },
        ],
    };
}

export async function buildUserUpdateData(
    body: UpdateUserInput,
): Promise<Prisma.UserUpdateInput> {
    const { name, email, password, phone, cpf, address, isAdmin } = body;
    const data: Prisma.UserUpdateInput = {};

    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (cpf !== undefined) data.cpf = cpf;
    if (phone !== undefined) data.phone = phone?.trim() || null;
    if (isAdmin !== undefined) data.isAdmin = Boolean(isAdmin);
    if (password) data.password = await bcrypt.hash(password, 10);

    if (address) {
        data.address = {
            update: buildAddressUpdate(address),
        };
    }

    return data;
}
