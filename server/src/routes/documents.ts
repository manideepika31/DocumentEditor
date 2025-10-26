import { Router } from 'express';
import { Document } from '../models/Document.js';

const router = Router();

// GET /api/documents/:key
router.get('/:key', async (req, res) => {
	const key = req.params.key;
	const doc = await Document.findOne({ key });
	if (!doc) return res.status(404).json({ error: 'Not found' });
	return res.json(doc);
});

// PUT /api/documents/:key
router.put('/:key', async (req, res) => {
	const key = req.params.key;
	const content = req.body?.content ?? {};
	const doc = await Document.findOneAndUpdate(
		{ key },
		{ $set: { content, updatedAt: new Date() } },
		{ upsert: true, new: true }
	);
	return res.json(doc);
});

export default router;


