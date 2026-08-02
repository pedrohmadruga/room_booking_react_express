import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { AppError } from "../utils/AppError.js";

const uploadDir = path.resolve("uploads", "rooms");
fs.mkdirSync(uploadDir, { recursive: true });

const allowedMimeTypes = new Set(["image/jpeg", "image/jpg", "image/png"]);

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
        const safeBase = path
            .basename(file.originalname, path.extname(file.originalname))
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .slice(0, 40);
        cb(null, `${safeBase || "room"}-${Date.now()}${ext}`);
    },
});

export const roomImageUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            cb(new AppError(400, "Only PNG and JPG images are allowed"));
            return;
        }
        cb(null, true);
    },
});
