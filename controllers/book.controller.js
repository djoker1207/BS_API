const BookModel = require('../models/book.model');
const UserModel = require('../models/user.model');
const cloudinary = require('../ultils/cloudinary');
const upload = require("../ultils/multer");
const errorObject = require('../ultils/error');
const e = require('express');
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
            errorObject.message = "Upload book sucess";
            errorObject.messageCode = 200;
            errorObject.data = book;
            return res.send(errorObject);

        } catch (err) {
            errorObject.message = err.message;
            errorObject.data = null;
            errorObject.messageCode = 400;
            return res.send(errorObject);
        }

    },

    updateBook: async (req, res) => {
        try {
            let book = await BookModel.findById(req.params.id);

            if (book.user_id != req.body.user_id) {
                errorObject.message = "You are not allowed to update this book";
                errorObject.data = null;
                errorObject.messageCode = 400;
                return res.send(errorObject);
            }

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

            errorObject.message = "Update book successfull";
            errorObject.data = null;
            errorObject.messageCode = 200;
            return res.send(errorObject);

        } catch (err) {
            errorObject.message = err.message;
            errorObject.data = null;
            errorObject.messageCode = 400;
            return res.send(errorObject);
        }
    },

    deleteBook: async (req, res) => {
        try {

            let book = await BookModel.findOne({ _id: req.params.id });

            // if (book.user_id.equals(req.user._id)) {
            //     console.log(book.user_id, req.user._id);
            //     errorObject.message = "You are not allowed to delete this book";
            //     errorObject.data = null;
            //     errorObject.messageCode = 400;
            //     return res.send(errorObject);
            // }

            if (book.user_id.equals(req.user._id)) {

                await cloudinary.uploader.destroy(book.cloudinary_id);

                await book.remove();

                errorObject.message = "Delete book successful";
                errorObject.data = null;
                errorObject.messageCode = 200;
                return res.send(errorObject);
            } else {
                errorObject.message = "You are not allowed to delete this book";
                errorObject.data = null;
                errorObject.messageCode = 400;
                return res.send(errorObject);
            }

        } catch (err) {
            errorObject.message = err.message;
            errorObject.data = null;
            errorObject.messageCode = 400;
            return res.send(errorObject);
        }
    },

    getLendedBook: async (req, res) => {
        try {
            await BookModel.find({ lended: true, user_id: req.params.id })
                .sort({ 'createdAt': -1 })
                .exec((err, book) => {
                    if (err) {
                        errorObject.message = err.message;
                        errorObject.data = null;
                        errorObject.messageCode = 400;
                        return res.send(errorObject);
                    } else {
                        errorObject.message = "get lended books successful";
                        errorObject.data = book;
                        errorObject.messageCode = 200;
                        return res.send(errorObject);
                    }
                })
        } catch (err) {
            errorObject.message = err.message;
            errorObject.data = null;
            errorObject.messageCode = 400;
            return res.send(errorObject);
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

            const books = await BookModel.find({ name: { $regex: search, $options: "i" } }).populate('user_id')
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

            errorObject.message = "get books successful";
            errorObject.data = response;
            errorObject.messageCode = 200;
            return res.send(errorObject);

        } catch (err) {
            errorObject.message = err.message;
            errorObject.data = null;
            errorObject.messageCode = 400;
            return res.send(errorObject);
        }

    },

    getBookByUserGenre: async (req, res) => {
        try {

            let usergenres = await UserModel.findOne({ _id: req.params.id });

            let collection1 = await BookModel.find({ genre: usergenres.genre[0], lended: false })
                .limit(3);
            let collection2 = await BookModel.find({ genre: usergenres.genre[1], lended: false })
                .limit(3);
            let collection3 = await BookModel.find({ genre: usergenres.genre[2], lended: false })
                .limit(3);

            let data = [
                { genre: usergenres.genre[0], books: collection1 },
                { genre: usergenres.genre[1], books: collection2 },
                { genre: usergenres.genre[2], books: collection3 },
            ];

            errorObject.message = "Get books by user's genre successful";
            errorObject.data = data;
            errorObject.messageCode = 200;

            res.send(errorObject);

        } catch (err) {
            errorObject.message = err.message;
            errorObject.data = null;
            errorObject.messageCode = 400;
        }
    },

    getBookByGenre: async (req, res) => {

        try {

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

            let collection1 = await BookModel.find({ genre: genreOptions[0], lended: false })

            let collection2 = await BookModel.find({ genre: genreOptions[1], lended: false })

            let collection3 = await BookModel.find({ genre: genreOptions[2], lended: false })

            let collection4 = await BookModel.find({ genre: genreOptions[3], lended: false })

            let collection5 = await BookModel.find({ genre: genreOptions[4], lended: false })

            let collection6 = await BookModel.find({ genre: genreOptions[5], lended: false })

            let collection7 = await BookModel.find({ genre: genreOptions[6], lended: false })

            let collection8 = await BookModel.find({ genre: genreOptions[7], lended: false })


            let data = [
                { genre: genreOptions[0], books: collection1 },
                { genre: genreOptions[1], books: collection2 },
                { genre: genreOptions[2], books: collection3 },
                { genre: genreOptions[3], books: collection4 },
                { genre: genreOptions[4], books: collection5 },
                { genre: genreOptions[5], books: collection6 },
                { genre: genreOptions[6], books: collection7 },
                { genre: genreOptions[7], books: collection8 },
            ];

            errorObject.message = "Get books by genres successful";
            errorObject.data = data;
            errorObject.messageCode = 200;

            res.send(errorObject);

        } catch (err) {
            errorObject.message = err.message;
            errorObject.data = null;
            errorObject.messageCode = 400;
        }

    },

    getDetailBook: async (req, res) => {
        await BookModel.findOne({ _id: req.params.id })
            .populate('user_id')
            .exec((err, book) => {
                if (err) {
                    errorObject.message = err.message;
                    errorObject.messageCode = 400;
                    errorObject.data = null;
                    return res.send(errorObject);
                } else {
                    errorObject.message = "Get Detail Book Successful";
                    errorObject.messageCode = 200;
                    errorObject.data = book;
                    return res.send(errorObject);
                }
            })
    }

}

module.exports = bookController;
