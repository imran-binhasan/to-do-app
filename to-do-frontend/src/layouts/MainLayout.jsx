import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import {Toaster} from "../components/ui/sonner"
const MainLayout = () => {
    return (
        <div>
            <Header/>
            <Outlet/>
            <Toaster/>
            <Footer/>
        </div>
    );
};

export default MainLayout;