const Recipe = require('../models/recipe');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all recipes
// @route   GET /api/v1/recipes
// @access  Public
exports.getRecipes = asyncHandler(async (req, res, next) => {
  const recipes = await Recipe.find().select(
    'name ingredients instructions recipeImage'
  );

  res.status(200).json({
    success: true,
    count: recipes.length,
    data: recipes
  });
});

// @desc    Get single recipe
// @route   GET /api/v1/recipes/:recipeId
// @access  Public
exports.getRecipe = asyncHandler(async (req, res, next) => {
  const id = req.params.recipeId;
  const recipe = await Recipe.findById(id).select(
    'name ingredients instructions recipeImage'
  );
  if (!recipe) {
    return next(new ErrorResponse(`Recipe not found with id of ${id}`, 404));
  }
  res.status(200).json({ success: true, data: recipe });
});

// @desc    Create recipe
// @route   POST /api/v1/recipes
// @access  Private
exports.createRecipe = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  const createdRecipe = await Recipe.create(req.body);

  res.status(201).json({
    success: true,
    data: createdRecipe
  });
});

// @desc    Update recipe
// @route   PUT /api/v1/recipes/:recipeId
// @access  Private
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  const id = req.params.recipeId;
  let recipe = await Recipe.findById(id);

  if (!recipe) {
    return next(
      new ErrorResponse(
        `Recipe not found with id of ${req.params.recipeId}`,
        404
      )
    );
  }

  // Make sure user is recipe owner
  if (recipe.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this recipe.`,
        401
      )
    );
  }

  recipe = await Recipe.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });
  res.status(200).json({ success: true, data: recipe });
});

// @desc    Delete recipe
// @route   DELETE /api/v1/recipes/:recipeId
// @access  Private
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.recipeId);

  console.log('recipe', recipe);

  if (!recipe) {
    return next(
      new ErrorResponse(
        `Recipe not found with id of ${req.params.recipeId}`,
        404
      )
    );
  }

  // Make sure user is recipe owner
  if (recipe.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this recipe.`,
        401
      )
    );
  }
  recipe.remove();
  res.status(200).json({ sucess: true, data: {} });
});

// @desc    Upload photo for recipe
// @route   PUT /api/v1/recipes/:recipeId/photo
// @access  Private
exports.recipePhotoUpload = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.recipeId);

  if (!recipe) {
    return next(
      new ErrorResponse(
        `Recipe not found with id of ${req.params.recipeId}`,
        404
      )
    );
  }

  // Make sure user is recipe owner
  if (recipe.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to upload photo for this recipe.`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;
  console.log('file', file);

  // Make sure that the image is a photo
  if (!file.mimetype.startsWith('image/')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${recipe._id}${path.parse(file.name).ext}`;
  console.log('file.name', file.name);
  console.log('env', process.env.FILE_UPLOAD_PATH);

  // Actually upload the file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Recipe.findByIdAndUpdate(req.params.recipeId, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
