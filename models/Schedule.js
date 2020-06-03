const mongoose = require('mongoose');

const scheduleSchema = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    openTime: {type: Number, required: true},
    closeTime: {type: Number, required: true},
    companyName: {type: String, required: true},
    scheduleName: {type: String, required: true},
    customSlots: [Number],
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
}
    

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;