const { Schema, model } = require('mongoose');

const festSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Festival name is required.']
    },
    review: String,
    rating: {
    type:  Number,
    min: [0, "Rating must be between 0 and 100"], 
    max: [100, "Rating must be between 0 and 100"]
    },
    imageUrl: String,
    favSet: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
  });

module.exports = model('Fest', festSchema);