import multer from "multer";

// memory storage (file RAM me store hoga temporarily, phir Cloudinary pe jayega)
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
