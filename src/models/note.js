import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: false,
      default: '',
    },
    tag: {
      type: String,
      default: 'Todo',
      enum: TAGS,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

//! текстові індекси не обʼєднувати в один рядок (!окремо!)
noteSchema.index({ title: 'text', content: 'text' });
//!додаємо userId
noteSchema.index({ userId: 1, tag: 1 });

export const Note = model('Note', noteSchema);
