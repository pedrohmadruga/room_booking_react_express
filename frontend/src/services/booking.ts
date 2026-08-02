import api from "./api";
import type { Booking, BookingShift } from "@/types/booking";

export type BookingInput = {
    roomId: number;
    day: string;
    shift: BookingShift;
    userId?: number;
};

export async function getUserBookings() {
    const { data } = await api.get<{ bookings: Booking[] }>(`/bookings`);
    return data;
}

function toDateOnly(day: Date): string {
    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, "0");
    const date = String(day.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
}

export async function checkBookingAvailability(
    roomId: string,
    day: Date,
    shift: BookingShift,
) {
    const { data } = await api.get<{ available: boolean }>(
        `/rooms/${roomId}/availability`,
        {
            params: {
                day: toDateOnly(day),
                shift,
            },
        },
    );
    return data;
}

export async function deleteBooking(id: number) {
    const { data } = await api.delete<{ message: string }>(`/bookings/${id}`);
    return data;
}

export async function createBooking(
    roomId: number,
    day: Date,
    shift: BookingShift,
) {
    const { data } = await api.post<{ booking: Booking }>("/bookings", {
        roomId,
        day: toDateOnly(day),
        shift,
    });
    return data;
}

export async function createAdminBooking(input: BookingInput) {
    const { data } = await api.post<{ booking: Booking }>("/bookings", input);
    return data;
}

export async function updateBooking(id: number, input: Omit<BookingInput, "userId">) {
    const { data } = await api.put<{ booking: Booking }>(`/bookings/${id}`, input);
    return data;
}
