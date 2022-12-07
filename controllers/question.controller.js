const QuestionModel = require('../models/question.model');

const questionController = {

    create_question: async (req, res) => {

        const newQuestion = new QuestionModel();
        newQuestion.user_id = req.body.user_id;
        newQuestion.question_content = req.body.question_content;
        newQuestion.hashtags = req.body.hashtags;

        try {
            const question = await newQuestion.save();
            res.send(question);
        } catch (error) {
            res.status(400).send(error);
        }

    },

    update_question: async (req, res) => {

        const question = await QuestionModel.findOne({ _id: req.params.id });

        if (question.user_id != req.body.user_id)
            return res.status(404).send("You cannot update this question");

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
            res.send("Update successful !");
        } catch (error) {
            res.send(error);
        }
    },

    delete_question: async (req, res) => {

        const question = await QuestionModel.findOne({ _id: req.params.id });

        if (question.user_id != req.body.user_id)
            return res.status(404).send("You cannot delete this question");

        try {
            await question.remove();
            res.send("Delete successful !");
        } catch (error) {
            res.send(error);
        }
    },

    get_question: async (req, res) => {
        await QuestionModel.findOne({ _id: req.params.id })
            .populate('user_id')
            .exec((err, question) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(question);
                }
            })
    },

    get_all_question: async (req, res) => {

        await QuestionModel.find({ deleted: false })
            .sort({ 'createdAt': -1 })
            .populate('user_id')
            .exec((err, question) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(question);
                }
            })

    }

}

module.exports = questionController;