import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; // Import format from date-fns
import { CalendarIcon } from "lucide-react"; // Import Calendar Icon from lucide-react
import { cn } from "../../lib/utils"; // Import cn utility (adjust path if needed)
import { Button } from "../../components/ui/button"; // Import Button component
import { Calendar } from "../../components/ui/calendar"; // Import ShadCN Calendar component
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"; // Import Popover components
import { createTask, getTasks, updateTask, deleteTask } from "../../services/taskService"; // Adjust imports

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        dueDate: "",
        status: "pending",
        priority: "medium",
    });
    const [selectedDate, setSelectedDate] = useState(null); // Store the selected date from the calendar

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await getTasks(); // Use the service to get tasks
            if (Array.isArray(response.data)) {
                console.log(response.data)
                setTasks(response.data); // Ensure tasks is always an array
            } else {
                console.error("Fetched data is not an array:", response.data);
                setTasks([]); // Set an empty array if data is invalid
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]); // Ensure tasks is always an array even on error
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    // Handle task creation
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            // Add selected date to the new task object before creating the task
            const taskData = { ...newTask, dueDate: selectedDate || newTask.dueDate };
            await createTask(taskData); // Use the service to create a task
            setNewTask({ title: "", description: "", dueDate: "", status: "pending", priority: "medium" });
            setSelectedDate(null); // Reset the calendar date
            fetchTasks(); // Refresh the task list after creating a task
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    // Handle task update
    const handleUpdateTask = async (taskId, updatedData) => {
        try {
            await updateTask(taskId, updatedData); // Use the service to update the task
            fetchTasks(); // Refresh the task list after updating a task
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Handle task deletion
    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId); // Use the service to delete the task
            fetchTasks(); // Refresh the task list after deleting a task
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Use Effect to fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="task-container max-w-3xl mx-auto px-4 py-6">
            <h2 className="text-3xl font-semibold text-center mb-6">Manage Tasks</h2>

            <form onSubmit={handleCreateTask} className="task-form bg-white p-6 rounded-lg shadow-md space-y-4">
                {/* Task Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Task Title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        required
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Task Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        placeholder="Task Description"
                        value={newTask.description}
                        onChange={handleInputChange}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Task Due Date (ShadCN Calendar) */}
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !selectedDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Task Status */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        value={newTask.status}
                        onChange={handleInputChange}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Task Priority */}
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                        name="priority"
                        value={newTask.priority}
                        onChange={handleInputChange}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <button type="submit" className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                    Add Task
                </button>
            </form>

            <div className="task-list mt-8">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task._id} className="task-item bg-white p-4 mb-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold">{task.title}</h3>
                            <p className="text-gray-600">{task.description}</p>
                            <p className="text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                            <p className="text-gray-500">Status: {task.status}</p>
                            <p className="text-gray-500">Priority: {task.priority}</p>

                            <button
                                onClick={() =>
                                    handleUpdateTask(task._id, {
                                        ...task,
                                        status: task.status === "Completed" ? "Pending" : "Completed",
                                    })
                                }
                                className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                            >
                                Toggle Status
                            </button>

                            <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No tasks found. Please add a task.</p>
                )}
            </div>
        </div>
    );
};

export default Tasks;
