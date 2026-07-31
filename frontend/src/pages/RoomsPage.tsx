import PageLayout from "@/layout/PageLayout";
import RoomsList from "@/sections/rooms/RoomsList";
import { getRooms } from "@/services/rooms";
import { useEffect, useState } from "react";
import type { Room } from "@/types/room";

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);

    async function fetchRooms() {
        const data = await getRooms();
        setRooms(data.rooms);
    }

    useEffect(() => {
        fetchRooms();
    }, []);

    return (
        <PageLayout
            variant="app"
            mainClassName="mx-auto w-full max-w-7xl px-4 py-10 text-brand"
        >
            <h2 className="text-2xl font-semibold">Rooms available</h2>
            <p className="mt-2 text-sm">
                Explore our places and book the ideal room for your needs.
            </p>

            <RoomsList rooms={rooms} />
        </PageLayout>
    );
}
