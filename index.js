require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const farmer = require('./controller/farmerController');
const user = require('./controller/userController');
const session = require('express-session');
const cookieParser = require('cookie-parser');

mongoose.connect(process.env.MONGO_URI)
.then(res => console.log('Connected to database'))
.catch(err => console.log(err));

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/farmer', farmer);
app.use('/user', user);

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
})