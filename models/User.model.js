// models/User.model.js
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    profileImageUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dc6w7a0c8/image/upload/v1676491556/movie-project/profile-pic_ynoyug.png",
    },
    bio: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
