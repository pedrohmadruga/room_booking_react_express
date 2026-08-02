import RoomCard from "@/components/RoomCard";
import type { Room } from "@/types/room";

type PreviewRoom = Pick<Room, "id" | "name" | "description" | "imageUrl">;

const previewRooms: PreviewRoom[] = [
    {
        id: 1,
        name: "Meeting Room",
        description: "Ideal room for team meetings and aligning goals.",
        imageUrl: "/images/meeting-room.jpg",
    },
    {
        id: 2,
        name: "Study Room",
        description: "Calm environment for focused work and learning.",
        imageUrl: "/images/study-room.jpg",
    },
    {
        id: 3,
        name: "Presentation Room",
        description: "Equipped with the latest technology for your presentations and workshops.",
        imageUrl: "/images/presentation-room.jpg",
    },
    {
        id: 4,
        name: "Other",
        description: "Training, interview, and much more.",
        imageUrl: "/images/other-room.jpg",
    },
];

export default function RoomsPreview() {
    return (
        <section id="rooms" className="scroll-mt-20">
            <div className="my-10 w-full text-center text-md text-brand">
                <h2 className="!text-3xl font-bold md:!text-4xl">Find the perfect room for you</h2>
                <p className="pt-2 text-sm">Diverse types of rooms to suit your different needs</p>
            </div>

            <div className="mx-auto mt-8 grid w-full max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {previewRooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        id={room.id}
                        name={room.name}
                        description={room.description}
                        imageUrl={room.imageUrl}
                    />
                ))}
            </div>
        </section>
    );
}
