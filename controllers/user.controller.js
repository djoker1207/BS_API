const UserModel = require('../models/user.model');
const cloudinary = require('../ultils/cloudinary');
const upload = require("../ultils/multer");
const validation = require('../ultils/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let errorObject = require('../ultils/error');
require("dotenv").config();

const userController = {

    //upload
    upload: upload.single('image'),

    //Dang ki
    register:
        async (req, res) => {

            //validate user info
            const { error } = validation.registerValidate(req.body);
            //check email existed in db
            const emailCreated = await UserModel.findOne({ email: req.body.email });

            let result;

            //Create new user
            let newUser = new UserModel();

            if (error) {
                errorObject.message = error.details[0].message;
                errorObject.messageCode = 400;
                return res.send(errorObject);
            } else if (emailCreated) {
                errorObject.message = 'Email is already created';
                errorObject.messageCode = 400;
                return res.send(errorObject);
            } else {
                result = await cloudinary.uploader.upload(req.file.path);
                //encrypt password
                var salt = bcrypt.genSaltSync(10);
                var hashPassword = bcrypt.hashSync(req.body.password, salt);

                newUser.name = req.body.name;
                newUser.email = req.body.email;
                newUser.phonenumber = req.body.phonenumber;
                newUser.password = hashPassword;
                newUser.genre = req.body.genre;
                newUser.avatar = result.secure_url;
                newUser.cloudinary_id = result.public_id;
            }

            try {
                //Save user
                const user = await newUser.save();
                errorObject.message = 'Create user successful';
                errorObject.messageCode = 200;
                return res.send(errorObject);
            } catch (err) {
                errorObject.message = err.message;
                errorObject.messageCode = 400;
                return res.send(errorObject);
            }
        },

    //Dang nhap
    login:
        async (req, res) => {

            // validate user
            const { error } = validation.loginValidate(req.body);
            if (error) {
                errorObject.message = error.details[0].message;
                errorObject.messageCode = 400;
                return res.send(errorObject);
            }

            //check email existed in database
            const user = await UserModel.findOne({ email: req.body.email });
            if (!user) {
                errorObject.message = "Email address is not registered";
                errorObject.messageCode = 400;
                return res.send(errorObject);
            }

            //check password
            const loginPassword = await bcrypt.compareSync(req.body.password, user.password);

            if (!loginPassword) {
                errorObject.message = "Password incorrect";
                errorObject.messageCode = 400;
                return res.send(errorObject);
            } else {
                //generate token and return it
                var token = jwt.sign({ id: user._id }, process.env.JWT_STRING)
                errorObject.data = { token, user };
                errorObject.message = "Login success"
                errorObject.messageCode = 200;
                return res.header('auth-token', token).send(errorObject);
            }
        },

    getCurrentUser:
        async (req, res) => {
            try {
                const user = req.user;
                errorObject.message = 'Get Current user successful';
                errorObject.messageCode = 200;
                errorObject.data = user;
                return res.send(errorObject);
            } catch (err) {
                errorObject.message = err.message;
                errorObject.messageCode = 400;
                return res.send(errorObject);
            }
        },

    getUserByID:
        async (req, res) => {
            try {
                const user = await UserModel.findOne({ _id: req.params.id });
                if (!user) {
                    errorObject.message = "User does not exist";
                    errorObject.messageCode = "400";
                    return res.send(errorObject);
                } else {
                    errorObject.message = "Get user by ID successful";
                    errorObject.messageCode = 200;
                    errorObject.data = user;
                    return res.send(errorObject);
                }
            } catch (err) {
                errorObject.message = err.message;
                errorObject.messageCode = 400;
                return res.send(errorObject);
            }
        }
}

module.exports = userController;