import mongoose, { Schema } from 'mongoose';
import type { InferSchemaType } from 'mongoose';

const DocumentSchema = new Schema(
	{
		key: { type: String, required: true, index: true, unique: true },
		content: { type: Object, required: true },
		updatedAt: { type: Date, default: Date.now }
	},
	{ timestamps: true }
);

export type DocumentModel = InferSchemaType<typeof DocumentSchema>;

export const Document =
	(mongoose.models.Document as mongoose.Model<DocumentModel>) ||
	mongoose.model<DocumentModel>('Document', DocumentSchema);


