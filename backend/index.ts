import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {    

    // Delete all bookings
    await prisma.booking.deleteMany();
    
    // Delete all rooms before creating new ones
    await prisma.room.deleteMany();

    // Create rooms
    const rooms = await prisma.room.createMany({
        data: [
            {name: "Meeting Room", description: "Ideal for team meetings, planning sessions and collaborative discussions.", capacity: 20, price: 100, imageUrl: "/uploads/rooms/meeting-room.jpg"},
            {name: "Conference Room", description: "Spacious room designed for large meetings, presentations and corporate gatherings.", capacity: 50, price: 200, imageUrl: "/uploads/rooms/conference-room.jpg"},
            {name: "Training Room", description: "Equipped for workshops, training sessions and professional development activities.", capacity: 30, price: 150, imageUrl: "/uploads/rooms/training-room.jpg"},
            {name: "Auditorium", description: "Large venue suitable for conferences, lectures and keynote presentations.", capacity: 100, price: 300, imageUrl: "/uploads/rooms/auditorium-room.jpg"},
            {name: "Classroom", description: "Comfortable learning environment for classes, courses and educational sessions.", capacity: 50, price: 150, imageUrl: "/uploads/rooms/classroom-room.jpg"},
            {name: "Library", description: "Quiet and focused space for reading, research and individual study.", capacity: 100, price: 200, imageUrl: "/uploads/rooms/library-room.jpg"},
            {name: "Office", description: "Private workspace designed for productivity, meetings and focused work.", capacity: 50, price: 100, imageUrl: "/uploads/rooms/office-room.jpg"},
            {name: "Lounge", description: "Relaxed environment for informal meetings, networking and breaks.", capacity: 50, price: 100, imageUrl: "/uploads/rooms/lounge-room.jpg"},
            {name: "Board Room", description: "Executive meeting space for strategic discussions and important decisions.", capacity: 10, price: 100, imageUrl: "/uploads/rooms/board-room.jpg"},
            {name: "Break Room", description: "Comfortable area for relaxation, refreshments and casual conversations.", capacity: 50, price: 100, imageUrl: "/uploads/rooms/break-room.jpg"},
            {name: "Workshop", description: "Flexible space designed for hands-on activities, training and collaboration.", capacity: 25, price: 120, imageUrl: "/uploads/rooms/workshop-room.jpg"},
            {name: "Studio", description: "Creative environment for recording, content creation and production work.", capacity: 15, price: 180, imageUrl: "/uploads/rooms/studio-room.jpg"},
            {name: "Lab", description: "Specialized workspace equipped for testing, research and technical projects.", capacity: 20, price: 220, imageUrl: "/uploads/rooms/lab-room.jpg"},
            {name: "Coworking Space", description: "Open and collaborative workspace for professionals, freelancers and teams.", capacity: 40, price: 90, imageUrl: "/uploads/rooms/coworking-room.jpg"},
            {name: "Focus Pod", description: "Private and distraction-free space for deep work and concentration.", capacity: 2, price: 40, imageUrl: "/uploads/rooms/focus-pod-room.jpg"},
            {name: "Interview Room", description: "Professional setting for interviews, assessments and private conversations.", capacity: 4, price: 60, imageUrl: "/uploads/rooms/interview-room.jpg"},
            {name: "Event Hall", description: "Versatile venue for events, seminars, celebrations and large gatherings.", capacity: 150, price: 450, imageUrl: "/uploads/rooms/event-hall-room.jpg"},
            {name: "Media Room", description: "Dedicated space for presentations, media viewing and audiovisual projects.", capacity: 35, price: 160, imageUrl: "/uploads/rooms/media-room.jpg"},
            {name: "Game Room", description: "Fun and engaging area for gaming, recreation and team-building activities.", capacity: 30, price: 110, imageUrl: "/uploads/rooms/game-room.jpg"},
            {name: "VIP Suite", description: "Premium private space offering comfort, privacy and exclusive amenities.", capacity: 8, price: 250, imageUrl: "/uploads/rooms/vip-suite-room.jpg"},
        ]
    })
    console.log(`Created ${rooms.count} rooms`);
    
}

main()
.then(async () => {
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
