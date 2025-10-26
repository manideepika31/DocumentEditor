import mongoose from 'mongoose';

export async function connectToDatabase(): Promise<void> {
	const uri = process.env.MONGODB_URI ?? 'mongodb+srv://saipranavpedaprolu_db_user:q1Ufwae6fCs706Zq@cluster0.nt8n8gf.mongodb.net/';
	if (!uri) {
		throw new Error('MONGODB_URI is not set');
	}
	mongoose.set('strictQuery', true);
	await mongoose.connect(uri, { dbName: 'collab_docs' });
	console.log('connected to MongoDB');
}


