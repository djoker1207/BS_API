const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

// đăng tải 1 quyển sách
router.post('/upload', bookController.upload, bookController.uploadBook);

// cập nhật thông tin 1 quyển sách
router.put('/:id', bookController.upload, bookController.updateBook);

// xoá 1 quyển sách
router.delete('/:id', bookController.deleteBook);

// lấy sách đã cho mượn của user
router.get('/lendedbook', bookController.getLendedBook);

// lấy sách theo filter
router.get('/', bookController.getBook);

module.exports = router;