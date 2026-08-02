import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Booking, BookingShift } from "@/types/booking";
import type { Room } from "@/types/room";
import type { AdminUser } from "@/types/user";
import { createAdminBooking, updateBooking } from "@/services/booking";
import { formatBookingDay } from "@/lib/bookingTime";

type BookingFormModalProps = Readonly<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking?: Booking | null;
    rooms: Room[];
    users: AdminUser[];
    onSaved: (booking: Booking) => void;
}>;

type FormState = {
    userId: string;
    roomId: string;
    day: string;
    shift: BookingShift;
};

const emptyForm: FormState = {
    userId: "",
    roomId: "",
    day: "",
    shift: "MORNING",
};

const fieldClassName =
    "h-10 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm shadow-none outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20 disabled:opacity-50";

const SHIFTS: BookingShift[] = ["MORNING", "AFTERNOON", "EVENING"];

function getErrorMessage(err: unknown, fallback: string) {
    const data = (
        err as { response?: { data?: { message?: string; error?: string } } }
    )?.response?.data;
    return data?.message ?? data?.error ?? fallback;
}

function getSubmitLabel(saving: boolean, isEditing: boolean) {
    if (saving) return "Saving...";
    if (isEditing) return "Save changes";
    return "Create booking";
}

function toInputDate(day: string) {
    const parsed = new Date(day);
    if (Number.isNaN(parsed.getTime())) return "";
    const year = parsed.getUTCFullYear();
    const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
    const date = String(parsed.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
}

export default function BookingFormModal({
    open,
    onOpenChange,
    booking = null,
    rooms,
    users,
    onSaved,
}: BookingFormModalProps) {
    const isEditing = Boolean(booking);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        setError(null);
        if (booking) {
            setForm({
                userId: String(booking.userId),
                roomId: String(booking.roomId),
                day: toInputDate(booking.day),
                shift: booking.shift,
            });
        } else {
            setForm({
                ...emptyForm,
                userId: users[0] ? String(users[0].id) : "",
                roomId: rooms[0] ? String(rooms[0].id) : "",
            });
        }
    }, [open, booking, rooms, users]);

    function handleOpenChange(nextOpen: boolean) {
        if (saving) return;
        onOpenChange(nextOpen);
    }

    function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(event: { preventDefault: () => void }) {
        event.preventDefault();
        setError(null);

        const roomId = Number(form.roomId);
        const userId = Number(form.userId);

        if (!Number.isFinite(roomId) || roomId <= 0) {
            setError("Please select a room");
            return;
        }
        if (!form.day) {
            setError("Please select a day");
            return;
        }
        if (!isEditing && (!Number.isFinite(userId) || userId <= 0)) {
            setError("Please select a user");
            return;
        }

        setSaving(true);
        try {
            if (isEditing && booking) {
                const result = await updateBooking(booking.id, {
                    roomId,
                    day: form.day,
                    shift: form.shift,
                });
                onSaved({
                    ...result.booking,
                    user: result.booking.user ?? booking.user,
                });
            } else {
                const result = await createAdminBooking({
                    roomId,
                    day: form.day,
                    shift: form.shift,
                    userId,
                });
                onSaved(result.booking);
            }
            onOpenChange(false);
        } catch (err: unknown) {
            setError(
                getErrorMessage(
                    err,
                    isEditing
                        ? "Failed to update booking"
                        : "Failed to create booking",
                ),
            );
        } finally {
            setSaving(false);
        }
    }

    const selectedRoom = rooms.find((room) => String(room.id) === form.roomId);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-white p-6 text-brand sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-brand">
                        {isEditing ? "Edit Booking" : "Add Booking"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the booking details below."
                            : "Fill in the details to create a new booking."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="booking-user">User</Label>
                        <select
                            id="booking-user"
                            value={form.userId}
                            onChange={(e) => updateField("userId", e.target.value)}
                            disabled={saving || isEditing}
                            className={fieldClassName}
                            required
                        >
                            <option value="" disabled>
                                Select a user
                            </option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        {isEditing ? (
                            <p className="text-xs text-slate-400">
                                User cannot be changed when editing.
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="booking-room">Room</Label>
                        <select
                            id="booking-room"
                            value={form.roomId}
                            onChange={(e) => updateField("roomId", e.target.value)}
                            disabled={saving}
                            className={fieldClassName}
                            required
                        >
                            <option value="" disabled>
                                Select a room
                            </option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.name} — ${room.price.toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="booking-day">Day</Label>
                            <Input
                                id="booking-day"
                                type="date"
                                value={form.day}
                                onChange={(e) => updateField("day", e.target.value)}
                                disabled={saving}
                                className="h-10 border border-slate-300 bg-white shadow-none focus-visible:border-brand focus-visible:ring-brand/20"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="booking-shift">Shift</Label>
                            <select
                                id="booking-shift"
                                value={form.shift}
                                onChange={(e) =>
                                    updateField("shift", e.target.value as BookingShift)
                                }
                                disabled={saving}
                                className={fieldClassName}
                                required
                            >
                                {SHIFTS.map((shift) => (
                                    <option key={shift} value={shift}>
                                        {shift.charAt(0) + shift.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedRoom && form.day ? (
                        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                            {selectedRoom.name} · {formatBookingDay(form.day)} ·{" "}
                            {form.shift.charAt(0) + form.shift.slice(1).toLowerCase()}
                        </p>
                    ) : null}

                    {error ? (
                        <div className="rounded-xl bg-brand px-4 py-3 text-sm text-white shadow-sm">
                            <p className="font-semibold">Could not save</p>
                            <p className="mt-0.5 text-white/80">{error}</p>
                        </div>
                    ) : null}

                    <DialogFooter className="mx-0 mb-0 mt-2 gap-2 border-0 bg-transparent px-0 pb-2 pt-4 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-slate-300 bg-white text-brand hover:bg-slate-50"
                            onClick={() => handleOpenChange(false)}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-brand text-white hover:bg-brand-hover"
                            disabled={saving}
                        >
                            {getSubmitLabel(saving, isEditing)}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
