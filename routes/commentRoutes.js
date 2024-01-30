const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const { addComment, deleteComment, getAllComments } = require('../controllers/commentController')

router.post('/', auth, addComment)
router.delete('/:commentId', auth, deleteComment)
router.get('/find/:videoId', getAllComments)

module.exports = router

