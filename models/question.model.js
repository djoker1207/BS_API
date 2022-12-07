const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    question_content: {
        type: String,
        required: true
    },
    hashtags: {
        type: [String],
        required: false
    }
}, { timestamps: true }
)

module.exports = mongoose.model('question', questionSchema);
