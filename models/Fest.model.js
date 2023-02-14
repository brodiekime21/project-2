const { Schema, model } = require('mongoose');

const festSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Festival name is required.']
    },
    review: String,
    rating: {
    type:  Number,
    min: [0, "must be greater than 0"], 
    max: [100, "must be less than 100"]
    },
    imageUrl: String,
    favSet: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
  });

module.exports = model('Fest', festSchema);