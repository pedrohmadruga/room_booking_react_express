import { Plus, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { StatsGrid } from "@/components/admin/StatsGrid";
import StatCard from "@/components/admin/StatCard";
import { useEffect, useState } from "react";
import type { Room } from "@/types/room";
import { deleteRoom, getRooms } from "@/services/rooms";
import AdminDataPanel from "@/components/admin/AdminDataPanel";
import { resolveRoomImageUrl } from "@/lib/roomImage";
import AdminRowActions from "@/components/admin/AdminRowActions";
import RoomFormModal from "@/components/admin/RoomFormModal";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

export default function RoomsDashboardPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

    useEffect(() => {
        getRooms()
            .then((data) => {
                setRooms(data.rooms);
            })
            .finally(() => setLoading(false));
    }, []);

    const totalRooms = rooms.length;
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);

    function openCreateModal() {
        setEditingRoom(null);
        setFormOpen(true);
    }

    function openEditModal(room: Room) {
        setEditingRoom(room);
        setFormOpen(true);
    }

    function handleRoomSaved(savedRoom: Room) {
        setRooms((prev) => {
            const exists = prev.some((room) => room.id === savedRoom.id);
            if (exists) {
                return prev.map((room) =>
                    room.id === savedRoom.id ? savedRoom : room,
                );
            }
            return [savedRoom, ...prev];
        });
    }

    async function handleDeleteRoom() {
        if (!roomToDelete) return;
        await deleteRoom(roomToDelete.id);
        setRooms((prev) => prev.filter((room) => room.id !== roomToDelete.id));
    }

    if (loading) {
        return <p className="text-sm text-slate-500">Loading...</p>;
    }

    return (
        <>
            <AdminPageHeader
                title="Rooms Overview"
                description="Manage all rooms in your space. Add, edit or remove rooms."
                action={
                    <Button
                        type="button"
                        size="lg"
                        className="gap-2 bg-brand px-5 text-white hover:bg-brand-hover"
                        onClick={openCreateModal}
                    >
                        <Plus className="size-4" />
                        Add Room
                    </Button>
                }
            />

            <StatsGrid>
                <StatCard
                    label="Total Rooms"
                    value={totalRooms}
                    helper="All rooms in the system"
                    icon={<Building2 className="size-4" />}
                    iconClassName="bg-blue-100 text-blue-600"
                />
                <StatCard
                    label="Total Capacity"
                    value={totalCapacity}
                    helper="Total seats available"
                    icon={<Users className="size-4" />}
                    iconClassName="bg-violet-100 text-violet-600"
                />
            </StatsGrid>

            <AdminDataPanel title="All Rooms">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500">
                            <th className="w-24 px-6 py-3.5 font-medium" />
                            <th className="px-6 py-3.5 font-medium">Room Name</th>
                            <th className="px-6 py-3.5 font-medium">Capacity</th>
                            <th className="px-6 py-3.5 font-medium">Price</th>
                            <th className="px-6 py-3.5 font-medium">Description</th>
                            <th className="w-14 px-6 py-3.5 font-medium" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rooms.map((room) => (
                            <tr
                                key={room.id}
                                className="bg-white transition-colors hover:bg-slate-50/60"
                            >
                                <td className="w-24 px-6 py-4">
                                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                        <img
                                            src={resolveRoomImageUrl(room.imageUrl)}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-brand">
                                    {room.name}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                    {room.capacity} people
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                    ${room.price.toFixed(2)}
                                </td>
                                <td className="max-w-sm px-6 py-4 text-slate-500">
                                    <p className="line-clamp-2">{room.description}</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <AdminRowActions
                                        onEdit={() => openEditModal(room)}
                                        onDelete={() => setRoomToDelete(room)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </AdminDataPanel>

            <RoomFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                room={editingRoom}
                onSaved={handleRoomSaved}
            />

            <ConfirmDeleteModal
                open={Boolean(roomToDelete)}
                onOpenChange={(open) => {
                    if (!open) setRoomToDelete(null);
                }}
                title={
                    roomToDelete
                        ? `Delete ${roomToDelete.name}?`
                        : "Delete room?"
                }
                description="This action cannot be undone. Bookings linked to this room may also be affected."
                onConfirm={handleDeleteRoom}
            />
        </>
    );
}
