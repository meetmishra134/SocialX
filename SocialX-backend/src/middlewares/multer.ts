import multer from "multer";
import path from "path";

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), "public/images"));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

export const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only email files are allowed"));
    }
    cb(null, true);
  },
});
