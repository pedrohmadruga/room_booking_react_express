import api from "./api";
import type { Room } from "@/types/room";

export async function getRooms() {
    const { data } = await api.get<{ rooms: Room[] }>("/rooms");
    return data;
}

export async function getRoomById(id: string) {
    const { data } = await api.get<{ room: Room }>(`/rooms/${id}`);
    return data;
}