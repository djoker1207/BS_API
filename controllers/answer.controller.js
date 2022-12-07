const AnswerModel = require('../models/answer.model');

const answerController = {

    create_answer: async (req, res) => {

        const newAnswer = new AnswerModel();
        newAnswer.question_id = req.body.question_id;
        newAnswer.user_id = req.body.user_id;
        newAnswer.answer_content = req.body.answer_content;

        try {
            const answer = await newAnswer.save();
            res.send(answer);
        } catch (error) {
            res.status(400).send(error);
        }

    },

    get_answers: async (req, res) => {
        await AnswerModel.find({ question_id: req.params.question_id })
            .sort({ 'createdAt': -1 })
            .populate('user_id')
            .exec((err, answer) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(answer);
                }
            })
    },

    delete_answer: async (req, res) => {

        const answer = await AnswerModel.findOne({ _id: req.params.id });

        if (answer.user_id != req.body.user_id)
            return res.status(404).send("You can not delete this answer !");

        try {
            await answer.remove();
            res.send("Delete answer successful")
        } catch (err) {
            res.send(err);
        }

    }

}

module.exports = answerController;