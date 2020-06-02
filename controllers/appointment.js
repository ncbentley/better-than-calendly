const express = require('express');
const router = express.Router();

const db = require("../models");

// Index Route
router.get('/', async (req, res) => {
    db.Appointment.find({}, function (err, allAppointments) {
        if (err) {
            console.log(err);
            res.send({ message: "Internal Server Error" });
        } else {
            const context = { appointment: allAppointments }
            res.render("appointment/index", context);
        }
    });
});

// Create Route
router.post('/', async (req, res) => {
    try {
        req.body.user = req.session.currentUser.id;
        const createdAppointment = await db.Appointment.create(req.body);
        const foundSchedule = await db.Schedule.findById(createdAppointment.schedule);
        foundSchedule.appointments.push(createdAppointment._id);
        foundSchedule.save();
        res.redirect(`/appointments/${createdAppointment._id}`);
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error" });
    }
});

// Show Route
router.get('/:id', async (req, res) => {
    res.send({message: 'you\'re here'});
});

// Edit Route
router.get('/:id/edit', async (req, res) => {
    db.Appointment.findById(req.params.id, function (err, foundAppointment) {
        if (err) {
            console.log(err);
            res.send({ message: "Internal Server Error" });
        } else {
            const context = { appointment: foundAppointment }
            res.render("appointment/edit", context);
        }
    });
});

// Update Route
router.put('/:id', async (req, res) => {
    db.Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, updatedAppointment) {
        if (err) {
            console.log(err);
            res.send({ message: "Internal Server Error" });
        } else {
            res.redirect(`/appointment/${updatedAppointment._id}`);
        }
    });
});

// Delete Route
router.delete('/:id', async (req, res) => {
    db.Appointment.findByIdAndDelete(req.params.id, function (err, deletedAppointment) {
        if (err) {
            console.log(err);
            res.send({ message: "Internal Server Error" });
        } else {
            db.Appointment.findById(deletedAppointment.schedule, function (err, foundAppointment) {
                if (err) {
                    console.log(err);
                    res.send({ message: "Internal Server Error" });
                } else {
                    foundSchedule.appointment.remove(deletedAppointment);
                    foundSchedule.save();
                    res.redirect('/appointment');
                }
            });
        }
    });
});

module.exports = router;