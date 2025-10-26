import mongoose, { Schema } from 'mongoose';

const YDocStateSchema = new Schema(
	{
		roomId: { type: String, required: true, unique: true, index: true },
		state: { type: Buffer, required: true },
		updatedAt: { type: Date, default: Date.now }
	},
	{ timestamps: true }
);

export type YDocStateModel = {
	roomId: string;
	state: Buffer;
	updatedAt: Date;
};

export const YDocState =
	(mongoose.models.YDocState as mongoose.Model<YDocStateModel>) ||
	mongoose.model<YDocStateModel>('YDocState', YDocStateSchema);


