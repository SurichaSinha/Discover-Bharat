const mongoose = require('mongoose');
const { Schema } = mongoose;

const StateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    capital: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
    },
    culture: [
      {
        type: String,
      },
    ],
    food: [
      {
        type: String,
      },
    ],
    crafts: [
      {
        type: String,
      },
    ],
    cities: [
      {
        type: String,
      },
    ],
    sustainability: [
      {
        type: String,
      },
    ],
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('State', StateSchema);
