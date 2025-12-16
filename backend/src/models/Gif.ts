import mongoose, { Schema, Document } from 'mongoose';

export interface IGif extends Document {
    title: string;
    url: string;
    width: number;
    height: number;
    featured: boolean;
    tags: string[];
    createdAt: Date;
    originalId?: string;
}

const GifSchema: Schema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    isAdult: { type: Boolean, default: false },
    originalId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGif>('Gif', GifSchema);
