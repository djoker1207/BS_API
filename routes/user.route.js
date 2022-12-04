const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

//đăng kí tài khoản 
router.post('/register', userController.upload, userController.register);

//đăng nhập
router.post('/login', userController.login);

module.exports = router;