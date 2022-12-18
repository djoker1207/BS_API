const AnswerModel = require('../models/answer.model');
const errorObject = require('../ultils/error');
const answerController = {

    create_answer: async (req, res) => {

        const newAnswer = new AnswerModel();
        newAnswer.question_id = req.body.question_id;
        newAnswer.user_id = req.body.user_id;
        newAnswer.answer_content = req.body.answer_content;

        try {
            const answer = await newAnswer.save();
            errorObject.message = "Create answer successfull"
            errorObject.messageCode = 200;
            errorObject.data = answer;
            return res.send(errorObject);
        } catch (error) {
            errorObject.message = error.message;
            errorObject.messageCode = 400;
            errorObject.data = null;
            return res.send(errorObject);
        }

    },

    get_answers: async (req, res) => {
        await AnswerModel.find({ question_id: req.params.question_id })
            .sort({ 'createdAt': -1 })
            .populate('user_id')
            .exec((err, answer) => {
                if (err) {
                    errorObject.message = err.message;
                    errorObject.messageCode = 400;
                    errorObject.data = null;
                    return res.send(errorObject);
                } else {
                    errorObject.message = "Get answer by ID successful";
                    errorObject.messageCode = 200;
                    errorObject.data = answer;
                    return res.send(errorObject);
                }
            })
    },

    delete_answer: async (req, res) => {

        const answer = await AnswerModel.findOne({ _id: req.params.id });

        // if (answer.user_id != req.body.user_id) {
        //     errorObject.message = "You can not delete this answer";
        //     errorObject.messageCode = 400;
        //     errorObject.data = null;
        //     return res.send(errorObject);
        // }

        if (answer.user_id.equals(req.user._id)) {
            try {
                await answer.remove();
                errorObject.message = "Delete answer successful";
                errorObject.messageCode = 200;
                errorObject.data = null;
                return res.send(errorObject);
            } catch (err) {
                errorObject.message = err.message;
                errorObject.messageCode = 400;
                errorObject.data = null;
                return res.send(errorObject);
            }
        } else {
            errorObject.message = "You can not delete this answer";
            errorObject.messageCode = 400;
            errorObject.data = null;
            return res.send(errorObject);
        }
    }

}

module.exports = answerController;