import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    // !!!new one
    avatar: {
      type: String,
      required: false,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
  },
  {
    timestamps: true,
  },
);

//! хук pre('save'), за замовчуванням встановлює username таким самим,
//! як email, при створенні користувача
userSchema.pre('save', function () {
  if (!this.username) {
    this.username = this.email;
  }
});

//! видалення пароль з відповіді (toJSON)
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('user', userSchema);
