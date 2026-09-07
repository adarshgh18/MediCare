import { Link, NavLink, useNavigate } from "react-router-dom";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import api from "../../services/api";

import {
    User,
    UserCircle,
    ChevronDown,
    LogOut,
    LayoutDashboard,
    HeartPulse,
} from "lucide-react";

import NotificationDropdown from "./NotificationDropdown";


function Navbar() {

    const navigate = useNavigate();

    const { user, setUser } =
        useContext(AuthContext);

    const [showDropdown, setShowDropdown] =
        useState(false);


    const navLinkStyle = ({ isActive }) =>

        isActive
            ? "text-yellow-300 font-semibold"
            : "hover:text-gray-200";


    const handleLogout = async () => {

        try {

            await api.post("/auth/logout");

            setUser(null);

            setShowDropdown(false);

            navigate("/", {
                replace: true,
            });

        }

        catch (err) {

            console.log(err);

        }

    };


    return (

        <nav className="sticky top-0 z-50 bg-blue-600 text-white px-6 py-4">

            {/* <div className="max-w-7xl mx-auto flex justify-between items-center"> */}
            <div className="max-w-[1400px] mx-auto flex justify-between items-center px-2">

                {/* Logo */}

                <Link
                    to="/"
                    className="text-2xl font-bold"
                >

                    <div className="flex items-center gap-2">
                        <HeartPulse
                            size={27}
                            strokeWidth={2.5}
                        />

                        <span>MediCare</span>
                    </div>

                </Link>


                {/* Right Side */}

                <div className="flex items-center  gap-5 ">

                    <NavLink
                        to="/"
                        className={navLinkStyle}
                    >

                        Home

                    </NavLink>


                    <NavLink
                        to="/doctors"
                        className={navLinkStyle}
                    >

                        Doctors

                    </NavLink>


                    {!user ? (

                        <>

                            <NavLink
                                to="/login"
                                className={navLinkStyle}
                            >

                                Login

                            </NavLink>


                            <NavLink
                                to="/register"
                                className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold"
                            >

                                Register

                            </NavLink>

                        </>

                    ) : (

                        <div className="flex items-center gap-4">

                            {/* Notifications */}

                            <NotificationDropdown />


                            {/* User Dropdown */}

                            <div className="relative">

                                <button
                                    onClick={() =>
                                        setShowDropdown(
                                            !showDropdown
                                        )
                                    }
                                    // className="flex items-center gap-2 hover:text-yellow-300"
                                    // className="
                                    //     flex items-center gap-2
                                    //     px-3 py-1.5
                                    //     rounded-full
                                    //     bg-white/
                                    //     border-2 border-white/100
                                    //     hover:text-yellow-300
                                    //     transition
                                    // "

                                    className="
                                        flex items-center gap-2
                                        px-3 py-1.5
                                        rounded-full
                                        bg-white/10
                                        border border-white/20
                                        hover:text-yellow-300
                                        transition
                                    "
                                >

                                    <User size={20} />


                                    <span>

                                        {
                                            user.fullName.split(
                                                " "
                                            )[0]
                                        }

                                    </span>


                                    <ChevronDown
                                        size={18}
                                    />

                                </button>


                                {showDropdown && (

                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg text-black z-50">

                                        {/* User Info */}

                                        <div className="px-4 py-3 border-b">

                                            <p className="font-semibold">

                                                {user.fullName}

                                            </p>


                                            <p className="text-sm text-gray-500">

                                                {user.email}

                                            </p>

                                        </div>


                                        {/* Menu */}

                                        <div className="py-2">

                                            <Link
                                                to={
                                                    user.role === "doctor"
                                                        ? "/doctor/profile"
                                                        : "/patient/profile"
                                                }
                                                onClick={() => setShowDropdown(false)}
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <UserCircle size={18} />
                                                    Profile
                                                </div>
                                            </Link>

                                            <Link
                                                to={
                                                    user.role ===
                                                    "doctor"
                                                        ? "/doctor/dashboard"
                                                        : "/patient/dashboard"
                                                }
                                                onClick={() => setShowDropdown( false ) }
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >

                                                <div className="flex items-center gap-2">

                                                    <LayoutDashboard
                                                        size={18}
                                                    />

                                                    Dashboard

                                                </div>

                                            </Link>


                                            <button
                                                onClick={
                                                    handleLogout
                                                }
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                            >

                                                <div className="flex items-center gap-2">

                                                    <LogOut
                                                        size={18}
                                                    />

                                                    Logout

                                                </div>

                                            </button>

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </nav>

    );

}


export default Navbar;