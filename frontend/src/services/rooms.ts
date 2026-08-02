import api from "./api";
import type { Room } from "@/types/room";

export type RoomInput = {
    name: string;
    description?: string | null;
    capacity: number;
    price: number;
};

function toRoomFormData(input: Partial<RoomInput>, image?: File | null) {
    const formData = new FormData();

    if (input.name !== undefined) formData.append("name", input.name);
    if (input.description !== undefined) {
        formData.append("description", input.description ?? "");
    }
    if (input.capacity !== undefined) {
        formData.append("capacity", String(input.capacity));
    }
    if (input.price !== undefined) {
        formData.append("price", String(input.price));
    }
    if (image) {
        formData.append("image", image);
    }

    return formData;
}

export async function getRooms() {
    const { data } = await api.get<{ rooms: Room[] }>("/rooms");
    return data;
}

export async function getRoomById(id: string) {
    const { data } = await api.get<{ room: Room }>(`/rooms/${id}`);
    return data;
}

export async function createRoom(input: RoomInput, image?: File | null) {
    const formData = toRoomFormData(input, image);
    const { data } = await api.post<{ message: string; room: Room }>(
        "/rooms",
        formData,
    );
    return data;
}

export async function updateRoom(
    id: number,
    input: Partial<RoomInput>,
    image?: File | null,
) {
    const formData = toRoomFormData(input, image);
    const { data } = await api.put<{ message: string; room: Room }>(
        `/rooms/${id}`,
        formData,
    );
    return data;
}

export async function deleteRoom(id: number) {
    const { data } = await api.delete<{ message: string }>(`/rooms/${id}`);
    return data;
}
