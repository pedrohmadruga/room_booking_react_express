import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/booking";
import { Link } from "react-router-dom";
import BookingCard from "@/components/BookingCard";

type BookingsListProps = Readonly<{
    bookings: Booking[];
    onManageBooking?: (booking: Booking) => void;
}>;

export default function BookingsList({ bookings, onManageBooking }: BookingsListProps) {
    return (
        bookings.length > 0 ? (
            bookings.map((booking) => {
                return (
                    <BookingCard key={booking.id} booking={booking} onManage={onManageBooking} />
                )
            })
        ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                    No bookings found
                </h1>
                <p className="mt-3 max-w-md text-sm text-brand/80">
                    Book a room to see your available bookings
                </p>
                <Link
                    to="/rooms"
                    className={cn(
                        buttonVariants({ size: "lg" }),
                        "mt-8 bg-brand px-6 text-white hover:bg-brand-hover",
                    )}
                >
                    See available rooms
                </Link>
            </div>
        )
    )
}