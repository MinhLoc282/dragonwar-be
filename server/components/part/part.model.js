import mongoose from 'mongoose';
import { PART_TYPE } from '../../constants';

const Schema = mongoose.Schema;

const Parts = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: [
        {
            name: { type: String },
            image: { type: String }
        }
    ],
    type: { type: String, enum: Object.values(PART_TYPE) },
}, {
    timestamps: true
});

export default mongoose.model('parts', Parts);
