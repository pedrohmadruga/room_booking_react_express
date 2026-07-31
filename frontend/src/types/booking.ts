import type { Room } from "./room";

export type Booking = {
    id: number;
    userId: number;
    roomId: number;
    day: string;
    shift: "MORNING" | "AFTERNOON" | "EVENING";
    createdAt: string;
    room?: Room ;
  };