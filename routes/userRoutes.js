const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

const {updateUsers, deleteUser, getUser, subscribeUser, unsubscribeUser, likeVideo, dislikeVideo, getMe} = require('../controllers/userController');

router.put('/:id', auth, updateUsers)
router.delete('/:id', auth, deleteUser)
router.get('/find/:id', getUser)
router.get('/me', auth, getMe)
router.put('/sub/:id', auth, subscribeUser)
router.put('/unsub/:id', auth, unsubscribeUser)
router.put('/like/:videoId', auth, likeVideo)
router.put('/unlike/:videoId', auth, dislikeVideo)

module.exports = router;