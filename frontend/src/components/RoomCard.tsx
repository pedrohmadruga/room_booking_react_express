import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FALLBACK_ROOM_IMAGE, resolveRoomImageUrl } from "@/lib/roomImage";
import type { Room } from "@/types/room";
import { Link } from "react-router-dom";

type RoomCardProps = Pick<Room, "id" | "name" | "description" | "capacity" | "imageUrl"> & {
    className?: string;
    showBookButton?: boolean;
    showCapacity?: boolean;
};

export default function RoomCard({ id, name, description, capacity, imageUrl, className, showBookButton = false, showCapacity = false }: RoomCardProps) {
    const imageSrc = resolveRoomImageUrl(imageUrl);

    return (
        <Card
            className={cn(
                "flex h-full flex-col overflow-hidden bg-surface-soft bg-white text-brand shadow-lg transition-all duration-300 hover:scale-105",
                className,
            )}
        >
            <img
                src={imageSrc}
                alt={name}
                className="aspect-video w-full object-cover"
                onError={(e) => {
                    e.currentTarget.src = FALLBACK_ROOM_IMAGE;
                }}
            />
            <CardHeader className="flex-1">
                <CardTitle className="font-semibold">{name}</CardTitle>
                {showCapacity && (
                    <CardDescription className="text-gray-500 font-light text-xs mb-2">Up to {capacity} people</CardDescription>
                )}
                <CardDescription className="text-brand/80 font-light text-sm">{description}</CardDescription>
            </CardHeader>
            {showBookButton && (
                <CardFooter className="mt-auto border-0 bg-transparent">
                    <Button className="text-sm w-full items-right bg-brand text-white hover:bg-brand/90 cursor-pointer"><Link to={`/rooms/${id}`}>View and Book</Link></Button>
                </CardFooter>
            )}
        </Card>
    );
}
