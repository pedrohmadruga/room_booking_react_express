import RoomCard from "@/components/RoomCard";
import type { Room } from "@/types/room";

export default function RoomsList({ rooms }: Readonly<{ rooms: Room[] }>) {
    return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {rooms.map((room) => (
                <RoomCard key={room.id} id={room.id} name={room.name} description={room.description} capacity={room.capacity} imageUrl={room.imageUrl} showBookButton={true} showCapacity={true} />
            ))}
        </div>
    )
}