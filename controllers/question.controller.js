const QuestionModel = require('../models/question.model');
const AnswerModel = require('../models/answer.model');
const errorObject = require('../ultils/error');

const questionController = {

    create_question: async (req, res) => {

        const newQuestion = new QuestionModel();
        newQuestion.user_id = req.body.user_id;
        newQuestion.question_content = req.body.question_content;
        newQuestion.hashtags = req.body.hashtags;

        try {
            const question = await newQuestion.save();
            errorObject.message = "Save question success";
            errorObject.messageCode = 200;
            errorObject.data = question;
            return res.send(errorObject);
        } catch (error) {
            errorObject.message = error.message;
            errorObject.messageCode = 400;
            errorObject.data = null;
            return res.send(errorObject);
        }

    },

    update_question: async (req, res) => {

        const question = await QuestionModel.findOne({ _id: req.params.id });

        if (question.user_id != req.body.user_id) {
            errorObject.message = "You cannot update this question";
            errorObject.messageCode = 400;
            errorObject.data = null;
            return res.send(errorObject);
        }
        try {
            const updatedQuestion = await QuestionModel.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set:
                    {
                        question_content: req.body.question_content
                    }
                }
            )
            errorObject.message = "Update successful";
            errorObject.messageCode = 200;
            errorObject.data = null;
            return res.send(errorObject);
        } catch (error) {
            errorObject.message = error.message;
            errorObject.messageCode = 400;
            errorObject.data = null;
            return res.send(errorObject);
        }
    },

    delete_question: async (req, res) => {

        const question = await QuestionModel.findOne({ _id: req.params.id });

        if (question.user_id != req.body.user_id) {
            errorObject.message = "You can not delete this question";
            errorObject.messageCode = 400;
            errorObject.data = null;
            return res.send(errorObject);
        }

        try {
            await question.remove();
            errorObject.message = "Delete question successful";
            errorObject.messageCode = 200;
            errorObject.data = null;
            return res.send(errorObject);
        } catch (error) {
            errorObject.message = error.message;
            errorObject.messageCode = 400;
            errorObject.data = null;
            return res.send(errorObject);
        }
    },

    get_question: async (req, res) => {
        
        // let answer = await AnswerModel.findOne({_id: req.params.id});

        await QuestionModel.findOne({ _id: req.params.id })
            .populate('user_id')
            .exec((err, question) => {
                if (err) {
                    errorObject.message = err.message;
                    errorObject.messageCode = 400;
                    errorObject.data = null;
                    return res.send(errorObject);
                } else {
                    errorObject.message = "Get Detail Question Successful";
                    errorObject.messageCode = 200;
                    // question.answer = answer;
                    errorObject.data = question;
                    return res.send(errorObject);
                }
            })
    },

    get_all_question: async (req, res) => {

        await QuestionModel.find({ deleted: false })
            .sort({ 'createdAt': -1 })
            .populate('user_id')
            .exec((err, question) => {
                if (err) {
                    errorObject.message = err.message;
                    errorObject.messageCode = 400;
                    errorObject.data = null;
                    return res.send(errorObject);
                } else {
                    errorObject.message = "Get All Question Successful";
                    errorObject.messageCode = 200;
                    errorObject.data = question;
                    return res.send(errorObject);
                }
            })

    }

}

module.exports = questionController;