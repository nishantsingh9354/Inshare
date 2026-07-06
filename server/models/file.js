import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,
        default: 'application/octet-stream'
    },
    size: {
        type: Number,
        required: true
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // MongoDB TTL index — auto-deletes when this date passes
    },
}, { timestamps: true });

const File = mongoose.model('file', FileSchema);

export default File;