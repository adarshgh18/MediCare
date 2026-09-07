import { useEffect, useState } from "react";

import {
    CalendarDays,
    Search,
    Trash2,
    UserRound,
    Stethoscope,
    Clock,
    X,
} from "lucide-react";

import api from "../../services/api";
import ServerError from "../common/ServerError";
import Pagination from "../common/Pagination";

import { getApiErrorMessage } from "../../services/apiError";

import toast from "react-hot-toast";


function AdminAppointments() {

    // ----------------------------------
    // State
    // ----------------------------------

    const [appointments, setAppointments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [serverError, setServerError] =
        useState(false);


    const [currentPage, setCurrentPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalAppointments, setTotalAppointments] =
        useState(0);


    // ----------------------------------
    // Filters
    // ----------------------------------

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("All");

    const [dateFilter, setDateFilter] =
        useState("all");


    // ----------------------------------
    // Fetch appointments
    // ----------------------------------

    const fetchAppointments = async (
        page = currentPage
    ) => {

        try {

            setLoading(true);

            setServerError(false);


            const params = {

                page,

                limit: 10,

            };


            // Status filter

            if (
                status &&
                status !== "All"
            ) {

                params.status = status;

            }


            // Date filter

            if (
                dateFilter &&
                dateFilter !== "all"
            ) {

                params.date = dateFilter;

            }


            // Search

            if (search.trim()) {

                params.search =
                    search.trim();

            }


            const response =
                await api.get(
                    "/admin/appointments",
                    {
                        params,
                    }
                );


            setAppointments(
                response.data.appointments || []
            );


            setCurrentPage(
                response.data.currentPage || page
            );


            setTotalPages(
                response.data.totalPages || 1
            );


            setTotalAppointments(
                response.data.totalAppointments || 0
            );

        }

        catch (err) {

            console.error(
                "Failed to fetch admin appointments:",
                err
            );


            // ----------------------------------
            // Backend unavailable
            // ----------------------------------

            if (!err.response) {

                setServerError(true);

                return;

            }


            toast.error(
                getApiErrorMessage(
                    err,
                    "Unable to load appointments."
                )
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ----------------------------------
    // Initial fetch
    // ----------------------------------

    useEffect(() => {

        fetchAppointments(1);

    }, [status, dateFilter]);


    // ----------------------------------
    // Search
    // ----------------------------------

    const handleSearch = (event) => {

        event.preventDefault();

        setCurrentPage(1);

        fetchAppointments(1);

    };


    // ----------------------------------
    // Clear filters
    // ----------------------------------

    const handleClearFilters = () => {

        setSearch("");

        setStatus("All");

        setDateFilter("all");

        setCurrentPage(1);

    };


    // ----------------------------------
    // Pagination
    // ----------------------------------

    const handlePageChange = (page) => {

        setCurrentPage(page);

        fetchAppointments(page);

    };


    // ----------------------------------
    // Delete appointment
    // ----------------------------------

    const handleDeleteAppointment = async ( appointmentId ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to remove this appointment?"
            );


        if (!confirmed) {

            return;

        }


        try {

            await api.delete(
                `/admin/appointments/${appointmentId}`
            );


            toast.success(
                "Appointment removed successfully."
            );


            // ----------------------------------
            // Remove from current state
            // ----------------------------------

            setAppointments(
                (currentAppointments) =>
                    currentAppointments.filter(
                        (appointment) =>
                            appointment._id !== appointmentId
                    )
            );


            setTotalAppointments(
                (previousTotal) =>
                    Math.max(
                        previousTotal - 1,
                        0
                    )
            );


            // ----------------------------------
            // If current page becomes empty
            // ----------------------------------

            if (
                appointments.length === 1 &&
                currentPage > 1
            ) {

                const previousPage =
                    currentPage - 1;

                setCurrentPage( previousPage );
                fetchAppointments( previousPage );

            }

            else {
                fetchAppointments( currentPage );
            }

        }

        catch (err) {

            console.error(
                "Failed to delete appointment:",
                err
            );


            toast.error(
                getApiErrorMessage(
                    err,
                    "Failed to remove appointment."
                )
            );

        }

    };


    // ----------------------------------
    // Server error
    // ----------------------------------

    if (serverError) {

        return (

            <ServerError
                onRetry={() =>
                    fetchAppointments(
                        currentPage
                    )
                }
            />

        );

    }


    // ----------------------------------
    // Loading
    // ----------------------------------

    if (loading) {

        return (

            <div className="p-6 md:p-8">

                <p className="text-gray-500">
                    Loading appointments...
                </p>

            </div>

        );

    }


    return (

        <div className="p-6 md:p-8">

            {/* ================================= */}
            {/* Header */}
            {/* ================================= */}

            <div className="mb-8">

                <p className="
                    text-sm
                    font-semibold
                    text-blue-600
                ">
                    Administration
                </p>


                <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-end
                    md:justify-between
                    gap-3
                ">

                    <div>

                        <h1 className="
                            text-3xl
                            font-bold
                            text-gray-900
                            mt-1
                        ">
                            Appointments
                        </h1>


                        <p className="
                            text-gray-500
                            mt-2
                        ">
                            Manage and monitor all
                            patient appointments.
                        </p>

                    </div>


                    <div className="
                        text-sm
                        text-gray-500
                    ">

                        Total:
                        <span className="
                            ml-1
                            font-semibold
                            text-gray-800
                        ">

                            {totalAppointments}

                        </span>

                    </div>

                </div>

            </div>


            {/* ================================= */}
            {/* Filters */}
            {/* ================================= */}

            <div className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-4
                mb-6
                shadow-sm
            ">

                <form
                    onSubmit={handleSearch}
                    className="
                        flex
                        flex-col
                        lg:flex-row
                        gap-3
                    "
                >

                    {/* Search */}

                    <div className="
                        relative
                        flex-1
                    ">

                        <Search
                            size={18}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="
                                Search patient or doctor...
                            "
                            className="
                                w-full
                                pl-10
                                pr-4
                                py-2.5
                                rounded-xl
                                border
                                border-gray-200
                                text-sm
                                text-gray-700
                                outline-none
                                focus:border-blue-400
                                focus:ring-2
                                focus:ring-blue-50
                            "
                        />

                    </div>


                    {/* Status */}

                    <select
                        value={status}
                        onChange={(event) => {

                            setStatus(
                                event.target.value
                            );

                            setCurrentPage(1);

                        }}
                        className="
                            px-4
                            py-2.5
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-sm
                            text-gray-700
                            outline-none
                            focus:border-blue-400
                        "
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Confirmed">
                            Confirmed
                        </option>

                        <option value="Completed">
                            Completed
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>

                    </select>


                    {/* Date */}

                    <select
                        value={dateFilter}
                        onChange={(event) => {

                            setDateFilter(
                                event.target.value
                            );

                            setCurrentPage(1);

                        }}
                        className="
                            px-4
                            py-2.5
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-sm
                            text-gray-700
                            outline-none
                            focus:border-blue-400
                        "
                    >

                        <option value="all">
                            All Dates
                        </option>

                        <option value="today">
                            Today
                        </option>

                        <option value="upcoming">
                            Upcoming
                        </option>

                        <option value="past">
                            Past
                        </option>

                    </select>


                    {/* Search Button */}

                    <button
                        type="submit"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-2.5
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            text-sm
                            font-semibold
                            transition
                        "
                    >

                        <Search size={16} />

                        Search

                    </button>


                    {/* Clear */}

                    {(search ||
                        status !== "All" ||
                        dateFilter !== "all") && (

                        <button
                            type="button"
                            onClick={
                                handleClearFilters
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                hover:bg-gray-50
                                text-gray-600
                                text-sm
                                font-medium
                                transition
                            "
                        >

                            <X size={16} />

                            Clear

                        </button>

                    )}

                </form>

            </div>


            {/* ================================= */}
            {/* Empty State */}
            {/* ================================= */}

            {appointments.length === 0 ? (

                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    p-10
                    text-center
                ">

                    <CalendarDays
                        size={34}
                        className="
                            mx-auto
                            text-gray-300
                            mb-3
                        "
                    />


                    <h2 className="
                        font-semibold
                        text-gray-700
                    ">

                        No appointments found

                    </h2>


                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">

                        Try changing your filters
                        or search criteria.

                    </p>

                </div>

            ) : (

                <div className="
                    grid
                    grid-cols-1
                    gap-5
                    lg:grid-cols-2
                ">

                    {appointments.map(
                        (appointment) => (

                            <div
                                key={
                                    appointment._id
                                }
                                className="
                                    bg-white
                                    border
                                    border-gray-200
                                    rounded-2xl
                                    p-5
                                    shadow-sm
                                    hover:shadow-md
                                    duration-200
                                    hover:border-blue-200
                                    transition-all
                                "
                            >

                                {/* ===================== */}
                                {/* Top */}
                                {/* ===================== */}

                                <div className="
                                    flex
                                    flex-col
                                    md:flex-row
                                    md:items-center
                                    md:justify-between
                                    gap-4
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-4
                                    ">

                                        <div className="
                                            w-12
                                            h-12
                                            rounded-xl
                                            bg-blue-50
                                            flex
                                            items-center
                                            justify-center
                                            text-blue-600
                                            shrink-0
                                        ">

                                            <CalendarDays
                                                size={22}
                                            />

                                        </div>


                                        <div>

                                            <h2 className="
                                                font-semibold
                                                text-gray-900
                                            ">

                                                Appointment

                                            </h2>


                                            <p className="
                                                text-sm
                                                text-gray-500
                                            ">

                                                {
                                                    appointment.appointmentDate
                                                        ? new Date(
                                                            appointment.appointmentDate
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )
                                                        : "Date not available"
                                                }

                                            </p>

                                        </div>

                                    </div>


                                    {/* Status */}

                                    <span
                                        className={`
                                            inline-flex
                                            w-fit
                                            px-3
                                            py-1.5
                                            rounded-full
                                            text-xs
                                            font-semibold
                                            ${
                                                appointment.status ===
                                                "Completed"
                                                    ? "bg-green-50 text-green-600"
                                                    : appointment.status ===
                                                      "Cancelled"
                                                    ? "bg-red-50 text-red-600"
                                                    : appointment.status ===
                                                      "Confirmed"
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "bg-yellow-50 text-yellow-600"
                                            }
                                        `}
                                    >

                                        {
                                            appointment.status ||
                                            "Unknown"
                                        }

                                    </span>

                                </div>


                                {/* ===================== */}
                                {/* Details */}
                                {/* ===================== */}

                                <div className="
                                    mt-5
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-4
                                ">

                                    {/* Patient */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        bg-gray-50
                                        rounded-xl
                                        p-4
                                    ">

                                        <UserRound
                                            size={19}
                                            className="
                                                text-gray-400
                                            "
                                        />


                                        <div>

                                            <p className="
                                                text-xs
                                                text-gray-400
                                            ">
                                                Patient
                                            </p>


                                            <p className="
                                                text-sm
                                                font-medium
                                                text-gray-800
                                            ">

                                                {
                                                    appointment
                                                        .patient
                                                        ?.fullName ||
                                                    "Unknown Patient"
                                                }

                                            </p>

                                        </div>

                                    </div>


                                    {/* Doctor */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        bg-gray-50
                                        rounded-xl
                                        p-4
                                    ">

                                        <Stethoscope
                                            size={19}
                                            className="
                                                text-gray-400
                                            "
                                        />


                                        <div>

                                            <p className="
                                                text-xs
                                                text-gray-400
                                            ">
                                                Doctor
                                            </p>


                                            <p className="
                                                text-sm
                                                font-medium
                                                text-gray-800
                                            ">

                                                {
                                                    appointment
                                                        .doctor
                                                        ?.user
                                                        ?.fullName ||
                                                    "Unknown Doctor"
                                                }

                                            </p>

                                        </div>

                                    </div>


                                    {/* Time */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        bg-gray-50
                                        rounded-xl
                                        p-4
                                    ">

                                        <Clock
                                            size={19}
                                            className="
                                                text-gray-400
                                            "
                                        />


                                        <div>

                                            <p className="
                                                text-xs
                                                text-gray-400
                                            ">
                                                Time
                                            </p>


                                            <p className="
                                                text-sm
                                                font-medium
                                                text-gray-800
                                            ">

                                                {
                                                    appointment.timeSlot ||
                                                    appointment.appointmentTime ||
                                                    "Time not available"
                                                }

                                            </p>

                                        </div>

                                    </div>


                                    {/* Appointment ID */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        bg-gray-50
                                        rounded-xl
                                        p-4
                                    ">

                                        <CalendarDays
                                            size={19}
                                            className="
                                                text-gray-400
                                            "
                                        />


                                        <div className="min-w-0">

                                            <p className="
                                                text-xs
                                                text-gray-400
                                            ">
                                                Appointment ID
                                            </p>


                                            <p className="
                                                text-sm
                                                font-medium
                                                text-gray-800
                                                truncate
                                            ">

                                                {
                                                    appointment._id
                                                }

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* ===================== */}
                                {/* Footer */}
                                {/* ===================== */}

                                <div className="
                                    mt-5
                                    pt-4
                                    border-t
                                    border-gray-100
                                    flex
                                    justify-end
                                ">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteAppointment(
                                                appointment._id
                                            )
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            px-4
                                            py-2
                                            rounded-xl
                                            bg-red-50
                                            text-red-600
                                            hover:bg-red-100
                                            text-sm
                                            font-semibold
                                            transition
                                        "
                                    >

                                        <Trash2
                                            size={16}
                                        />

                                        Remove Appointment

                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}


            {/* ================================= */}
            {/* Pagination */}
            {/* ================================= */}

            {appointments.length > 0 && (

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={
                        handlePageChange
                    }
                />

            )}

        </div>

    );

}


export default AdminAppointments;
