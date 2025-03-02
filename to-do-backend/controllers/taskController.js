const Task = require("../models/Task");
const { addTaskToGoogleCalendar, deleteTaskFromGoogleCalendar } = require("../utils/googleCalendar");

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const newTask = new Task({ title, description, dueDate, user: req.user.id });

    await newTask.save();

    if (req.user.google.connected) {
      const eventId = await addTaskToGoogleCalendar(req.user.id, newTask);
      newTask.googleCalendarEventId = eventId;
      await newTask.save();
    }

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
  
      if (!task) return res.status(404).json({ message: "Task not found" });
  
      if (req.user.google.connected && task.googleCalendarEventId) {
        await deleteTaskFromGoogleCalendar(req.user.id, task.googleCalendarEventId);
      }
  
      await task.remove();
      res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting task", error: error.message });
    }
  };
  