const express = require("express");
const {
  login,
  getUserData,
  logOutUser,
  verifyOtp,
  resendOtp,
  addUser,
  allUsers,
  deleteUser,
  updateUser,
  changePassword,
  changeProfileImage,
  signup,
  forgotPassword,
  resetPassword,
  updateProfile,
} = require("../controllers/user.controller");
const verifyLogin = require("../middlewares/verify_login.middleware");
const router = express.Router();


// Login
router.post('/login', login);


// Login
router.post('/signup', signup);


// Verify
router.post('/otp/verify', verifyOtp);


// Resend OTP
router.post('/otp/resend', resendOtp);


// Logout User
router.post('/logout', verifyLogin, logOutUser);


// Forgot Password
router.post('/forgot-password', forgotPassword)


// Forgot Password
router.post('/reset-password', resetPassword)




// Get User
router.get('/me', verifyLogin, getUserData);

// Change Password
router.patch('/me/change/password', verifyLogin, changePassword);

// Change Profile Image
router.patch('/me/change/profile', verifyLogin, changeProfileImage)

// Update Profile
router.put('/me/profile/update', verifyLogin, updateProfile)





// Add User
router.post('/user/add', verifyLogin, addUser);

// Update User
router.patch('/user/update', verifyLogin, updateUser);

// Get All Users
router.get('/users', verifyLogin, allUsers);

// Delete User
router.delete('/user/delete/:id', verifyLogin, deleteUser);



module.exports = router;
