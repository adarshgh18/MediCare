import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

import {
    Users,
    UserRound,
    CalendarDays,
    Clock,
    ChevronRight,
    Stethoscope,
    CheckCircle2,
    XCircle,
    Timer,
    UserPlus,
    Activity,
    Hand,
    HeartPulse ,
} from "lucide-react";



function AdminDashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(false);


    // =====================================================
    // FETCH DASHBOARD
    // =====================================================

    const fetchDashboard = async () => {

        try {

            setLoading(true);

            setError(false);


            const response =
                await api.get(
                    "/admin/dashboard"
                );


            setStats(
                response.data.stats
            );

        }

        catch (err) {

            console.error(
                "Failed to fetch admin dashboard:",
                err
            );

            setError(true);

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchDashboard();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="
                min-h-[500px]
                flex
                items-center
                justify-center
            ">

                <p className="
                    text-sm
                    text-gray-500
                ">

                    Loading dashboard...

                </p>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !stats) {

        return (

            <div className="
                min-h-[500px]
                flex
                items-center
                justify-center
                px-4
            ">

                <div className="
                    w-full
                    max-w-md
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    p-8
                    text-center
                ">

                    <h2 className="
                        text-xl
                        font-semibold
                        text-gray-800
                    ">

                        Unable to load dashboard

                    </h2>


                    <p className="
                        text-sm
                        text-gray-500
                        mt-2
                    ">

                        Please try again.

                    </p>


                    <button
                        onClick={fetchDashboard}
                        className="
                            mt-5
                            px-5
                            py-2.5
                            rounded-lg
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            text-sm
                            font-medium
                            transition
                        "
                    >

                        Try Again

                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // DATA
    // =====================================================

    const {

        totalPatients,

        totalDoctors,

        totalAppointments,

        appointments,

        appointmentTrend,

        todaysAppointments,

        topSpecializations,

        othersSpecialization,

        recentAppointments,

        newRegistrations,

        platformInsights,

    } = stats;


    // =====================================================
    // TODAY'S DATE
    // =====================================================

    const todayText =
        new Date().toLocaleDateString(
            "en-US",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );


    // =====================================================
    // TREND MAX
    // =====================================================

    const maxTrend =
        Math.max(
            ...(appointmentTrend || [])
                .map(
                    (item) =>
                        item.count
                ),
            1
        );


    // =====================================================
    // DONUT
    // =====================================================

    const totalStatus =
        appointments.pending +
        appointments.confirmed +
        appointments.completed +
        appointments.cancelled;


    const donutStyle = {

        background: !totalStatus
            ? "#e5e7eb"
            : (() => {

                const pending =
                    (appointments.pending / totalStatus) * 100;

                const confirmed =
                    (appointments.confirmed / totalStatus) * 100;

                const completed =
                    (appointments.completed / totalStatus) * 100;

                const first = pending;

                const second =
                    first + confirmed;

                const third =
                    second + completed;

                return `
                conic-gradient(
                    #f59e0b 0% ${first}%,
                    #3b82f6 ${first}% ${second}%,
                    #22c55e ${second}% ${third}%,
                    #ef4444 ${third}% 100%
                )
            `;

            })(),

    };

    // =====================================================
    // HELPERS
    // =====================================================

    const formatDate =
        (date) => {

            if (!date) {
                return "";
            }

            return new Date(
                date
            ).toLocaleDateString(
                "en-US",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );

        };


    const formatTime =
        (timeSlot) => {

            if (!timeSlot) {

                return "Time not available";

            }

            return timeSlot;

        };


    const getDoctorName =
        (appointment) => {

            return (
                appointment?.doctor?.user
                    ?.fullName ||
                "Doctor"
            );

        };


    const getPatientName =
        (appointment) => {

            return (
                appointment?.patient
                    ?.fullName ||
                "Patient"
            );

        };


    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusClass =
        (status) => {

            switch (status) {

                case "Confirmed":

                    return `
                        bg-green-50
                        text-green-600
                    `;

                case "Completed":

                    return `
                        bg-blue-50
                        text-blue-600
                    `;

                case "Cancelled":

                    return `
                        bg-red-50
                        text-red-600
                    `;

                default:

                    return `
                        bg-amber-50
                        text-amber-600
                    `;

            }

        };


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="
            space-y-6
        ">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="
                flex
                items-center
                justify-between
            ">

                <div>

                    <h1 className="
                        text-2xl
                        whitespace-nowrap
                        font-bold
                        text-gray-900
                        mt-1
                        flex
                        items-center
                        gap-2
                    ">

                        <span>
                            Good morning, Admin
                        </span>

                        <Stethoscope   
                            size={20}
                            strokeWidth={2.5}
                            className="text-blue-600 "
                        />

                    </h1>

                    <p className="
                        text-sm
                        text-gray-400
                    ">

                        Here's what's happening
                        with MediCare today.

                    </p>

                </div>


                {/* DATE ONLY */}

                <div className="
                    hidden
                    sm:flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    text-sm
                    text-gray-600
                ">

                    <CalendarDays
                        size={16}
                        className="
                            text-blue-600
                        "
                    />

                    {todayText}

                </div>

            </div>



            {/* ================================================= */}
            {/* STAT CARDS */}
            {/* ================================================= */}

            <div className="
                grid
                grid-cols-2
                xl:grid-cols-5
                gap-4
            ">


                {/* PATIENTS */}

                <StatCard
                    title="Total Patients"
                    value={totalPatients}
                    subtitle="Registered patients"
                    icon={<Users size={19} />}
                />


                {/* DOCTORS */}

                <StatCard
                    title="Total Doctors"
                    value={totalDoctors}
                    subtitle="Active doctors"
                    icon={<UserRound size={19} />}
                />


                {/* APPOINTMENTS */}

                <StatCard
                    title="Total Appointments"
                    value={totalAppointments}
                    subtitle="All appointments"
                    icon={<CalendarDays size={19} />}
                />


                {/* TODAY */}

                <StatCard
                    title="Today's Appointments"
                    value={
                        todaysAppointments.length
                    }
                    subtitle="Upcoming today"
                    icon={<Clock size={19} />}
                />


                {/* COMPLETION */}

                <StatCard
                    title="Completion Rate"
                    value={`${platformInsights.completedRate}%`}
                    subtitle="Completed appointments"
                    icon={<CheckCircle2 size={19} />}
                />

            </div>



            {/* ================================================= */}
            {/* CHART ROW */}
            {/* ================================================= */}

            <div className="
                grid
                grid-cols-1
                xl:grid-cols-[2fr_1fr]
                gap-5
            ">


                {/* ================================================= */}
                {/* APPOINTMENT TREND */}
                {/* ================================================= */}

                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    p-5
                    h-[300px]
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                    ">

                        <div>

                            <h2 className="
                                text-lg
                                font-bold
                                text-gray-900
                            ">

                                Appointment Trend

                            </h2>

                            <p className="
                                text-xs
                                text-gray-400
                                mt-1
                            ">

                                Last 7 days overview

                            </p>

                        </div>


                        <div className="
                            px-3
                            py-1.5
                            bg-gray-50
                            border
                            border-gray-100
                            rounded-lg
                            text-xs
                            text-gray-500
                        ">

                            Last 7 days

                        </div>

                    </div>


                    {/* BAR CHART */}

                    <div className="
                        h-[205px]
                        mt-5
                        flex
                        items-end
                        justify-between
                        gap-3
                    ">

                        {appointmentTrend.map(
                            (item) => {

                                const height =
                                    item.count === 0
                                        ? 4
                                        : Math.max(
                                            (
                                                item.count /
                                                maxTrend
                                            ) * 175,
                                            8
                                        );

                                return (

                                    <div
                                        key={item.date}
                                        className="
                                            flex
                                            flex-1
                                            h-full
                                            flex-col
                                            justify-end
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <div className="
                                            text-[10px]
                                            text-gray-400
                                        ">

                                            {item.count}

                                        </div>


                                        <div
                                            className="
                                                w-full
                                                max-w-[34px]
                                                rounded-t-lg
                                                bg-blue-500
                                                transition-all
                                            "
                                            style={{
                                                height: `${height}px`,
                                            }}
                                        />


                                        <span className="
                                            text-[10px]
                                            text-gray-400
                                        ">

                                            {item.day}

                                        </span>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </div>



                {/* ================================================= */}
                {/* APPOINTMENT STATUS */}
                {/* ================================================= */}

                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    p-5
                    h-[300px]
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                    ">

                        <div>

                            <h2 className="
                                text-lg
                                font-bold
                                text-gray-900
                            ">

                                Appointment Status

                            </h2>

                            <p className="
                                text-xs
                                text-gray-400
                                mt-1
                            ">

                                Current distribution

                            </p>

                        </div>


                        <Activity
                            size={20}
                            className="
                                text-gray-400
                            "
                        />

                    </div>


                    <div className="
                        flex
                        items-center
                        justify-center
                        gap-7
                        mt-5
                    ">


                        {/* DONUT */}

                        <div className="
                            relative
                            w-32
                            h-32
                            shrink-0
                        ">

                            <div
                                className="
                                    w-full
                                    h-full
                                    rounded-full
                                "
                                style={
                                    donutStyle
                                }
                            />

                            <div className="
                                absolute
                                inset-[14px]
                                bg-white
                                rounded-full
                                flex
                                flex-col
                                items-center
                                justify-center
                            ">

                                <span className="
                                    text-2xl
                                    font-bold
                                    text-gray-900
                                ">

                                    {totalStatus}

                                </span>

                                <span className="
                                    text-[10px]
                                    text-gray-400
                                ">

                                    Total

                                </span>

                            </div>

                        </div>


                        {/* LEGEND */}

                        <div className="
                            space-y-3
                            min-w-[120px]
                        ">

                            <StatusLegend
                                color="bg-amber-500"
                                label="Pending"
                                value={
                                    appointments.pending
                                }
                            />

                            <StatusLegend
                                color="bg-blue-500"
                                label="Confirmed"
                                value={
                                    appointments.confirmed
                                }
                            />

                            <StatusLegend
                                color="bg-green-500"
                                label="Completed"
                                value={
                                    appointments.completed
                                }
                            />

                            <StatusLegend
                                color="bg-red-500"
                                label="Cancelled"
                                value={
                                    appointments.cancelled
                                }
                            />

                        </div>

                    </div>

                </div>

            </div>



            {/* ================================================= */}
            {/* TODAY + TOP SPECIALIZATION + RECENT */}
            {/* ================================================= */}

            <div className="
                grid
                grid-cols-1
                xl:grid-cols-[1.1fr_1.1fr_1.2fr]
                gap-5
            ">


                {/* ================================================= */}
                {/* TODAY'S SCHEDULE */}
                {/* ================================================= */}

                <div className="
                    bg-white
                    flex-col
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    p-5
                    h-[480px]
                    flex
                ">

                    {/* HEADER */}

                    <div className="
                        flex
                        items-start
                        justify-between
                        shrink-0
                    ">

                        <div>

                            <h2 className="
                                text-lg
                                font-bold
                                text-gray-900
                            ">

                                Today's Schedule

                            </h2>

                            <p className="
                                text-xs
                                text-gray-400
                                mt-1
                            ">

                                Upcoming appointments

                            </p>

                        </div>


                        <CalendarDays
                            size={18}
                            className="
                                text-blue-500
                            "
                        />

                    </div>


                    {/* SMALL STATS */}

                    <div className="
                        grid
                        shrink-0
                        grid-cols-3
                        gap-2
                        mt-5
                    ">

                        <MiniStat
                            label="Total"
                            value={
                                todaysAppointments.length
                            }
                        />

                        <MiniStat
                            label="Completed"
                            value={
                                todaysAppointments.filter(
                                    (item) =>
                                        item.status ===
                                        "Completed"
                                ).length
                            }
                        />

                        <MiniStat
                            label="Pending"
                            value={
                                todaysAppointments.filter(
                                    (item) =>
                                        item.status ===
                                        "Pending"
                                ).length
                            }
                        />

                    </div>


                    {/* SCROLLABLE LIST */}

                    <div className="
                        mt-4
                        scrollbar-thin
                        flex-1
                        min-h-0
                        overflow-y-auto
                        pr-2
                        space-y-2
                    ">

                        {todaysAppointments.length === 0 ? (

                            <EmptyState
                                text="No appointments scheduled today."
                            />

                        ) : (

                            todaysAppointments.map(
                                (appointment) => (

                                    <div
                                        key={
                                            appointment._id
                                        }
                                        className="
                                            flex
                                            transition
                                            items-center
                                            gap-3
                                            p-3
                                            rounded-xl
                                            hover:bg-gray-50
                                        "
                                    >

                                        {/* PATIENT ICON */}

                                        <div className="
                                            w-9
                                            shrink-0
                                            h-9
                                            rounded-full
                                            bg-blue-50
                                            text-blue-600
                                            flex
                                            items-center
                                            justify-center
                                        ">

                                            <UserRound
                                                size={17}
                                            />

                                        </div>


                                        {/* PATIENT + DOCTOR */}

                                        <div className="
                                            min-w-0
                                            flex-1
                                        ">

                                            <p className="
                                                text-sm
                                                truncate
                                                font-medium
                                                text-gray-800
                                            ">

                                                {
                                                    getPatientName(
                                                        appointment
                                                    )
                                                }

                                            </p>

                                            <p className="
                                                text-[11px]
                                                text-gray-400
                                                truncate
                                            ">

                                                Dr.{" "}
                                                {
                                                    getDoctorName(
                                                        appointment
                                                    )
                                                }

                                            </p>

                                        </div>


                                        {/* TIME + STATUS */}

                                        <div className="
                                            text-right
                                            shrink-0
                                        ">

                                            <p className="
                                                text-[11px]
                                                font-medium
                                                text-gray-600
                                            ">

                                                {
                                                    formatTime(
                                                        appointment.timeSlot
                                                    )
                                                }

                                            </p>


                                            <span className={`
                                                inline-block
                                                font-medium
                                                mt-1
                                                px-2
                                                py-0.5
                                                rounded-full
                                                text-[9px]
                                                ${getStatusClass(
                                                    appointment.status
                                                )}
                                            `}>

                                                {
                                                    appointment.status
                                                }

                                            </span>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>



                {/* ================================================= */}
                {/* TOP SPECIALIZATIONS */}
                {/* ================================================= */}

                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    p-5
                    h-[480px]
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                    ">

                        <div>

                            <h2 className="
                                text-lg
                                font-bold
                                text-gray-900
                            ">

                                Top Specializations

                            </h2>

                            <p className="
                                text-xs
                                text-gray-400
                                mt-1
                            ">

                                Based on doctors

                            </p>

                        </div>


                        <span className="
                            text-xs
                            font-medium
                            text-blue-600
                        ">

                            Top 4

                        </span>

                    </div>


                    <div className="
                        mt-7
                        space-y-7
                    ">

                        {topSpecializations.map(
                            (item, index) => {

                                const max =
                                    topSpecializations[0]
                                        ?.count || 1;

                                const width =
                                    Math.max(
                                        (
                                            item.count /
                                            max
                                        ) * 100,
                                        8
                                    );


                                return (

                                    <SpecializationRow
                                        key={
                                            item.name
                                        }
                                        icon={
                                            <Stethoscope
                                                size={17}
                                            />
                                        }
                                        name={
                                            item.name
                                        }
                                        count={
                                            item.count
                                        }
                                        width={
                                            width
                                        }
                                    />

                                );

                            }
                        )}


                        {/* OTHERS */}

                        {othersSpecialization.count > 0 && (

                            <SpecializationRow
                                icon={
                                    <Activity
                                        size={17}
                                    />
                                }
                                name="Others"
                                count={
                                    othersSpecialization.count
                                }
                                width={100}
                            />

                        )}

                    </div>

                </div>



                {/* ================================================= */}
                {/* RECENT APPOINTMENTS */}
                {/* ================================================= */}

                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    p-5
                    h-[480px]
                    flex
                    flex-col
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                        shrink-0
                    ">

                        <div>

                            <h2 className="
                                text-lg
                                font-bold
                                text-gray-900
                            ">

                                Recent Appointments

                            </h2>

                            <p className="
                                text-xs
                                text-gray-400
                                mt-1
                            ">

                                Latest appointment activity

                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/appointments"
                                )
                            }
                            className="
                                flex
                                items-center
                                gap-1
                                text-xs
                                font-medium
                                text-blue-600
                                hover:text-blue-700
                            "
                        >

                            View all

                            <ChevronRight
                                size={14}
                            />

                        </button>

                    </div>


                    {/* SCROLLABLE */}

                    <div className="
                        mt-5
                        flex-1
                        min-h-0
                        overflow-y-auto
                        pr-2
                        pb-2
                        scrollbar-thin
                    ">

                        {recentAppointments.length === 0 ? (

                            <EmptyState
                                text="No recent appointments."
                            />

                        ) : (

                            recentAppointments.map(
                                (appointment) => (

                                    <div
                                        key={
                                            appointment._id
                                        }
                                        className="
                                            py-3.5
                                            border-b
                                            border-gray-100
                                            last:border-0
                                        "
                                    >

                                        <div className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                        ">

                                            <div className="
                                                min-w-0
                                            ">

                                                <p className="
                                                    text-sm
                                                    font-medium
                                                    text-gray-800
                                                    truncate
                                                ">

                                                    {
                                                        getPatientName(
                                                            appointment
                                                        )
                                                    }

                                                </p>


                                                <p className="
                                                    text-[11px]
                                                    text-gray-400
                                                    mt-0.5
                                                    truncate
                                                ">

                                                    Dr.{" "}
                                                    {
                                                        getDoctorName(
                                                            appointment
                                                        )
                                                    }

                                                </p>


                                                {/* DATE + TIME */}

                                                <p className="
                                                    text-[10px]
                                                    text-gray-400
                                                    mt-1.5
                                                ">

                                                    {
                                                        formatDate(
                                                            appointment.appointmentDate
                                                        )
                                                    }

                                                    {" • "}

                                                    {
                                                        formatTime(
                                                            appointment.timeSlot
                                                        )
                                                    }

                                                </p>

                                            </div>


                                            <span className={`
                                                shrink-0
                                                px-2.5
                                                py-1
                                                rounded-lg
                                                text-[9px]
                                                font-medium
                                                ${getStatusClass(
                                                    appointment.status
                                                )}
                                            `}>

                                                {
                                                    appointment.status
                                                }

                                            </span>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>

            </div>



            {/* ================================================= */}
            {/* NEW REGISTRATIONS + PLATFORM INSIGHTS */}
            {/* ================================================= */}

            <div className="
                grid
                grid-cols-1
                xl:grid-cols-2
                gap-5
            ">


                {/* ================================================= */}
                {/* NEW REGISTRATIONS */}
                {/* ================================================= */}

                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    p-5
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                    ">

                        <div>

                            <h2 className="
                                text-lg
                                font-bold
                                text-gray-900
                            ">

                                New Registrations

                            </h2>

                            <p className="
                                text-xs
                                text-gray-400
                                mt-1
                            ">

                                Recently registered patients

                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/patients"
                                )
                            }
                            className="
                                flex
                                items-center
                                gap-1
                                text-xs
                                font-medium
                                text-blue-600
                                hover:text-blue-700
                            "
                        >

                            View all

                            <ChevronRight
                                size={14}
                            />

                        </button>

                    </div>


                    <div className="
                        grid
                        grid-cols-2
                        sm:grid-cols-4
                        gap-3
                        mt-5
                    ">

                        {newRegistrations.map(
                            (patient) => (

                                <button
                                    key={
                                        patient._id
                                    }
                                    onClick={() =>
                                        navigate(
                                            `/admin/patients/${patient._id}`
                                        )
                                    }
                                    className="
                                        text-left
                                        p-3
                                        rounded-xl
                                        border
                                        border-gray-100
                                        hover:border-blue-200
                                        hover:bg-blue-50/40
                                        transition
                                    "
                                >

                                    <div className="
                                        w-9
                                        h-9
                                        rounded-full
                                        bg-blue-50
                                        text-blue-600
                                        flex
                                        items-center
                                        justify-center
                                        mb-2
                                    ">

                                        <UserPlus
                                            size={17}
                                        />

                                    </div>


                                    <p className="
                                        text-xs
                                        font-medium
                                        text-gray-800
                                        truncate
                                    ">

                                        {
                                            patient.fullName
                                        }

                                    </p>


                                    <p className="
                                        text-[9px]
                                        text-gray-400
                                        mt-1
                                    ">

                                        {
                                            formatDate(
                                                patient.createdAt
                                            )
                                        }

                                    </p>

                                </button>

                            )
                        )}

                    </div>

                </div>



                {/* ================================================= */}
                {/* PLATFORM INSIGHTS */}
                {/* ================================================= */}

                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-sm
                    p-5
                ">

                    <div className="
                        flex
                        items-start
                        justify-between
                    ">

                        <div>

                            <h2 className="
                                text-lg
                                font-bold
                                text-gray-900
                            ">

                                Platform Insights

                            </h2>

                            <p className="
                                text-xs
                                text-gray-400
                                mt-1
                            ">

                                Key operational metrics

                            </p>

                        </div>


                        <Activity
                            size={18}
                            className="
                                text-blue-500
                            "
                        />

                    </div>


                    <div className="
                        grid
                        grid-cols-2
                        sm:grid-cols-4
                        gap-3
                        mt-5
                    ">


                        <InsightCard
                            icon={
                                <CheckCircle2
                                    size={17}
                                />
                            }
                            label="Completion"
                            value={`${platformInsights.completedRate}%`}
                        />


                        <InsightCard
                            icon={
                                <XCircle
                                    size={17}
                                />
                            }
                            label="Cancelled"
                            value={`${platformInsights.cancellationRate}%`}
                        />


                        <InsightCard
                            icon={
                                <Timer
                                    size={17}
                                />
                            }
                            label="Pending"
                            value={`${platformInsights.pendingRate}%`}
                        />


                        <InsightCard
                            icon={
                                <Users
                                    size={17}
                                />
                            }
                            label="Patients / Doctor"
                            value={
                                platformInsights
                                    .doctorPatientRatio
                            }
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
    title,
    value,
    subtitle,
    icon,
}) {

    return (

        <div className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            shadow-sm
            p-4
        ">

            <div className="
                flex
                items-start
                justify-between
            ">

                <div>

                    <p className="
                        text-xs
                        text-gray-500
                    ">

                        {title}

                    </p>


                    <p className="
                        text-2xl
                        font-bold
                        text-gray-900
                        mt-1
                    ">

                        {value}

                    </p>


                    <p className="
                        text-[10px]
                        text-gray-400
                        mt-1
                    ">

                        {subtitle}

                    </p>

                </div>


                <div className="
                    w-9
                    h-9
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    flex
                    items-center
                    justify-center
                ">

                    {icon}

                </div>

            </div>

        </div>

    );

}


// =====================================================
// STATUS LEGEND
// =====================================================

function StatusLegend({
    color,
    label,
    value,
}) {

    return (

        <div className="
            flex
            items-center
            justify-between
            gap-4
        ">

            <div className="
                flex
                items-center
                gap-2
            ">

                <span className={`
                    w-2
                    h-2
                    rounded-full
                    ${color}
                `} />

                <span className="
                    text-xs
                    text-gray-500
                ">

                    {label}

                </span>

            </div>


            <span className="
                text-xs
                font-semibold
                text-gray-700
            ">

                {value}

            </span>

        </div>

    );

}


// =====================================================
// MINI STAT
// =====================================================

function MiniStat({
    label,
    value,
}) {

    return (

        <div className="
            rounded-xl
            bg-gray-50
            p-3
            text-center
        ">

            <p className="
                text-[9px]
                text-gray-400
            ">

                {label}

            </p>


            <p className="
                text-lg
                font-bold
                text-gray-800
                mt-0.5
            ">

                {value}

            </p>

        </div>

    );

}


// =====================================================
// SPECIALIZATION ROW
// =====================================================

function SpecializationRow({
    icon,
    name,
    count,
    width,
}) {

    return (

        <div>

            <div className="
                flex
                items-center
                justify-between
                mb-2
            ">

                <div className="
                    flex
                    items-center
                    gap-2.5
                    min-w-0
                ">

                    <div className="
                        w-8
                        h-8
                        rounded-lg
                        bg-blue-50
                        text-blue-600
                        flex
                        items-center
                        justify-center
                        shrink-0
                    ">

                        {icon}

                    </div>


                    <span className="
                        text-sm
                        font-medium
                        text-gray-700
                        truncate
                    ">

                        {name}

                    </span>

                </div>


                <span className="
                    text-xs
                    text-gray-500
                ">

                    {count}

                </span>

            </div>


            <div className="
                h-1.5
                bg-gray-100
                rounded-full
                overflow-hidden
            ">

                <div
                    className="
                        h-full
                        bg-blue-500
                        rounded-full
                        transition-all
                    "
                    style={{
                        width: `${width}%`,
                    }}
                />

            </div>

        </div>

    );

}


// =====================================================
// INSIGHT CARD
// =====================================================

function InsightCard({
    icon,
    label,
    value,
}) {

    return (

        <div className="
            rounded-xl
            bg-gray-50
            border
            border-gray-100
            p-3
        ">

            <div className="
                flex
                items-center
                gap-2
                text-blue-600
            ">

                {icon}

                <span className="
                    text-[10px]
                    text-gray-500
                ">

                    {label}

                </span>

            </div>


            <p className="
                text-xl
                font-bold
                text-gray-800
                mt-2
            ">

                {value}

            </p>

        </div>

    );

}


// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({
    text,
}) {

    return (

        <div className="
            h-full
            flex
            items-center
            justify-center
            text-center
            px-4
        ">

            <div>

                <CalendarDays
                    size={25}
                    className="
                        mx-auto
                        text-gray-300
                    "
                />

                <p className="
                    text-xs
                    text-gray-400
                    mt-2
                ">

                    {text}

                </p>

            </div>

        </div>

    );

}


export default AdminDashboard;