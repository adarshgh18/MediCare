import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {

    return (

        <>
            <Navbar />

            <main className="min-h-screen bg-[#f0f5fa]">

                <Outlet />


            </main>

            <Footer />

        </>

    );

}

export default Layout;