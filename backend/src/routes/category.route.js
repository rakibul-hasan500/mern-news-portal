const express = require("express");
const verifyLogin = require("../middlewares/verify_login.middleware");
const {
  addCategory,
  updateCategory,
  getAllCategories,
  deleteCategory,
  getSingleCategory,
} = require("../controllers/category.controller");
const getCurrentUser = require("../middlewares/current_user.middleware");
const router = express.Router();


// Add Category
router.post("/create", verifyLogin, addCategory);


// Update Category
router.patch("/update", verifyLogin, updateCategory);


// Update Category
router.delete("/delete/:id", verifyLogin, deleteCategory);


// Get All Categories
router.get("/all", getCurrentUser, getAllCategories);


// Get Single Categoy
router.get('/:slug', getSingleCategory)








module.exports = router;
