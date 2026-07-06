import multer from 'multer';

// Use memory storage so files are kept as Buffers — works on Vercel (no disk writes)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export default upload;