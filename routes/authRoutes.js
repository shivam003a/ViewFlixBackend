const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

const {registerController, loginController, logout} = require('../controllers/authController');

router.post('/signup', registerController);
router.post('/signin', loginController);
router.get('/logout', auth, logout)

module.exports = router;