const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/Recipecontroller");

router.get("/weekly", recipeController.getWeeklyRecipes);
router.post("/addWeekly", recipeController.addWeeklyRecipe);
router.delete("/deleteWeekly", recipeController.deleteWeeklyRecipe);

module.exports = router;
