import { Outlet, NavLink } from "react-router-dom";
import { FaTasks, FaCalendarAlt, FaCog } from "react-icons/fa";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 space-y-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <nav className="space-y-4">
          <NavLink
            to="tasks"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 rounded-lg transition ${
    isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaTasks /> Tasks
          </NavLink>
          <NavLink
            to="calendar"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 rounded-lg transition ${
    isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaCalendarAlt /> Calendar
          </NavLink>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 rounded-lg transition ${
    isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaCog /> Settings
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 rounded-lg transition ${
    isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <FaCog /> Back to Home
          </NavLink>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
