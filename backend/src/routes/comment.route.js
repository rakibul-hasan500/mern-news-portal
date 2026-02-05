const express = require('express')
const { postComment, getCommentsByPostId, postCommentReplay, getCommentReplies, reactOnComment, getAllComments, updateComment, deleteComment, updateCommentStatus } = require('../controllers/comment.controller')
const verifyLogin = require('../middlewares/verify_login.middleware')
const router = express.Router()


// Post Comment
router.post('/post', verifyLogin, postComment)


// Post Comment
router.post('/replay/post', verifyLogin, postCommentReplay)


// Get Comment Replies
router.get('/replies', getCommentReplies)


// React On Comment
router.post('/react', verifyLogin, reactOnComment)


// Update Comment
router.put('/update', verifyLogin, updateComment)


// Delete Comment
router.delete('/delete/:commentId', verifyLogin, deleteComment)


// Update Status
router.put('/status/update', verifyLogin, updateCommentStatus)


// Get Comments - Admin
router.get('/all', verifyLogin, getAllComments)


// Get Comments By Post Id
router.get('/:postId', getCommentsByPostId)






module.exports = router