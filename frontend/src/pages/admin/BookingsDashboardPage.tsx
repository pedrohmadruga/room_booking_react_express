import { Plus, CalendarDays, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { StatsGrid } from "@/components/admin/StatsGrid";
import StatCard from "@/components/admin/StatCard";
import { useEffect, useState } from "react";
import type { Booking } from "@/types/booking";
import type { Room } from "@/types/room";
import type { AdminUser } from "@/types/user";
import {
    deleteBooking,
    getUserBookings,
} from "@/services/booking";
import { getRooms } from "@/services/rooms";
import { getUsers } from "@/services/users";
import AdminDataPanel from "@/components/admin/AdminDataPanel";
import AdminRowActions from "@/components/admin/AdminRowActions";
import BookingFormModal from "@/components/admin/BookingFormModal";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import { resolveRoomImageUrl } from "@/lib/roomImage";
import { formatBookingDay, formatBookingShift } from "@/lib/bookingTime";

function wasCreatedInLastMonth(createdAt: string) {
    const created = new Date(createdAt);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return created >= monthAgo;
}

export default function BookingsDashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

    useEffect(() => {
        Promise.all([getUserBookings(), getRooms(), getUsers()])
            .then(([bookingsData, roomsData, usersData]) => {
                setBookings(bookingsData.bookings);
                setRooms(roomsData.rooms);
                setUsers(usersData.users);
            })
            .finally(() => setLoading(false));
    }, []);

    const totalBookings = bookings.length;
    const bookingsLastMonth = bookings.filter((booking) =>
        wasCreatedInLastMonth(booking.createdAt),
    ).length;

    function openCreateModal() {
        setEditingBooking(null);
        setFormOpen(true);
    }

    function openEditModal(booking: Booking) {
        setEditingBooking(booking);
        setFormOpen(true);
    }

    function handleBookingSaved(savedBooking: Booking) {
        setBookings((prev) => {
            const exists = prev.some((booking) => booking.id === savedBooking.id);
            if (exists) {
                return prev.map((booking) =>
                    booking.id === savedBooking.id ? savedBooking : booking,
                );
            }
            return [savedBooking, ...prev];
        });
    }

    async function handleDeleteBooking() {
        if (!bookingToDelete) return;
        await deleteBooking(bookingToDelete.id);
        setBookings((prev) =>
            prev.filter((booking) => booking.id !== bookingToDelete.id),
        );
    }

    if (loading) {
        return <p className="text-sm text-slate-500">Loading...</p>;
    }

    return (
        <>
            <AdminPageHeader
                title="Bookings Overview"
                description="Manage all bookings in your space. Add, edit or remove bookings."
                action={
                    <Button
                        type="button"
                        size="lg"
                        className="gap-2 bg-brand px-5 text-white hover:bg-brand-hover"
                        onClick={openCreateModal}
                    >
                        <Plus className="size-4" />
                        Add Booking
                    </Button>
                }
            />

            <StatsGrid>
                <StatCard
                    label="Total Bookings"
                    value={totalBookings}
                    helper="All bookings in the system"
                    icon={<CalendarDays className="size-4" />}
                    iconClassName="bg-blue-100 text-blue-600"
                />
                <StatCard
                    label="New This Month"
                    value={bookingsLastMonth}
                    helper="Bookings created in the last month"
                    icon={<CalendarPlus className="size-4" />}
                    iconClassName="bg-emerald-100 text-emerald-600"
                />
            </StatsGrid>

            <AdminDataPanel title="All Bookings">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500">
                            <th className="w-24 px-6 py-3.5 font-medium" />
                            <th className="px-6 py-3.5 font-medium">Room</th>
                            <th className="px-6 py-3.5 font-medium">User</th>
                            <th className="px-6 py-3.5 font-medium">Day</th>
                            <th className="px-6 py-3.5 font-medium">Shift</th>
                            <th className="px-6 py-3.5 font-medium">Price</th>
                            <th className="w-14 px-6 py-3.5 font-medium" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.map((booking) => (
                            <tr
                                key={booking.id}
                                className="bg-white transition-colors hover:bg-slate-50/60"
                            >
                                <td className="w-24 px-6 py-4">
                                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                        <img
                                            src={resolveRoomImageUrl(
                                                booking.room?.imageUrl,
                                            )}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-brand">
                                    {booking.room?.name ?? `Room #${booking.roomId}`}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    <div>
                                        <p className="font-medium text-brand">
                                            {booking.user?.name ??
                                                `User #${booking.userId}`}
                                        </p>
                                        {booking.user?.email ? (
                                            <p className="text-xs text-slate-400">
                                                {booking.user.email}
                                            </p>
                                        ) : null}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                    {formatBookingDay(booking.day)}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                    {formatBookingShift(booking.shift)}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                    {booking.room
                                        ? `$${booking.room.price.toFixed(2)}`
                                        : "—"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <AdminRowActions
                                        onEdit={() => openEditModal(booking)}
                                        onDelete={() => setBookingToDelete(booking)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </AdminDataPanel>

            <BookingFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                booking={editingBooking}
                rooms={rooms}
                users={users}
                onSaved={handleBookingSaved}
            />

            <ConfirmDeleteModal
                open={Boolean(bookingToDelete)}
                onOpenChange={(open) => {
                    if (!open) setBookingToDelete(null);
                }}
                title={
                    bookingToDelete
                        ? `Delete booking #${bookingToDelete.id}?`
                        : "Delete booking?"
                }
                description="This action cannot be undone."
                onConfirm={handleDeleteBooking}
            />
        </>
    );
}
