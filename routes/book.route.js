const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { isAuth } = require('../middlewares/isAuth');

// đăng tải 1 quyển sách
router.post('/upload', isAuth, bookController.upload, bookController.uploadBook);

// cập nhật thông tin 1 quyển sách
router.put('/:id', isAuth, bookController.upload, bookController.updateBook);

// xoá 1 quyển sách
router.delete('/:id', isAuth, bookController.deleteBook);

// lấy sách đã cho mượn của user
router.get('/lendedbook/:id', isAuth, bookController.getLendedBook);

// lấy sách theo filter
router.get('/', bookController.getBook);

// lấy theo user genres
router.get('/usergenres/:id', bookController.getBookByUserGenre);

// lấy theo genres
router.get('/allbook', bookController.getBookByGenre);

// lấy detail books
router.get('/detail/:id', bookController.getDetailBook);

module.exports = router;