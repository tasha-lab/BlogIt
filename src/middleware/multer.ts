import multer from "multer";
import path from "path";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/avif",
];

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  console.log("Received file:", file.originalname);
  console.log("Detected mimetype:", file.mimetype);

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1000) + ext;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

export default upload;
