const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { isAuthenticated } = require("../middleware/authMiddleware"); // Ensure user is logged in



router.post('/tasks', isAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    
    // Create task in your database
    const newTask = new Task({
      userId: req.user.userId,
      title,
      description,
      dueDate,
      priority,
      status: 'pending'
    });
    
    await newTask.save();
    
    // Find the full user to get Google info
    const user = await User.findById(req.user.userId);
    
    // If user has Google connected, create calendar event
    if (user.google.connected) {
      const calendarResult = await createCalendarEvent(user, newTask);
      
      // If calendar event was created, store the reference
      if (calendarResult.success) {
        newTask.googleCalendarEventId = calendarResult.eventId;
        newTask.googleCalendarLink = calendarResult.htmlLink;
        await newTask.save();
      }
    }
    
    res.status(201).json({ 
      message: 'Task created successfully', 
      task: newTask 
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ READ all tasks for a user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    console.log('inside getting')
    const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    console.log(tasks)
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
