const express = require("express");
const router = express.Router();
const uploadPhotoAndVideo = require("../middlewares/uploadRecipes");
const uploadVideo = require("../middlewares/uploadVideo");
const recipesController = require("../controller/recipesController");

router
.post("/", uploadPhotoAndVideo, recipesController.insertRecipes)
  .get("/", recipesController.getAllRecipes)
  .get("/:id", recipesController.getRecipesById)
  .get("/users/:users_id", recipesController.getRecipesByUserId)
  .put("/:id", uploadPhotoAndVideo, recipesController.updateRecipes)
  .delete("/:id", recipesController.deleteRecipe)



module.exports = router;
  