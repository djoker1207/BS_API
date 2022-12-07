const express = require('express');

const router = express.Router();

const answerController = require('../controllers/answer.controller');

const { isAuth } = require('../middlewares/isAuth');

//tạo 1 câu trả lời
router.post('/create', isAuth, answerController.create_answer);

//lấy tất cả các answer của một câu hỏi
router.get('/:question_id', answerController.get_answers);

//xóa 1 câu trả lời
router.delete('/:id', isAuth, answerController.delete_answer);

module.exports = router;