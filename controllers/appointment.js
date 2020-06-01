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

// New Route
router.get('/new', (req, res) => {
    db.Schedule.find({}, function (err, allSchedules) {
        if (err) {
            console.log(err);
            res.send({ message: "Internal Server Error" });
        } else {
            const context = { schedule: allSchedules };
            res.render("schedule/new", context);
        }
    });
});

// Create Route
router.post('/', async (req, res) => {
    db.Appointment.create(req.body, function (err, createdAppointment) {
        if (err) {
            console.log(err);
            res.send({ message: "Internal Server Error" });
        } else {
            db.Schedule.findById(createdAppointment.schedule, function (err, foundSchedule) {
                if (err) {
                    res.send({ message: "Internal Server Error" });
                } else {
                    foundSchedule.appointment.push(createdAppointment.schedule, function (err, foundSchedule) {
                        if (err) {
                            console.log(err);
                            res.send({ message: "Internal Server Error" });
                        } else {
                            foundSchedule.appointment.push(createdAppointment);
                            foundSchedule.save();
                            res.redirect("/appointment");
                        }
                    });
                }
            });
        }
    });
});

// Show Route
router.get('/:id', async (req, res) => {
    (await db.Appointment.findById(req.params.id)).populate("schedule").exec(function (err, foundAppointment) {
        if (err) {
            console.log(err);
            res.send({ message: "Internal Server Error" });
        } else {
            const context = { appointment: foundAppointment }
            res.render("appointment/show", context);
        }
    });
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