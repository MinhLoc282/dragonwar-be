import mongoose from 'mongoose';
import {EXPORT_TYPES, GIFT_STATUS, GIFT_TYPES, UPLOADS_DESTINATION} from '../../constants';
import {UPLOAD_GET_HOST} from "../../config";

const ExportSchema = new mongoose.Schema({
  file: { type: String, required: true },
  type: { type: String, enum: Object.values(EXPORT_TYPES), required: true },
}, {
  timestamps: true,
});


ExportSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
  }
});

ExportSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    if (ret.file) {
      ret.file = `${UPLOAD_GET_HOST}/${ret.file}`;
    }
    delete ret.__v;
    delete ret.updatedAt;
  }
});

export default mongoose.model('Export', ExportSchema);
