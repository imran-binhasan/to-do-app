import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import VerifyMail from "../pages/Auth/VerifyMail";
import Verify2FA from "../pages/Auth/Verify2FA";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Calendar from "../pages/Dashboard/Calendar";
import Settings from "../pages/Dashboard/Settings";
import Tasks from "../pages/Dashboard/Tasks";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verify-mail",
        element: <VerifyMail />, // Used in both register & login
      },
      {
        path: "/verify-2fa",
        element: <Verify2FA />, // Used in both register & login
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "tasks",
        element: <Tasks/>,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export default Router;
