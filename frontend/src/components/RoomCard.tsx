import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FALLBACK_ROOM_IMAGE, resolveRoomImageUrl } from "@/lib/roomImage";
import { Link } from "react-router-dom";

type RoomCardProps = Readonly<{
    id?: number;
    name: string;
    description: string | null;
    capacity?: number;
    imageUrl: string | null;
    className?: string;
    showBookButton?: boolean;
    showCapacity?: boolean;
}>;

export default function RoomCard(props: RoomCardProps) {
    const {
        id,
        name,
        description,
        capacity,
        imageUrl,
        className,
        showBookButton = false,
        showCapacity = false,
    } = props;
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
                {showCapacity && capacity != null ? (
                    <CardDescription className="mb-2 text-xs font-light text-gray-500">
                        Up to {capacity} people
                    </CardDescription>
                ) : null}
                <CardDescription className="text-sm font-light text-brand/80">
                    {description}
                </CardDescription>
            </CardHeader>
            {showBookButton && id != null ? (
                <CardFooter className="mt-auto border-0 bg-transparent">
                    <Button className="w-full cursor-pointer items-right bg-brand text-sm text-white hover:bg-brand/90">
                        <Link to={`/rooms/${id}`}>View and Book</Link>
                    </Button>
                </CardFooter>
            ) : null}
        </Card>
    );
}
