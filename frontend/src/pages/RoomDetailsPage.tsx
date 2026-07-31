import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFoundPage from "./NotFoundPage";
import { getRoomById } from "@/services/rooms";
import type { Room } from "@/types/room";
import PageLayout from "@/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { resolveRoomImageUrl } from "@/lib/roomImage";
import { ChevronDown, ShieldCheckIcon, Users, CircleDollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { checkBookingAvailability } from "@/services/booking";

type Shift = "MORNING" | "AFTERNOON" | "EVENING";

export default function RoomDetailsPage() {
    const { id } = useParams();
    const parsedRoomId = Number(id);

    const isValidRoomId = Number.isInteger(parsedRoomId) && parsedRoomId > 0;

    const [room, setRoom] = useState<Room | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    const [day, setDay] = useState<Date | undefined>();
    const [shift, setShift] = useState<Shift | "">("");

    const [availability, setAvailability] = useState<boolean | null>(null);
    const [availabilityError, setAvailabilityError] = useState<string | null>(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    useEffect(() => {
        if (!isValidRoomId) {
            setNotFound(true);
            setLoading(false);
            return;
        }

        setLoading(true);

        getRoomById(parsedRoomId.toString())
            .then((data) => setRoom(data.room))
            .catch((error) => {
                if (error.response?.status === 404) setNotFound(true);
            })
            .finally(() => setLoading(false));
    }, [parsedRoomId, isValidRoomId]);

    useEffect(() => {
        setAvailability(null);
        setAvailabilityError(null);
    }, [day, shift]);

    function handleDaySelect(nextDay: Date | undefined) {
        setDay(nextDay);
    }

    function handleShiftChange(value: string) {
        setShift(value as Shift | "");
    }

    function handleCheckAvailability() {
        if (!day || !shift) {
            setAvailability(null);
            setAvailabilityError("Select a day and shift first");
            return;
        }

        setCheckingAvailability(true);
        setAvailabilityError(null);

        checkBookingAvailability(parsedRoomId.toString(), day, shift)
            .then((data) => {
                setAvailability(data.available);
            })
            .catch((error) => {
                setAvailability(null);
                setAvailabilityError(
                    error.response?.data?.message || "Failed to check availability",
                );
            })
            .finally(() => setCheckingAvailability(false));
    }

    if (notFound) return <NotFoundPage />;
    if (loading || !room) return <p>Loading...</p>;

    return (
        <PageLayout
            variant="app"
            mainClassName="mx-auto flex w-full max-w-7xl flex-col px-4 py-10 text-brand"
        >
            <p className="text-sm font-semibold hover:underline">
                <Link to="/rooms">← Back to all rooms</Link>
            </p>

            <div className="mt-6 grid gap-8 md:grid-cols-2">
                <img
                    src={resolveRoomImageUrl(room.imageUrl)}
                    alt={room.name}
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                />

                <div className="rounded-xl bg-white p-6 shadow-lg">
                    <h1 className="text-3xl font-semibold">{room.name}</h1>
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <Users className="size-4" /> Up to {room.capacity} people
                    </p>
                    <p className="mt-4 max-w-sm pt-4 text-sm leading-snug text-gray-500 line-clamp-2">
                        {room.description}
                    </p>

                    <div className="mt-8 flex items-center border-t border-gray-100 py-5">
                        <div className="flex flex-1 items-center gap-3">
                            <Users className="size-5 shrink-0 text-brand" />
                            <div>
                                <p className="text-sm font-semibold leading-5 text-brand">
                                    Capacity
                                </p>
                                <p className="mt-1 text-sm leading-5 text-gray-500">
                                    Up to {room.capacity} people
                                </p>
                            </div>
                        </div>

                        <div className="mx-6 flex items-center self-center">
                            <div className="h-8 w-px bg-gray-200" />
                        </div>

                        <div className="flex flex-1 items-center gap-3">
                            <CircleDollarSign className="size-5 shrink-0 text-brand" />
                            <div>
                                <p className="text-sm font-semibold leading-5 text-brand">
                                    Price
                                </p>
                                <p className="mt-1 text-sm leading-5 text-gray-500">
                                    ${room.price.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-400">
                        All prices are inclusive of taxes and fees.
                    </p>
                </div>
            </div>

            <Card className="mx-auto mt-10 w-full max-w-3xl gap-0 bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
                <h2 className="text-xl font-semibold text-brand">Book this room</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Select a day and shift to check availability and book.
                </p>

                <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-stretch md:gap-8">
                    <div className="shrink-0">
                        <Label className="text-sm font-semibold text-brand">Date</Label>
                        <Calendar
                            className="mt-3 bg-white text-brand"
                            mode="single"
                            selected={day}
                            onSelect={handleDaySelect}
                            disabled={{ before: new Date() }}
                        />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                        <Label htmlFor="shift" className="text-sm font-semibold text-brand">
                            Shift
                        </Label>
                        <div className="relative mt-3 w-full max-w-sm">
                            <select
                                id="shift"
                                value={shift}
                                onChange={(e) => handleShiftChange(e.target.value)}
                                className={cn(
                                    "h-12 w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-11 text-sm outline-none",
                                    "focus:border-brand focus:ring-2 focus:ring-brand/10",
                                    shift ? "text-brand" : "text-gray-400",
                                )}
                            >
                                <option value="" disabled>
                                    Select a time slot
                                </option>
                                <option value="MORNING">Morning</option>
                                <option value="AFTERNOON">Afternoon</option>
                                <option value="EVENING">Evening</option>
                            </select>
                            <ChevronDown
                                className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-gray-400"
                                aria-hidden
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-400">
                            Morning, Afternoon or Evening
                        </p>

                        {availabilityError ? (
                            <div className="mt-4 rounded-xl bg-brand px-4 py-3 text-sm text-white shadow-sm">
                                <p className="font-semibold">Something went wrong</p>
                                <p className="mt-0.5 text-white/80">{availabilityError}</p>
                            </div>
                        ) : null}

                        {availability === true ? (
                            <div className="mt-4 rounded-xl bg-emerald-600 px-4 py-3 text-sm text-white shadow-sm">
                                <p className="font-semibold">Available</p>
                                <p className="mt-0.5 text-white/90">
                                    This slot is free. You can make a reservation.
                                </p>
                            </div>
                        ) : null}

                        {availability === false ? (
                            <div className="mt-4 rounded-xl bg-red-600 px-4 py-3 text-sm text-white shadow-sm">
                                <p className="font-semibold">Unavailable</p>
                                <p className="mt-0.5 text-white/80">
                                    This slot is already booked. Choose another day or
                                    shift.
                                </p>
                            </div>
                        ) : null}

                        <div className="mt-auto flex flex-wrap items-center justify-end gap-3 pt-10">
                            {availability === true ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer border-gray-300 bg-white text-brand hover:bg-gray-50"
                                >
                                    Make Reservation
                                </Button>
                            ) : null}
                            <Button
                                type="button"
                                className="bg-brand px-5 text-white hover:bg-brand-hover"
                                onClick={handleCheckAvailability}
                                disabled={checkingAvailability || !day || !shift}
                            >
                                {checkingAvailability
                                    ? "Checking..."
                                    : "Check availability"}
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <ShieldCheckIcon className="size-4" />
                    Secure booking. Your information is safe with us.
                </p>
            </Card>
        </PageLayout>
    );
}
