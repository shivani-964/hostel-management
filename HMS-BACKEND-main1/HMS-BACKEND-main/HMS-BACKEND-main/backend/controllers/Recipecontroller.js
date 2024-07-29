const Recipe = require("../models/recipeModel");

const getWeeklyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    const formattedRecipes = {};

    recipes.forEach((recipe) => {
      if (!formattedRecipes[recipe.day]) {
        formattedRecipes[recipe.day] = {};
      }
      formattedRecipes[recipe.day][recipe.mealTime] = {
        name: recipe.name,
        ingredients: recipe.ingredients,
      };
    });

    res.status(200).json({ success: true, recipes: [formattedRecipes] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addWeeklyRecipe = async (req, res) => {
  const { day, mealTime, name, ingredients } = req.body;

  try {
    const newRecipe = new Recipe({ day, mealTime, name, ingredients });
    await newRecipe.save();
    res
      .status(201)
      .json({ success: true, message: "Recipe added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteWeeklyRecipe = async (req, res) => {
  const { day, mealTime } = req.body;

  try {
    await Recipe.findOneAndDelete({ day, mealTime });
    res
      .status(200)
      .json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWeeklyRecipes,
  addWeeklyRecipe,
  deleteWeeklyRecipe,
};
