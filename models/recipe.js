const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: Number,
  unit: {
    type: String
  }
});

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 100
  },
  ingredients: {
    type: [ingredientSchema]
  },
  instructions: String,
  duration: Number, // this will be sent in minutes from FE
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  public: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
