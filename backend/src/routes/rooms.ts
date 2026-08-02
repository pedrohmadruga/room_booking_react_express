import { Router } from "express";
import { roomController } from "../controllers/roomController.js";
import { authenticate, requireAdmin } from "../middlewares/auth.js";
import { roomImageUpload } from "../middlewares/upload.js";

const router = Router();

router.use(authenticate);

router.get("/", roomController.list);
router.get("/:id/availability", roomController.checkAvailability);
router.get("/:id", roomController.getById);
router.post(
    "/",
    requireAdmin,
    roomImageUpload.single("image"),
    roomController.create,
);
router.put(
    "/:id",
    requireAdmin,
    roomImageUpload.single("image"),
    roomController.update,
);
router.delete("/:id", requireAdmin, roomController.remove);

export default router;
