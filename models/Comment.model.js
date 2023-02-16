const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, maxlength: 200 },
    festId: {type: Schema.Types.ObjectId, ref: "Fest"}
  });

module.exports = model('Comment', commentSchema);