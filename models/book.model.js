const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    lended: {
        type: Boolean,
        default: false
    },
    genre: {
        type: String,
        enum: [
            "Chính trị - pháp luật",
            "Khoa học công nghệ - Kinh tế",
            "Văn học nghệ thuật",
            "Văn hóa xã hội - Lịch sử",
            "Giáo trình",
            "Truyện - tiểu thuyết",
            "Tâm lý - tâm linh - tôn giáo",
            "Sách thiếu nhi"
        ],
        default: "Giáo trình"
    },
    image: {
        type: String,
        required: true
    },
    cloudinary_id: {
        type: String,
        required: true
    }
}, { timestamps: true }
)

module.exports = mongoose.model('book', bookSchema);