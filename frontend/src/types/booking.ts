import type { Room } from "./room";

export type BookingShift = "MORNING" | "AFTERNOON" | "EVENING";

export type BookingUser = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    cpf: string;
};

export type Booking = {
    id: number;
    userId: number;
    roomId: number;
    day: string;
    shift: BookingShift;
    createdAt: string;
    room?: Room;
    user?: BookingUser;
};
