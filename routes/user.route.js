const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { isAuth } = require('../middlewares/isAuth');
//đăng kí tài khoản 
router.post('/register', userController.upload, userController.register);

//đăng nhập
router.post('/login', userController.login);

//getcurrentuser 
router.get('/getcurrentuser', isAuth, userController.getCurrentUser);

//getuserbyID
router.get('/:id', userController.getUserByID);

module.exports = router;