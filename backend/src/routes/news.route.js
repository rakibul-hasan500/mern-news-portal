const express = require("express");
const verifyLogin = require("../middlewares/verify_login.middleware");
const {addNews, getAllNews, deleteNews, updateNewsSTatus, getNewsImages, uploadNewsImages, deleteNewsImage, getNewsDetails, updateNews, getSingleNewsDetails, reactOnNews} = require("../controllers/news.controller");
const getCurrentUser = require("../middlewares/current_user.middleware");
const router = express.Router();


// Add News
router.post("/create", verifyLogin, addNews);


// Get News
router.get("/all", getCurrentUser, getAllNews);


// Delete News
router.delete("/delete/:id", verifyLogin, deleteNews);


// Get News Details
router.get('/details/:slug', verifyLogin, getNewsDetails)


// Update News
router.put('/update', verifyLogin, updateNews)


// Update News Status
router.patch('/update/status/:id', verifyLogin, updateNewsSTatus)


// Get News Images
router.get('/images', verifyLogin, getNewsImages)


// Upload News Images
router.post('/images/upload', verifyLogin, uploadNewsImages)


// Delete News Image
router.delete('/image/delete/:id', verifyLogin, deleteNewsImage)


// React On News
router.post('/react', verifyLogin, reactOnNews)


// Get Single News Details
router.get('/:slug', getSingleNewsDetails)


module.exports = router;
