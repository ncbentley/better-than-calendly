const mongoose = require('mongoose');
require('dotenv').config();
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then(() => {
    console.log('MongoDB connected');
}).catch(error => {
    console.log(error);
});

module.exports = {
    User: require('./User'),
    Appointment: require('./Appointment'),
    Schedule: require('./Schedule')
};