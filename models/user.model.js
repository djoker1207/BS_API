const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
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
        required:false
    },
    avatar: {
        type: String,
        required: false
    },
    cloudinary_id: {
        type: String,
        required: false
    }
}, { timestamps: true }
)

module.exports = mongoose.model('user', userSchema);

