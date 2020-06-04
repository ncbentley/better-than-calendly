const mongoose = require('mongoose');

const userSchema = {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    schedules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule'
    }],
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
}

const User = mongoose.model('User', userSchema);

module.exports = User;