import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, logoutUser } from "../slices/useSlice"; // ✅ Correct import

const Header = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser()); // Fetch user on mount
  }, [dispatch]);

  return (
    <header>
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div>
          <h4 className="text-3xl font-medium">
            To<span className="text-red-600">d</span>o
          </h4>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4 text-lg">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          {/* Show dashboard link only if logged in */}
          {user && <Link to="/dashboard">Dashboard</Link>}

          {/* If user is loading, show loading */}
          {loading ? (
            <p>Loading...</p>
          ) : user ? (
            // If user is logged in
            <div className="flex items-center gap-3">
              <p className="text-gray-700">Welcome, {user.email}</p>
              <Button
                variant="destructive"
                className="text-lg"
                onClick={() => dispatch(logoutUser())}
              >
                Logout
              </Button>
            </div>
          ) : (
            // If user is not logged in
            <>
              <Link to="/login">Login</Link>
              <Button variant="destructive" className="text-lg">
                <Link to="/register">Start for free</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
