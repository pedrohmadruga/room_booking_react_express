import { Router } from "express";
import { bookingController } from "../controllers/bookingController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", bookingController.list);
router.get("/:id", bookingController.getById);
router.post("/", bookingController.create);
router.put("/:id", bookingController.update);
router.delete("/:id", bookingController.remove);

export default router;
