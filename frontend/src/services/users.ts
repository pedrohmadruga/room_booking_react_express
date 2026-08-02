import api from "./api";
import type {
    AdminUser,
    CreateUserInput,
    UpdateUserInput,
} from "@/types/user";

export async function getUsers() {
    const { data } = await api.get<{ users: AdminUser[] }>("/users");
    return data;
}

export async function createUser(input: CreateUserInput) {
    const { data } = await api.post<{ user: AdminUser }>("/users", input);
    return data;
}

export async function updateUser(id: number, input: UpdateUserInput) {
    const { data } = await api.put<{ user: AdminUser }>(`/users/${id}`, input);
    return data;
}

export async function deleteUser(id: number) {
    const { data } = await api.delete<{ message: string }>(`/users/${id}`);
    return data;
}
