/* --- Modules ---*/
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();

/* --- Globals ---*/
const app = express();
const PORT = process.env.PORT;
const controllers = require('./controllers');
const db = require('./models');

/* --- Middleware ---*/
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

/* --- Session Config --- */
app.use(
    session({
        store: new MongoStore({
            url: process.env.DB_URL
        }),
        secret: "This is my fancy secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 *2 // two weeks
        }
    })
);


app.set('view engine', 'ejs');

// Landing Page
app.get('/', (req, res) => {
    const context = {
        user: req.session.currentUser
    };
    res.render('index', context);
});

/* --- Controllers ---*/

// Auth
app.use('/', controllers.auth);

// Schedules
app.use('/schedules', controllers.schedule);

// Appointments
app.use('/appointments', controllers.appointment);

app.listen(PORT, () => {
    console.log(`Server listening at https://localhost:${PORT}`);
});