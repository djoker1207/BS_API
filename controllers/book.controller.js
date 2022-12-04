const BookModel = require('../models/book.model');
const cloudinary = require('../ultils/cloudinary');
const upload = require("../ultils/multer");

const bookController = {

    //upload
    upload: upload.single('image'),

    //đăng thông tin sách
    uploadBook: async (req, res) => {

        try {

            const result = await cloudinary.uploader.upload(req.file.path);

            let newBook = new BookModel();
            newBook.user_id = req.body.user_id;
            newBook.name = req.body.name;
            newBook.description = req.body.description;
            newBook.genre = req.body.genre;
            newBook.image = result.secure_url;
            newBook.cloudinary_id = result.public_id;

            const book = await newBook.save();
            res.send(book);

        } catch (err) {
            console.log(err);
        }

    },

    updateBook: async (req, res) => {
        try {
            let book = await BookModel.findById(req.params.id);

            if (book.user_id != req.body.user_id)
                return res.send("You are not allowed to update this book");

            let result;
            if (req.file) {
                await cloudinary.uploader.destroy(book.cloudinary_id);
                result = await cloudinary.uploader.upload(req.file.path);
            }

            const updatedBoook = await BookModel.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set:
                    {
                        name: req.body.name || book.name,
                        description: req.body.description || book.description,
                        genre: req.body.genre || book.genre,
                        lended: req.body.lended || book.lended,
                        image: result?.secure_url || book.image,
                        cloudinary_id: result?.public_id || book.cloudinary_id,
                    }
                }
            )

            res.send(updatedBoook);

        } catch (err) {
            console.log(err)
        }
    },

    deleteBook: async (req, res) => {
        try {

            let book = await BookModel.findOne({ _id: req.params.id });

            if (book.user_id != req.body.user_id)
                return res.send("You are not allowed to delete this book");

            await cloudinary.uploader.destroy(book.cloudinary_id);

            await book.remove();

            res.send(book);
        } catch (err) {
            console.log(err);
        }
    },

    getLendedBook: async (req, res) => {
        try {
            await BookModel.find({ lended: true, user_id: req.body.user_id })
                .sort({ 'createdAt': -1 })
                .exec((err, book) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(book);
                    }
                })
        } catch (err) {
            console.log(err);
        }
    },

    getBook: async (req, res) => {
        try {
            const page = parseInt(req.query.page) - 1 || 0;
            const limit = parseInt(req.query.limit) || 2;
            const search = req.query.search || "";
            let sort = req.query.sort || "updatedAt";
            let genre = req.query.genre || "All"

            const genreOptions = [
                "Chính trị - pháp luật",
                "Khoa học công nghệ - Kinh tế",
                "Văn học nghệ thuật",
                "Văn hóa xã hội - Lịch sử",
                "Giáo trình",
                "Truyện - tiểu thuyết",
                "Tâm lý - tâm linh - tôn giáo",
                "Sách thiếu nhi"
            ];

            genre === "All"
                ? (genre = [...genreOptions])
                : (genre = req.query.genre.split(","));
            req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

            let sortBy = {};
            if (sort[1]) {
                sortBy[sort[0]] = sort[1];
            } else {
                sortBy[sort[0]] = "asc";
            }

            const books = await BookModel.find({ name: { $regex: search, $options: "i" } })
                .where("genre")
                .in([...genre])
                .sort(sortBy)
                .skip(page * limit)
                .limit(limit);

            const total = await BookModel.countDocuments({
                genre: { $in: [...genre] },
                name: { $regex: search, $options: "i" },
            });

            const response = {
                error: false,
                total,
                page: page + 1,
                limit,
                genre: genreOptions,
                books
            };

            res.status(200).json(response);

        } catch (err) {
            console.log(err);
        }

    }

}

module.exports = bookController;
