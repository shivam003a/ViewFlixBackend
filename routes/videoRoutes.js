const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const { addVideo, updateVideo, deleteVideo, getVideo, getRandom, addView, subVideos, getByTag, getByTitle } = require('../controllers/videoController')

router.post('/', auth, addVideo)
router.put('/:videoId', auth, updateVideo)
router.delete('/:videoId', auth, deleteVideo)
router.get('/find/:videoId', getVideo)
router.get('/random', getRandom)
router.put('/views/:videoId', addView)
router.get('/subvids', auth, subVideos)
router.get('/tag', getByTag)
router.get('/search', getByTitle)

module.exports = router