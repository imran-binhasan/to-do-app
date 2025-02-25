import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header>
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h4 className="text-3xl font-medium">
            To<span className="text-red-600">d</span>o
          </h4>
        </div>
        <nav>
          <nav className="flex justify-between gap-3 text-lg">
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            {/* <Link to="/dashboard">Dashboard</Link> */}
            <Link to="/login">Login</Link>
            <Button variant="destructive" className="text-lg">
              <Link to="/register">Start for free</Link>
            </Button>
          </nav>
        </nav>
      </div>
    </header>
  );
};

export default Header;
