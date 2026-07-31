import PageLayout from "@/layout/PageLayout";
import { useEffect, useState } from "react";
import { getUserBookings } from "@/services/booking";
import BookingsList from "@/sections/bookings/BookingsList";
import type { Booking } from "@/types/booking";
import ManageBookingModal from "@/components/ManageBookingModal";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBookings() {
            const data = await getUserBookings();
            setBookings(data.bookings);
        }

        fetchBookings();
    }, []);

    useEffect(() => {
        if (!feedback) return;
        const timeoutId = window.setTimeout(() => setFeedback(null), 4000);
        return () => window.clearTimeout(timeoutId);
    }, [feedback]);

    function handleCancelled(bookingId: number) {
        setBookings((current) => current.filter((b) => b.id !== bookingId));
        setFeedback("Booking cancelled successfully.");
    }

    return (
        <PageLayout
            variant="app"
            mainClassName="mx-auto flex w-full max-w-7xl flex-col px-4 py-10 text-brand"
        >
            <h2 className="text-2xl font-semibold">All bookings</h2>
            <p className="mt-2 pb-6 text-xs text-gray-500">
                Showing all bookings ({bookings.length})
            </p>

            {feedback ? (
                <div className="mb-6 rounded-xl bg-emerald-600 px-4 py-3 text-sm text-white shadow-sm">
                    <p className="font-semibold">Done</p>
                    <p className="mt-0.5 text-white/90">{feedback}</p>
                </div>
            ) : null}

            <BookingsList bookings={bookings} onManageBooking={setSelectedBooking} />

            <ManageBookingModal
                booking={selectedBooking}
                open={selectedBooking !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedBooking(null);
                }}
                onCancelled={handleCancelled}
            />
        </PageLayout>
    );
}
