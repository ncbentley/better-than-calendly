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
const authRequired = require('./middlewares/authRequired');

/* --- Middleware ---*/
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

/* --- Session Config --- */
app.use(
    session({
        store: new MongoStore({
            url: process.env.MONGODB_URI
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
app.get('/', async (req, res) => {
    const schedules = await db.Schedule.find({});
    let list = [];
    schedules.forEach((schedule, i) => {
        // Load the first 5
        if (i < 5) {
            list.push(schedule);
        }
    })
    const context = {
        user: req.session.currentUser,
        schedule: list
    };
    res.render('index', context);
});

/* --- Controllers ---*/

// Auth
app.use('/', controllers.auth);

// Schedules
app.use('/schedules', authRequired, controllers.schedule);

// Appointments
app.use('/appointments', authRequired, controllers.appointment);

app.listen(PORT, () => {
    console.log(`Server listening at https://localhost:${PORT}`);
});