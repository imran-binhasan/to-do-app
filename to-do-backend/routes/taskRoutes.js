const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { addTaskToGoogleCalendar } = require("../utils/googleCalender"); // Ensure user is logged in
const User = require('../models/User');


router.post("/", isAuthenticated, async (req, res) => {
  try {
    console.log('ok')
    const { title, description, dueDate, priority,status } = req.body;
    // Create task in your database
    const userData = await User.findById(req.user.userId);
    const newTask = new Task({
      userId: userData._id, // Use _id from the deserialized user object
      title,
      description,
      dueDate,
      priority,
      status
    });

    await newTask.save();
    console.log('ok3')
    // Retrieve full user details (if needed) to access Google connection info

    
    // If the user has Google connected, create a calendar event
    if (userData.google.connected) {
      const calendarResult = await addTaskToGoogleCalendar(userData, newTask);
      
      // If the calendar event was successfully created, store the reference in the task
      if (calendarResult && calendarResult.success) {
        newTask.googleCalendarEventId = calendarResult.eventId;
        newTask.googleCalendarLink = calendarResult.htmlLink;
        await newTask.save();
      }
    }
    
    res.status(201).json({ 
      message: "Task created successfully", 
      task: newTask 
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ READ all tasks for a user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    console.log('inside getting')
    const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// ✅ UPDATE a task (mark as complete or edit details)
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId }, 
      req.body, 
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// ✅ DELETE a task
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;
