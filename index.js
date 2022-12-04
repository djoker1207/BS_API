const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");

const userRouter = require('./routes/user.route');
const bookRouter = require('./routes/book.route');

dotenv.config();

//connect database
mongoose.connect((process.env.MONGODB_URL), () => {
    console.log("Connected to MongoDB");
})

//Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

//Route
app.use('/user', userRouter);
app.use('/book', bookRouter);

app.listen(8000, () => {
    console.log("Server is running...");
});

