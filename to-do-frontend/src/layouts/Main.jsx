import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import {Toaster} from "../components/ui/sonner"
const Main = () => {
    return (
        <div>
            <Header/>
            <Outlet/>
            <Toaster position="top-right"/>
            <Footer/>
        </div>
    );
};

export default Main;