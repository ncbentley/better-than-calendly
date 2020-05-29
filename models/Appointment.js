const mongoose = require('mongoose');

const appointmentSchema = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule'
    },
    name: {type: String, required: true},
    time: {type: Date, required: true},
    message: String
}

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;