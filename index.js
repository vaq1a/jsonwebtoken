require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routers/userRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api', userRouter);

async function start () {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'Ошибка подключения: '));
        db.once('open', () => {
            console.log('MongoDB connection');
        })

        app.listen(process.env.PORT || 5000, (e) => {
            if(e) {
                console.error(e);

                return;
            }

            console.log(`Server started on ${process.env.PORT} port`);
        });
    } catch (e) {
        console.error(e);
    }
}

start();