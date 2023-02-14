// models/User.model.js
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    profileImageUrl: String,
    bio: String,
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema)