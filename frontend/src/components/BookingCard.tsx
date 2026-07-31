import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/types/booking";
import { CalendarIcon, ClockIcon } from "@/components/icons";
import { Users } from "lucide-react";
import { resolveRoomImageUrl } from "@/lib/roomImage";
import { isBookingInPast, formatBookingDay, formatBookingShift } from "@/lib/bookingTime";

type BookingCardProps = Readonly<{
    booking: Booking;
    onManage?: (booking: Booking) => void;
}>;

export default function BookingCard({ booking, onManage }: BookingCardProps) {
    const imageSrc = resolveRoomImageUrl(booking.room?.imageUrl);
    const canManage = !isBookingInPast(booking.day, booking.shift);

    const formattedDay = formatBookingDay(booking.day);
    const shiftLabel = formatBookingShift(booking.shift);

    return (
        <Card className="mb-4 flex w-full flex-col gap-0 overflow-hidden bg-white p-0 py-0 shadow-sm ring-1 ring-black/5 md:flex-row md:items-stretch">
            <div className="shrink-0 p-4 md:w-52">
                <img
                    className="aspect-video w-full rounded-lg object-cover md:aspect-auto md:h-28 md:w-44"
                    src={imageSrc}
                    alt={booking.room?.name}
                />
            </div>

            <div className="flex min-w-0 flex-col justify-center gap-1 px-4 py-4 md:py-6">
                <h3 className="text-lg font-semibold text-brand">{booking.room?.name}</h3>
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Users className="size-3.5 shrink-0" />
                    Up to {booking.room?.capacity} people
                </p>
                <p className="line-clamp-2 max-w-xs text-sm leading-snug text-gray-500">
                    {booking.room?.description}
                </p>
            </div>

            <div className="hidden items-center py-6 md:flex">
                <div className="h-24 w-px bg-gray-200" />
            </div>

            <div className="flex shrink-0 flex-col justify-center gap-2 px-4 py-4 md:py-6">
                <p className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="size-4 shrink-0" />
                    Day: {formattedDay}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="size-4 shrink-0" />
                    Shift: {shiftLabel}
                </p>
            </div>

            <div className="flex shrink-0 flex-col items-start justify-center gap-2 px-4 py-4 md:ml-auto md:min-w-40 md:py-6">
                <div>
                    <p className="text-lg font-semibold text-brand">
                        ${booking.room?.price?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">Total</p>
                </div>
                {canManage ? (
                    <Button
                        type="button"
                        size="sm"
                        className="bg-brand text-white hover:bg-brand-hover p-4"
                        onClick={() => onManage?.(booking)}
                    >
                        Manage Booking
                    </Button>
                ) : null}
            </div>
        </Card>
    );
}
