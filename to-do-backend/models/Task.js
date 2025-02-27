const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link task to user
}, { timestamps: true });

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
