const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  getRecipe,
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  recipePhotoUpload
} = require('../controllers/recipes');

router
  .route('/')
  .get(getRecipes)
  .post(protect, createRecipe);

router
  .route('/:recipeId')
  .get(getRecipe)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

router.route('/:recipeId/photo').put(protect, recipePhotoUpload);

module.exports = router;
