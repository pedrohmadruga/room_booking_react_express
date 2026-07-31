import { Router } from "express";
import homeRouter from "./home.js";
import registerRouter from "./register.js";
import loginRouter from "./login.js";
import usersRouter from "./users.js";
import roomsRouter from "./rooms.js";
import bookingsRouter from "./bookings.js";

const router = Router();

router.use(homeRouter);
router.use("/register", registerRouter);
router.use("/login", loginRouter);
router.use("/users", usersRouter);
router.use("/rooms", roomsRouter);
router.use("/bookings", bookingsRouter);

export default router;
