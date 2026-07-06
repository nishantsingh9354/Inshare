import File from '../models/file.js';

// Valid expiry durations in minutes
const VALID_EXPIRY = {
    '5m': 5,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '6h': 360,
    '24h': 1440,
};

export const uploadImage = async (request, response) => {
    if (!request.file) {
        return response.status(400).json({ error: "No file uploaded. Please attach a file." });
    }

    // Get expiry from request body, default to 24h
    const expiryKey = request.body.expiry || '24h';
    const expiryMinutes = VALID_EXPIRY[expiryKey] || 1440;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    try {
        const file = await File.create({
            name: request.file.originalname,
            data: request.file.buffer,
            contentType: request.file.mimetype,
            size: request.file.size,
            expiresAt,
        });

        const protocol = request.headers['x-forwarded-proto'] || request.protocol || 'http';
        const host = request.headers.host;
        const baseUrl = `${protocol}://${host}`;

        response.status(200).json({
            path: `${baseUrl}/file/${file._id}`,
            expiresAt: expiresAt.toISOString(),
        });
    } catch (error) {
        console.error("Upload Error:", error.message);
        response.status(500).json({ error: "Upload failed." });
    }
};

export const getImage = async (request, response) => {
    try {
        const file = await File.findById(request.params.fileId);

        if (!file) {
            return response.status(404).json({ error: "File not found or link has expired." });
        }

        // Check if expired (in case TTL hasn't cleaned up yet)
        if (file.expiresAt < new Date()) {
            return response.status(410).json({ error: "This link has expired." });
        }

        file.downloadCount++;
        await file.save();

        response.set({
            'Content-Type': file.contentType,
            'Content-Disposition': `attachment; filename="${file.name}"`,
            'Content-Length': file.size,
        });
        response.send(file.data);
    } catch (error) {
        console.error("Download Error:", error.message);
        response.status(500).json({ error: "Download failed." });
    }
};