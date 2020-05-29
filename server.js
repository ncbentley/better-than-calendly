/* --- Modules ---*/
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
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

app.set('engine view', 'ejs');

// Landing Page
app.get('/', (req, res) => {
    res.render('index');
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