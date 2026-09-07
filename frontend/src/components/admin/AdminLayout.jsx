import { Link, useLocation } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    UserRound,
    CalendarDays,
    LogOut,
    Menu,
    X,
    HeartPulse,
} from "lucide-react";

import { useState } from "react";

import toast from "react-hot-toast";

import api from "../../services/api";


function AdminLayout({ children }) {

    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);


    // ----------------------------------
    // Navigation
    // ----------------------------------

    const navigation = [

        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },

        {
            name: "Doctors",
            path: "/admin/doctors",
            icon: UserRound,
        },

        {
            name: "Patients",
            path: "/admin/patients",
            icon: Users,
        },

        {
            name: "Appointments",
            path: "/admin/appointments",
            icon: CalendarDays,
        },

    ];


    // ----------------------------------
    // Check active route
    // ----------------------------------

    const isNavigationActive = (path) => {

        if (path === "/admin/dashboard") {

            return location.pathname === path;

        }

        return (
            location.pathname === path ||
            location.pathname.startsWith(path + "/")
        );

    };


    // ----------------------------------
    // Logout
    // ----------------------------------

    const handleLogout = async () => {

        try {

            await api.post("/auth/logout");

            toast.success(
                "Logged out successfully."
            );

            window.location.href = "/login";

        }

        catch (err) {

            console.error(
                "Admin logout error:",
                err
            );

            toast.error(
                "Unable to logout. Please try again."
            );

        }

    };


    // ----------------------------------
    // Sidebar Navigation
    // ----------------------------------

    const renderNavigation = () => (

        <nav className="
            flex-1
            px-4
            py-6
            overflow-y-auto
        ">

            <p className="
                px-3
                mb-3
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-blue-200
            ">
                Management
            </p>


            <div className="space-y-1">

                {navigation.map((item) => {

                    const Icon = item.icon;

                    const isActive =
                        isNavigationActive(item.path);


                    return (

                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                            className={`
                                group
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                rounded-xl
                                text-sm
                                font-medium
                                transition-all
                                duration-200
                                ${
                                    isActive
                                        ? `
                                            bg-white
                                            text-blue-600
                                            shadow-sm
                                        `
                                        : `
                                            text-blue-100
                                            hover:bg-white/10
                                            hover:text-white
                                        `
                                }
                            `}
                        >

                            <Icon
                                size={19}
                                className={`
                                    shrink-0
                                    transition
                                    ${
                                        isActive
                                            ? "text-blue-600"
                                            : "text-blue-200 group-hover:text-white"
                                    }
                                `}
                            />

                            <span>
                                {item.name}
                            </span>

                        </Link>

                    );

                })}

            </div>

        </nav>

    );


    // ----------------------------------
    // Sidebar
    // ----------------------------------

    const Sidebar = () => (

        <aside className="
            w-64
            shrink-0
            fixed
            left-0
            top-0
            bottom-0
            z-50
            flex
            flex-col
            bg-gradient-to-b
            from-blue-600
            via-blue-600
            to-blue-700
            shadow-xl
        ">


            {/* -------------------------------- */}
            {/* Brand */}
            {/* -------------------------------- */}

            <div className="
                h-20
                px-6
                flex
                items-center
                border-b
                border-white/10
                shrink-0
            ">

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <div className="
                        w-10
                        h-10
                        rounded-xl
                        bg-white
                        flex
                        items-center
                        justify-center
                        text-blue-600
                        shadow-sm
                    ">

                        <HeartPulse
                            size={22}
                        />

                    </div>


                    <div>

                        <h1 className="
                            text-lg
                            font-bold
                            text-white
                            leading-none
                        ">
                            MediCare
                        </h1>

                        <p className="
                            text-[10px]
                            text-blue-100
                            mt-1
                        ">
                            Admin Panel
                        </p>

                    </div>

                </div>

            </div>


            {/* -------------------------------- */}
            {/* Navigation */}
            {/* -------------------------------- */}

            {renderNavigation()}


            {/* -------------------------------- */}
            {/* Admin Section */}
            {/* -------------------------------- */}

            <div className="
                p-4
                border-t
                border-white/10
                shrink-0
            ">


                {/* Admin profile */}

                <div className="
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-xl
                    bg-white/10
                    mb-2
                ">

                    <div className="
                        w-10
                        h-10
                        rounded-full
                        bg-white
                        flex
                        items-center
                        justify-center
                        text-blue-600
                        font-bold
                        text-sm
                        shrink-0
                    ">
                        A
                    </div>


                    <div className="
                        min-w-0
                        flex-1
                    ">

                        <p className="
                            text-sm
                            font-semibold
                            text-white
                            truncate
                        ">
                            Admin
                        </p>

                        <p className="
                            text-[11px]
                            text-blue-100
                            truncate
                        ">
                            Administrator
                        </p>

                    </div>

                </div>


                {/* Logout */}

                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-2.5
                        rounded-xl
                        text-sm
                        font-medium
                        text-blue-100
                        hover:bg-red-500/20
                        hover:text-white
                        transition
                    "
                >

                    <LogOut size={18} />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>

    );


    return (

        <div className="
            min-h-screen
            bg-[#f5f8fc]
        ">


            {/* ================================== */}
            {/* DESKTOP SIDEBAR */}
            {/* ================================== */}

            <div className="
                hidden
                md:block
            ">

                <Sidebar />

            </div>



            {/* ================================== */}
            {/* MOBILE OVERLAY */}
            {/* ================================== */}

            {mobileMenuOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/30
                        md:hidden
                    "
                    onClick={() =>
                        setMobileMenuOpen(false)
                    }
                />

            )}



            {/* ================================== */}
            {/* MOBILE SIDEBAR */}
            {/* ================================== */}

            <div
                className={`
                    fixed
                    left-0
                    top-0
                    bottom-0
                    z-50
                    w-72
                    md:hidden
                    transition-transform
                    duration-300
                    ${
                        mobileMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                <Sidebar />

            </div>



            {/* ================================== */}
            {/* MAIN CONTENT */}
            {/* ================================== */}

            <div className="
                min-h-screen
                md:ml-64
            ">


                {/* -------------------------------- */}
                {/* MOBILE HEADER */}
                {/* -------------------------------- */}

                <div className="
                    md:hidden
                    h-16
                    bg-white
                    border-b
                    border-gray-200
                    sticky
                    top-0
                    z-30
                    flex
                    items-center
                    px-4
                ">

                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen(true)
                        }
                        className="
                            w-10
                            h-10
                            rounded-xl
                            border
                            border-gray-200
                            flex
                            items-center
                            justify-center
                            text-gray-600
                            hover:bg-gray-50
                            transition
                        "
                    >

                        <Menu size={20} />

                    </button>


                    <div className="
                        ml-3
                        flex
                        items-center
                        gap-2.5
                    ">

                        <div className="
                            w-8
                            h-8
                            rounded-lg
                            bg-blue-50
                            flex
                            items-center
                            justify-center
                            text-blue-600
                        ">

                            <HeartPulse
                                size={18}
                            />

                        </div>


                        <div>

                            <p className="
                                text-sm
                                font-semibold
                                text-gray-900
                                leading-none
                            ">
                                MediCare
                            </p>

                            <p className="
                                text-[10px]
                                text-gray-400
                                mt-1
                            ">
                                Admin Panel
                            </p>

                        </div>

                    </div>

                </div>



                {/* -------------------------------- */}
                {/* PAGE CONTENT */}
                {/* -------------------------------- */}

                <main className="
                    min-h-[calc(100vh-4rem)]
                    p-5
                    md:p-8
                    max-w-[1600px]
                    mx-auto
                ">

                    {children}

                </main>

            </div>

        </div>

    );

}


export default AdminLayout;