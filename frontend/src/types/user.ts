export type UserAddress = {
    id: number;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    cep: string;
    city: string;
    state: string;
};

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    cpf: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    address: UserAddress;
};

export type UserAddressInput = {
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    cep: string;
    city: string;
    state: string;
};

export type CreateUserInput = {
    name: string;
    email: string;
    password: string;
    phone?: string | null;
    cpf: string;
    isAdmin?: boolean;
    address: UserAddressInput;
};

export type UpdateUserInput = {
    name?: string;
    email?: string;
    password?: string;
    phone?: string | null;
    cpf?: string;
    isAdmin?: boolean;
    address?: Partial<UserAddressInput>;
};
