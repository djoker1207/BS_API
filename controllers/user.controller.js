const UserModel = require('../models/user.model');
const cloudinary = require('../ultils/cloudinary');
const upload = require("../ultils/multer");
const validation = require('../ultils/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const userController = {

    //upload
    upload: upload.single('image'),

    //Dang ki
    register:
        async (req, res) => {

            const result = await cloudinary.uploader.upload(req.file.path);

            //validate user info
            const { error } = validation.registerValidate(req.body);
            if (error) return res.send(error.details[0].message);

            //check email existed in db
            const emailCreated = await UserModel.findOne({ email: req.body.email });
            if (emailCreated) return res.send("Email is already created");

            //encrypt password
            var salt = bcrypt.genSaltSync(10);
            var hashPassword = bcrypt.hashSync(req.body.password, salt);

            //Create new user
            let newUser = new UserModel();
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.phonenumber = req.body.phonenumber;
            newUser.password = hashPassword;
            newUser.genres= req.body.genres;
            newUser.avatar = result.secure_url;
            newUser.cloudinary_id = result.public_id;

            try {
                //Save user
                const user = await newUser.save();
                res.send("Create user success");
            } catch (err) {
                console.log(err);
            }
        },

    //Dang nhap
    login:
        async (req, res) => {

            // validate user
            const { error } = validation.loginValidate(req.body);
            if (error) return res.send(error.details[0].message);

            //check email existed in database
            const user = await UserModel.findOne({ email: req.body.email });
            if (!user) return res.send("Email address is not registered");

            //check password
            const loginPassword = await bcrypt.compareSync(req.body.password, user.password);
            if (!loginPassword) return res.send('Password incorrect');

            //generate token and return it
            var token = jwt.sign({ id: user._id }, process.env.JWT_STRING)
            res.header('auth-token', token).send({ token, user });
        },
}

module.exports = userController;