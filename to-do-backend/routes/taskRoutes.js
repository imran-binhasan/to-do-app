const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { isAuthenticated } = require("../middleware/authMiddleware"); // Ensure user is logged in

// ✅ CREATE a new task
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const newTask = await Task.create({
      title,
      description,
      dueDate,
      priority,
      userId: req.user.id, // Get user from middleware
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// ✅ READ all tasks for a user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// ✅ UPDATE a task (mark as complete or edit details)
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
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
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;
