import express from 'express';
import Gif from '../models/Gif';

const router = express.Router();

// GET /gifs - Fetch all gifs
router.get('/', async (req, res) => {
    try {
        const { includeAdult } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 30;
        const skip = (page - 1) * limit;

        let query = {};

        // If includeAdult is NOT 'true', only show non-adult content
        if (includeAdult !== 'true') {
            query = { isAdult: { $ne: true } };
        }

        const gifs = await Gif.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json(gifs);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

import multer from 'multer';
import { uploadFile } from '../config/storage';

const upload = multer({ storage: multer.memoryStorage() });

// POST /gifs - Add a new gif
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { title, width, height, isAdult, originalId } = req.body;
        let { url, tags } = req.body;

        // Handle file upload
        if (req.file) {
            url = await uploadFile(req.file);
        }

        if (!title || !url || !width || !height) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Ensure tags is an array (form-data might send it as string)
        if (typeof tags === 'string') {
            tags = tags.split(',').map(t => t.trim()).filter(Boolean);
        }

        const newGif = new Gif({
            title,
            url,
            width: parseInt(width), // Ensure number
            height: parseInt(height), // Ensure number
            tags: tags || [],
            featured: false,
            isAdult: isAdult === 'true' || isAdult === true,
            originalId: originalId || null
        });

        const savedGif = await newGif.save();
        res.status(201).json(savedGif);
    } catch (err) {
        console.error("Error creating gif:", err);
        res.status(500).json({ message: 'Error creating gif' });
    }
});

export default router;
