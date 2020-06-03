const express = require('express');
const router = express.Router();

const db = require("../models");

// Index Route
router.get('/', async (req, res) => {
    try {
        let appointments = await db.Appointment.find({ user: req.session.currentUser.id })
        const schedules = await db.Schedule.find({ user: req.session.currentUser.id }).populate('appointments');
        schedules.forEach(schedule => {
            schedule.appointments.forEach(appointment => {
                if (appointment.user != req.session.currentUser.id) {
                    appointments.push(appointment);
                }
            })
        });
        const context = {
            appointment: appointments,
            user: req.session.currentUser
        }
        res.render('appointment/index', context);
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error" });
    }
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
    try {
        const appointment = await db.Appointment.findById(req.params.id).populate('schedule');
        const context = {
            appointment: appointment,
            user: req.session.currentUser
        }
        res.render('appointment/show', context);
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error" });
    }
});

// Edit Route
router.get('/:id/edit', async (req, res) => {
    try {
        const appointment = await db.Appointment.findById(req.params.id);
        const context = {
            appointment: appointment,
            user: req.session.currentUser
        };
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error" });
    }
});

// Update Route
router.put('/:id', async (req, res) => {
    try {
        const appointment = await db.Appointment.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.redirect(`/appointments/${updatedAppointment._id}`);
    }
    catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error" });
    }
});

// Delete Route
router.delete('/:id', async (req, res) => {
    try {
        const appointment = await db.Appointment.findByIdAndDelete(req.params.id);
        const schedule = await db.Schedule.findById(appointment.schedule);
        schedule.appointments.remove(appointment);
        schedule.save();
        res.redirect('/appointments');
    }
    catch (error) {
        console.log(error);
        res.send({message: "Internal Server Error" });
    }
});

module.exports = router;