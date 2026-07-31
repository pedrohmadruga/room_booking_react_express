import api from "./api";
import type { Booking } from "@/types/booking";

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
    shift: "MORNING" | "AFTERNOON" | "EVENING",
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
