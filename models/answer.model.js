const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = new mongoose.Schema({
    question_id: {
        type: Schema.Types.ObjectId,
        ref: 'question'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    answer_content: {
        type: String,
        required: true
    }
}, { timestamps: true }
)

module.exports = mongoose.model('answer', answerSchema);