import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
    Search,
    CalendarDays,
    Bell,
    ShieldCheck,
    ArrowRight,
    Stethoscope,
    HeartPulse,
    UserRound,
    CheckCircle2,
    Clock3,
} from "lucide-react";


function Home() {

    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    

    const handleDoctorSearch = () => {
        if (search.trim()) {
            navigate(`/doctors?search=${encodeURIComponent(search.trim())}`);
        } else {
            navigate("/doctors");
        }
    };

    return (

        <div className="  text-gray-900">


            {/* ================================================= */}
            {/* HERO SECTION */}
            {/* ================================================= */}

            <section className="relative overflow-hidden bg-white">

                <div className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-16
                    md:py-24
                    lg:py-28
                ">

                    <div className="
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-14
                        items-center
                    ">


                        {/* Left */}

                        <div>

                            <div className="
                                inline-flex
                                items-center
                                gap-2
                                px-3 py-1.5
                                rounded-full
                                bg-blue-50
                                border border-blue-100
                                text-blue-700
                                text-sm
                                font-semibold
                                mb-6
                            ">

                                <ShieldCheck size={16} />

                                Trusted Healthcare Platform

                            </div>


                            <h1 className="
                                text-4xl
                                md:text-5xl
                                lg:text-6xl
                                font-bold
                                leading-[1.08]
                                tracking-tight
                                text-gray-900
                            ">

                                Your Health.
                                <br />

                                <span className="text-blue-600">
                                    Our Priority.
                                </span>

                            </h1>


                            <p className="
                                mt-6
                                text-base
                                md:text-lg
                                text-gray-500
                                leading-7
                                max-w-xl
                            ">

                                Find trusted doctors, book appointments,
                                manage your visits, and stay connected
                                with your healthcare team — all in one place.

                            </p>


                            <div className="
                                flex
                                flex-col
                                sm:flex-row
                                gap-3
                                mt-8
                            ">

                                <Link
                                    to="/doctors"
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        px-6 py-3.5
                                        rounded-xl
                                        bg-blue-600
                                        hover:bg-blue-700
                                        text-white
                                        font-semibold
                                        transition
                                        shadow-sm
                                    "
                                >

                                    Find a Doctor

                                    <ArrowRight size={18} />

                                </Link>


                                <Link
                                    to="/doctors"
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        px-6 py-3.5
                                        rounded-xl
                                        bg-white
                                        border border-gray-200
                                        hover:border-blue-300
                                        hover:bg-blue-50
                                        text-gray-700
                                        font-semibold
                                        transition
                                    "
                                >

                                    <CalendarDays size={18} />

                                    Book Appointment

                                </Link>

                            </div>


                            {/* Trust indicators */}

                            <div className="
                                flex
                                flex-wrap
                                gap-x-6
                                gap-y-3
                                mt-8
                                text-sm
                                text-gray-500
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <CheckCircle2
                                        size={17}
                                        className="text-green-500"
                                    />

                                    Verified Doctors

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <CheckCircle2
                                        size={17}
                                        className="text-green-500"
                                    />

                                    Easy Booking

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <CheckCircle2
                                        size={17}
                                        className="text-green-500"
                                    />

                                    Secure Account

                                </div>

                            </div>

                        </div>



                        {/* Right Visual */}

                        <div className="relative">

                            <div className="
                                relative
                                max-w-lg
                                mx-auto
                            ">

                                {/* Main visual */}

                                <div className="
                                    aspect-[4/3]
                                    rounded-[2rem]
                                    bg-blue-50
                                    border border-blue-100
                                    flex
                                    items-center
                                    justify-center
                                    overflow-hidden
                                ">

                                    <div className="
                                        w-52 h-52
                                        md:w-64 md:h-64
                                        rounded-full
                                        bg-white
                                        shadow-sm
                                        flex
                                        items-center
                                        justify-center
                                    ">

                                        <div className="
                                            w-36 h-36
                                            md:w-44 md:h-44
                                            rounded-full
                                            bg-blue-600
                                            flex
                                            items-center
                                            justify-center
                                            shadow-lg
                                        ">

                                            <Stethoscope
                                                size={76}
                                                strokeWidth={1.5}
                                                className="text-white"
                                            />

                                        </div>

                                    </div>


                                    {/* Decorative circles */}

                                    <div className="
                                        absolute
                                        top-8
                                        right-10
                                        w-5 h-5
                                        rounded-full
                                        bg-blue-200
                                    " />

                                    <div className="
                                        absolute
                                        bottom-12
                                        left-10
                                        w-8 h-8
                                        rounded-full
                                        bg-blue-200
                                    " />

                                </div>



                                {/* Appointment card */}

                                <div className="
                                    absolute
                                    -top-5
                                    -left-5
                                    md:-left-8
                                    bg-white
                                    rounded-2xl
                                    shadow-lg
                                    border border-gray-100
                                    px-4 py-3
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    <div className="
                                        w-10 h-10
                                        rounded-xl
                                        bg-green-50
                                        flex
                                        items-center
                                        justify-center
                                    ">

                                        <CheckCircle2
                                            size={21}
                                            className="text-green-600"
                                        />

                                    </div>


                                    <div>

                                        <p className="
                                            text-xs
                                            text-gray-400
                                        ">

                                            Appointment

                                        </p>

                                        <p className="
                                            text-sm
                                            font-semibold
                                            text-gray-800
                                        ">

                                            Confirmed

                                        </p>

                                    </div>

                                </div>



                                {/* Doctor card */}

                                <div className="
                                    absolute
                                    -bottom-5
                                    -right-5
                                    md:-right-8
                                    bg-white
                                    rounded-2xl
                                    shadow-lg
                                    border border-gray-100
                                    px-4 py-3
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    <div className="
                                        w-10 h-10
                                        rounded-xl
                                        bg-blue-50
                                        flex
                                        items-center
                                        justify-center
                                    ">

                                        <UserRound
                                            size={21}
                                            className="text-blue-600"
                                        />

                                    </div>


                                    <div>

                                        <p className="
                                            text-xs
                                            text-gray-400
                                        ">

                                            Healthcare

                                        </p>

                                        <p className="
                                            text-sm
                                            font-semibold
                                            text-gray-800
                                        ">

                                            Trusted Doctors

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>



            {/* ================================================= */}
            {/* SEARCH SECTION */}
            {/* ================================================= */}

            <section className="relative z-10">

                <div className="
                    max-w-6xl
                    mx-auto
                    px-6
                    mt-7
                    pb-16
                ">

                    <div className="
                        bg-white
                        rounded-2xl
                        border border-gray-200
                        shadow-sm
                        p-6
                        md:p-8
                    ">

                        <div className="mb-5">

                            <p className="
                                text-sm
                                font-semibold
                                text-blue-600
                                uppercase
                                tracking-wider
                            ">

                                Find your doctor

                            </p>

                            <h2 className="
                                text-2xl
                                font-bold
                                text-gray-900
                                mt-1
                            ">

                                Find the right doctor for you

                            </h2>

                        </div>


                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-[1fr_auto]
                            gap-3
                        ">

                            <div className="relative">

                                <Search
                                    size={20}
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                    "
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search doctors or specialization..."
                                    className="
                                        w-full
                                        pl-11 pr-4
                                        py-3.5
                                        rounded-xl
                                        border border-gray-200
                                        bg-gray-50
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                />

                            </div>


                            <Link
                                to={
                                    search.trim()
                                        ? `/doctors?search=${encodeURIComponent(search.trim())}`
                                        : "/doctors"
                                }
                                className="
                                    inline-flex
                                    justify-center
                                    items-center
                                    px-7
                                    gap-2
                                    rounded-xl
                                    py-3.5
                                    hover:bg-blue-700
                                    bg-blue-600
                                    font-semibold
                                    text-white
                                    transition
                                "
                            >
                                Search

                                <ArrowRight size={18} />

                            </Link>

                        </div>

                    </div>

                </div>

            </section>



            {/* ================================================= */}
            {/* WHY MEDICARE */}
            {/* ================================================= */}

            <section className="
                max-w-7xl
                mx-auto
                px-6
                pb-20
            ">

                <div className="text-center mb-12">

                    <p className="
                        text-sm
                        font-semibold
                        text-blue-600
                        uppercase
                        tracking-wider
                    ">

                        Why MediCare

                    </p>


                    <h2 className="
                        text-3xl
                        md:text-4xl
                        font-bold
                        text-gray-900
                        mt-2
                    ">

                        Healthcare made simpler

                    </h2>


                    <p className="
                        max-w-2xl
                        mx-auto
                        text-gray-500
                        mt-3
                    ">

                        Everything you need to manage your healthcare
                        journey in one simple platform.

                    </p>

                </div>


                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-5
                ">


                    {[
                        {
                            icon: Stethoscope,
                            title: "Trusted Doctors",
                            text: "Explore doctor profiles and find the right specialist for your needs.",
                        },
                        {
                            icon: CalendarDays,
                            title: "Easy Booking",
                            text: "Choose an available date and time slot and book your consultation easily.",
                        },
                        {
                            icon: Bell,
                            title: "Real-time Updates",
                            text: "Stay informed when your appointment is confirmed, cancelled or completed.",
                        },
                        {
                            icon: ShieldCheck,
                            title: "Secure Platform",
                            text: "Your account information is protected with role-based access.",
                        },
                    ].map((feature) => {

                        const Icon = feature.icon;

                        return (

                            <div
                                key={feature.title}
                                className="
                                    bg-white
                                    border border-gray-200
                                    rounded-2xl
                                    p-6
                                    hover:-translate-y-1
                                    hover:shadow-md
                                    transition-all
                                "
                            >

                                <div className="
                                    w-12 h-12
                                    rounded-xl
                                    bg-blue-50
                                    flex
                                    items-center
                                    justify-center
                                    mb-5
                                ">

                                    <Icon
                                        size={23}
                                        className="text-blue-600"
                                    />

                                </div>


                                <h3 className="
                                    font-bold
                                    text-lg
                                    text-gray-900
                                ">

                                    {feature.title}

                                </h3>


                                <p className="
                                    text-sm
                                    text-gray-500
                                    leading-6
                                    mt-2
                                ">

                                    {feature.text}

                                </p>

                            </div>

                        );

                    })}

                </div>

            </section>



            {/* ================================================= */}
            {/* HOW IT WORKS */}
            {/* ================================================= */}

            <section className="bg-white border-y border-gray-100">

                <div className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-20
                ">

                    <div className="text-center mb-14">

                        <p className="
                            text-sm
                            font-semibold
                            text-blue-600
                            uppercase
                            tracking-wider
                        ">

                            Simple Process

                        </p>


                        <h2 className="
                            text-3xl
                            md:text-4xl
                            font-bold
                            text-gray-900
                            mt-2
                        ">

                            How MediCare works

                        </h2>

                    </div>


                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-10
                    ">


                        {[
                            {
                                number: "01",
                                icon: Search,
                                title: "Find a Doctor",
                                text: "Browse available doctors and choose a specialist that fits your needs.",
                            },
                            {
                                number: "02",
                                icon: CalendarDays,
                                title: "Choose a Slot",
                                text: "Select an available date and time that works best for you.",
                            },
                            {
                                number: "03",
                                icon: Stethoscope,
                                title: "Get Care",
                                text: "Attend your appointment and stay connected with your care team.",
                            },
                        ].map((step) => {

                            const Icon = step.icon;

                            return (

                                <div
                                    key={step.number}
                                    className="
                                        relative
                                        text-center
                                    "
                                >

                                    <div className="
                                        w-16 h-16
                                        mx-auto
                                        rounded-2xl
                                        bg-blue-600
                                        text-white
                                        flex
                                        items-center
                                        justify-center
                                        shadow-sm
                                    ">

                                        <Icon size={27} />

                                    </div>


                                    <p className="
                                        text-xs
                                        font-bold
                                        text-blue-600
                                        tracking-widest
                                        mt-5
                                    ">

                                        STEP {step.number}

                                    </p>


                                    <h3 className="
                                        text-xl
                                        font-bold
                                        text-gray-900
                                        mt-2
                                    ">

                                        {step.title}

                                    </h3>


                                    <p className="
                                        text-sm
                                        text-gray-500
                                        leading-6
                                        max-w-xs
                                        mx-auto
                                        mt-2
                                    ">

                                        {step.text}

                                    </p>

                                </div>

                            );

                        })}

                    </div>

                </div>

            </section>



            {/* ================================================= */}
            {/* DOCTOR CTA */}
            {/* ================================================= */}

            <section className="
                max-w-7xl
                mx-auto
                px-6
                py-20
            ">

                <div className="
                    rounded-3xl
                    bg-blue-600
                    px-7
                    md:px-12
                    py-12
                    md:py-14
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-8
                    overflow-hidden
                    relative
                ">


                    <div className="
                        absolute
                        -right-20
                        -top-20
                        w-64 h-64
                        rounded-full
                        bg-white/10
                    " />


                    <div className="relative">

                        <div className="
                            inline-flex
                            items-center
                            gap-2
                            text-blue-100
                            text-sm
                            font-semibold
                        ">

                            <Stethoscope size={18} />

                            For Healthcare Professionals

                        </div>


                        <h2 className="
                            text-2xl
                            md:text-3xl
                            font-bold
                            text-white
                            mt-3
                        ">

                            Manage your appointments with ease.

                        </h2>


                        <p className="
                            text-blue-100
                            mt-2
                            max-w-xl
                        ">

                            Manage your availability, appointments and
                            patient visits from one convenient dashboard.

                        </p>

                    </div>


                    <Link
                        to="/register"
                        className="
                            relative
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            bg-white
                            text-blue-600
                            hover:bg-blue-50
                            px-6 py-3
                            rounded-xl
                            font-semibold
                            transition
                            whitespace-nowrap
                        "
                    >

                        Join MediCare

                        <ArrowRight size={18} />

                    </Link>

                </div>

            </section>



            {/* ================================================= */}
            {/* FINAL CTA */}
            {/* ================================================= */}

            <section className="bg-white border-t border-gray-100">

                <div className="
                    max-w-4xl
                    mx-auto
                    px-6
                    py-20
                    text-center
                ">

                    <div className="
                        mx-auto
                        w-14 h-14
                        rounded-2xl
                        bg-blue-50
                        flex
                        items-center
                        justify-center
                    ">

                        <HeartIcon />

                    </div>


                    <h2 className="
                        text-3xl
                        md:text-4xl
                        font-bold
                        text-gray-900
                        mt-5
                    ">

                        Your health matters.

                    </h2>


                    <p className="
                        text-gray-500
                        mt-3
                    ">

                        Take the first step toward easier healthcare.

                    </p>


                    <Link
                        to="/doctors"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            mt-7
                            px-7 py-3.5
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            font-semibold
                            transition
                        "
                    >

                        Find a Doctor

                        <ArrowRight size={18} />

                    </Link>

                </div>

            </section>


        </div>

    );

}


function HeartIcon() {

    return (

        <svg
            width="27"
            height="27"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-600"
        >

            <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
            />

        </svg>

    );

}


export default Home;