const mongoose = require('mongoose');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
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