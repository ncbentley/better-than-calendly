const express = require('express');
const router = express.Router();

const db = require("../models");

// My Schedules - Index
router.get('/', async (req, res) => {
    try {
        const mySchedule = await db.Schedule.find({});
        const context = { schedule: mySchedule };
        res.render("schedule/index", context);
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

// New Schedule Route
router.get('/new', (req, res) => {
    res.render("schedule/new");
});

// Create Route - don't think I have the syntax right on this
router.post('/', async (req, res) => {
    const schedule = {
        openTime: req.body.openTime,
        closeTime: req.body.closeTime,
        companyName: req.body.companyName,
        scheduleName: req.body.scheduleName,
        customSlots: req.body.customSlots,
    };
    db.Schedule.create(schedule, (err, createdSchedule) => {
        if (err) {
            console.log(err);
            res.send({ message: "Internal Server Error" });
        } else {
            res.redirect("/schedule");
        }
    });
});

// Show Route
router.get('/:id', async (req, res) => {
    db.Schedule.findById(req.params.id)
        .populate("schedule user")
        .exec(function (err, foundSchedule) {
            if (err) {
                console.log(err);
                res.send({ message: "Internal Server Error" });
            } else {
                const context = { schedule: foundSchedule };
                res.render("schedule/show", context);
            }
        });
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
            res.redirect(`/schedule/${updatedSchedule._id}`);
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
        res.redirect("/schedule");
    } catch (err) {
        console.log(err)
        res.send({ message: "Internal Server Error" });
    }
});

module.exports = router;