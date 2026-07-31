import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/types/booking";
import { CalendarIcon, ClockIcon } from "@/components/icons";
import { Users, CircleDollarSign } from "lucide-react";
import { resolveRoomImageUrl } from "@/lib/roomImage";
import { formatBookingDay, formatBookingShift } from "@/lib/bookingTime";
import { deleteBooking } from "@/services/booking";

type ManageBookingModalProps = Readonly<{
    booking: Booking | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCancelled?: (bookingId: number) => void;
}>;

export default function ManageBookingModal({
    booking,
    open,
    onOpenChange,
    onCancelled,
}: ManageBookingModalProps) {
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const imageSrc = resolveRoomImageUrl(booking?.room?.imageUrl);
    const formattedDay = booking ? formatBookingDay(booking.day) : "";
    const shiftLabel = booking ? formatBookingShift(booking.shift) : "";

    function handleOpenChange(nextOpen: boolean) {
        if (cancelling) return;
        if (!nextOpen) {
            setError(null);
            setSuccess(false);
        }
        onOpenChange(nextOpen);
    }

    async function handleCancelBooking() {
        if (!booking) return;

        const bookingId = booking.id;
        setCancelling(true);
        setError(null);

        try {
            await deleteBooking(bookingId);
            setSuccess(true);
            onCancelled?.(bookingId);

            window.setTimeout(() => {
                setSuccess(false);
                onOpenChange(false);
            }, 1200);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response
                    ?.data?.message ?? "Failed to cancel booking";
            setError(message);
        } finally {
            setCancelling(false);
        }
    }

    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-white text-brand sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-brand">
                        Manage Booking
                    </DialogTitle>
                    <DialogDescription>
                        Review your reservation details below.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <img
                        src={imageSrc}
                        alt={booking.room?.name}
                        className="aspect-video w-full rounded-lg object-cover"
                    />
                    <div>
                        <h3 className="text-lg font-semibold">{booking.room?.name}</h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                            <Users className="size-3.5 shrink-0" /> Up to{" "}
                            {booking.room?.capacity} people
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            {booking.room?.description}
                        </p>
                    </div>

                    <div className="flex items-center border-y border-gray-100 py-4">
                        <div className="flex flex-1 flex-col gap-2">
                            <p className="flex items-center gap-2 text-sm text-gray-600">
                                <CalendarIcon className="size-4 shrink-0" />{" "}
                                {formattedDay}
                            </p>
                            <p className="flex items-center gap-2 text-sm text-gray-600">
                                <ClockIcon className="size-4 shrink-0" />{" "}
                                {shiftLabel}
                            </p>
                        </div>

                        <div className="mx-4 h-10 w-px bg-gray-200" />

                        <div className="flex flex-1 items-center gap-3">
                            <CircleDollarSign className="size-5 shrink-0 text-brand" />
                            <div>
                                <p className="text-sm font-semibold">Total</p>
                                <p className="text-sm text-gray-500">
                                    ${booking.room?.price?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400">Booking #{booking.id}</p>

                    {error ? (
                        <div className="rounded-xl bg-brand px-4 py-3 text-sm text-white shadow-sm">
                            <p className="font-semibold">Could not cancel</p>
                            <p className="mt-0.5 text-white/80">{error}</p>
                        </div>
                    ) : null}

                    {success ? (
                        <div className="rounded-xl bg-emerald-600 px-4 py-3 text-sm text-white shadow-sm">
                            <p className="font-semibold">Booking cancelled</p>
                            <p className="mt-0.5 text-white/90">
                                Your reservation was removed successfully.
                            </p>
                        </div>
                    ) : null}
                </div>

                <DialogFooter className="border-0 bg-transparent">
                    <Button
                        type="button"
                        className="border-gray-300 bg-white text-brand hover:bg-gray-100 hover:text-brand"
                        onClick={() => handleOpenChange(false)}
                        disabled={cancelling || success}
                    >
                        Close
                    </Button>
                    <Button
                        type="button"
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={handleCancelBooking}
                        disabled={cancelling || success}
                    >
                        {cancelling ? "Cancelling..." : "Cancel booking"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
