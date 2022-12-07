const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");

const userRouter = require('./routes/user.route');
const bookRouter = require('./routes/book.route');
const questionRouter = require('./routes/question.route');
const answerRouter = require('./routes/answer.route');

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
app.use('/question', questionRouter);
app.use('/answer', answerRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

