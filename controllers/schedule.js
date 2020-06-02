const express = require('express');
const router = express.Router();

const db = require("../models");

// My Schedules - Index
router.get('/', async (req, res) => {
    try {
        if (req.session.currentUser) {
            const mySchedule = await db.Schedule.find({user: req.session.currentUser._id});
            const context = { 
                user: req.session.currentUser,
                schedule: mySchedule
            };
            res.render("schedule/index", context);
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.log(err);
        res.send({ message: "Internal Server Error" });
    }
});

// All Schedules - Index
router.get('/all', async (req, res) => {
    try {
        const allSchedules = await db.Schedule.find({});
        const context = { schedule: allSchedules };
        res.render("schedule/index", context);
    } catch (err) {
        console.log(err);
        res.send({ message: "Internal Server Error" });
    }
});

// New Route
router.get('/new', (req, res) => {
    // TODO: Insure there is user session
    const context = {
        user: req.session.currentUser
    };
    res.render("schedule/new", context);
});

// Create Route
router.post('/', async (req, res) => {
    try {
        // TODO: Insure there is user session
        req.body.openTime = req.body.openTime.split(':')[0];
        req.body.closeTime = req.body.closeTime.split(':')[0];
        req.body.user = req.session.currentUser._id;
        const createdSchedule = await db.Schedule.create(req.body)
        res.redirect(`/schedules/${createdSchedule._id}`);
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error" });
    }
});

// Show Route
router.get('/:id', async (req, res) => {
    try {
        const schedule = await db.Schedule.findById(req.params.id).populate("user appointment");
        const context = {
            schedule: schedule,
            user: req.session.currentUser
        };
        res.render("schedule/show", context);
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal Server Error" });
    }
});

// Edit Route
router.get('/:id/edit', async (req, res) => {
    db.Schedule.findById(req.params.id, function (err, foundSchedule) {
        if (err) {
            console.log(err);
            res.send({ message: "Internal Server Error" });
        } else {
            const context = { schedule: foundSchedule };
            res.render("schedule/edit", context);
        }
    });
});

// Update Route
router.put('/:id', async (req, res) => {
    db.Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, updatedSchedule) {
        if (err) {
            console.log(err);
            res.send({ message: "Internal Server Error" });
        } else {
            res.redirect(`/schedules/${updatedSchedule._id}`);
        }
    });
});

// Delete Route
router.delete('/:id', async (req, res) => {
    try {
        const deletedSchedule = await db.Schedule.findByIdAndDelete(req.params.id);
        const detetedAppointments = await db.Appointment.remove({
            schedule: deletedSchedule._id,
        });
        res.redirect("/schedules");
    } catch (err) {
        console.log(err)
        res.send({ message: "Internal Server Error" });
    }
});

module.exports = router;