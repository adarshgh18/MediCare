import { useEffect, useState } from "react";

import {
    FaUserMd,
    FaHospital,
    FaGraduationCap,
} from "react-icons/fa";

import {
    Search,
    Filter,
    Plus,
    ChevronRight,
    Users,
    Stethoscope,
    Award,
    ShieldCheck,
    Clock3,
    HeartPulse,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { getApiErrorMessage } from "../../services/apiError";

import Pagination from "../common/Pagination";


function AdminDoctors() {

    // ----------------------------------
    // State
    // ----------------------------------

    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [specialization, setSpecialization] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalDoctors, setTotalDoctors] =
        useState(0);

    const [doctorSummary, setDoctorSummary] =
        useState({
            activeDoctors: 0,
            specializationCount: 0,
            averageExperience: 0,
        });

    const navigate = useNavigate();


    // ----------------------------------
    // Specializations
    // ----------------------------------

    const specializations = [
        "Cardiologist",
        "Dermatologist",
        "General Physician",
        "Gynecologist",
        "Neurologist",
        "Orthopedic",
        "Pediatrician",
        "Psychiatrist",
        "Dentist",
        "Ophthalmologist",
        "ENT Specialist",
    ];


    // ----------------------------------
    // Fetch Doctors
    // ----------------------------------

    const fetchDoctors = async (
        page = currentPage
    ) => {

        try {

            setLoading(true);

            setError("");

            const params = {
                page,
                limit: 9,
            };


            if (search.trim()) {

                params.search =
                    search.trim();

            }


            if (specialization) {

                params.specialization =
                    specialization;

            }


            const response =
                await api.get(
                    "/admin/doctors",
                    {
                        params,
                    }
                );


            const data =
                response.data;


            setDoctors(
                data.doctors || []
            );


            setTotalDoctors(
                data.totalDoctors || 0
            );


            setTotalPages(
                data.totalPages || 1
            );


            setDoctorSummary({
                activeDoctors:
                    data.activeDoctors || 0,

                specializationCount:
                    data.specializationCount || 0,

                averageExperience:
                    data.averageExperience || 0,
            });

        }

        catch (err) {

            console.error(
                "Failed to fetch admin doctors:",
                err
            );


            setError(
                getApiErrorMessage(
                    err,
                    "Unable to load doctors."
                )
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ----------------------------------
    // Initial Load + Search / Filter
    // ----------------------------------

    useEffect(() => {

        const timer =
            setTimeout(() => {

                fetchDoctors(
                    currentPage
                );

            }, 400);


        return () => {

            clearTimeout(timer);

        };

    }, [
        currentPage,
        search,
        specialization,
    ]);


    // ----------------------------------
    // Search
    // ----------------------------------

    const handleSearchChange = (e) => {

        setSearch(
            e.target.value
        );

        setCurrentPage(1);

    };


    // ----------------------------------
    // Specialization
    // ----------------------------------

    const handleSpecializationChange =
        (e) => {

            setSpecialization(
                e.target.value
            );

            setCurrentPage(1);

        };


    // ----------------------------------
    // Loading
    // ----------------------------------

    if (
        loading &&
        doctors.length === 0
    ) {

        return (
            <div className="p-8">

                <p className="text-gray-500">
                    Loading doctors...
                </p>

            </div>
        );

    }


    // ----------------------------------
    // Error
    // ----------------------------------

    if (
        error &&
        doctors.length === 0
    ) {

        return (
            <div className="p-8">

                <div
                    className="
                        bg-red-50
                        border
                        border-red-200
                        text-red-600
                        rounded-xl
                        p-5
                    "
                >
                    {error}
                </div>

            </div>
        );

    }


    return (

        <div className="p-6 md:p-8">

            {/* ================================= */}
            {/* Header */}
            {/* ================================= */}

            <div
                className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                    gap-4
                    mb-7
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-blue-600
                        "
                    >
                        Administration
                    </p>

                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-gray-900
                            mt-1
                        "
                    >
                        Doctors
                    </h1>

                    <p
                        className="
                            text-gray-500
                            mt-1
                        "
                    >
                        Manage registered doctors
                        and their details.
                    </p>

                </div>


                {/* Add Doctor */}

                <button
                    type="button"
                    onClick={() =>
                        navigate( "/doctor/register" )
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        py-2.5
                        rounded-xl
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        text-sm
                        font-semibold
                        shadow-sm
                        transition
                        shrink-0
                    "
                >

                    <Plus size={17} />

                    Add Doctor

                </button>

            </div>


            {/* ================================= */}
            {/* Summary Cards */}
            {/* ================================= */}

            <div
                className="
                    grid
                    grid-cols-2
                    xl:grid-cols-4
                    gap-4
                    mb-5
                "
            >

                {/* Total Doctors */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-4
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                w-10
                                h-10
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <Users size={19} />
                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                "
                            >
                                Total Doctors
                            </p>

                            <p
                                className="
                                    text-xl
                                    font-bold
                                    text-gray-900
                                    mt-0.5
                                "
                            >
                                {totalDoctors}
                            </p>

                        </div>

                    </div>


                    <p
                        className="
                            text-xs
                            text-gray-400
                            mt-3
                        "
                    >
                        Registered doctors
                    </p>

                </div>


                {/* Active Doctors */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-4
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                w-10
                                h-10
                                rounded-xl
                                bg-emerald-50
                                text-emerald-600
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <Stethoscope size={19} />
                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                "
                            >
                                Active Doctors
                            </p>

                            <p
                                className="
                                    text-xl
                                    font-bold
                                    text-gray-900
                                    mt-0.5
                                "
                            >
                                {
                                    doctorSummary.activeDoctors
                                }
                            </p>

                        </div>

                    </div>


                    <p
                        className="
                            text-xs
                            text-gray-400
                            mt-3
                        "
                    >
                        Currently available
                    </p>

                </div>


                {/* Specializations */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-4
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                w-10
                                h-10
                                rounded-xl
                                bg-indigo-50
                                text-indigo-600
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <Award size={19} />
                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                "
                            >
                                Specializations
                            </p>

                            <p
                                className="
                                    text-xl
                                    font-bold
                                    text-gray-900
                                    mt-0.5
                                "
                            >
                                {
                                    doctorSummary.specializationCount
                                }
                            </p>

                        </div>

                    </div>


                    <p
                        className="
                            text-xs
                            text-gray-400
                            mt-3
                        "
                    >
                        Different categories
                    </p>

                </div>


                {/* Average Experience */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-4
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                w-10
                                h-10
                                rounded-xl
                                bg-violet-50
                                text-violet-600
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <Award size={19} />
                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                "
                            >
                                Avg. Experience
                            </p>

                            <p
                                className="
                                    text-xl
                                    font-bold
                                    text-gray-900
                                    mt-0.5
                                "
                            >
                                {
                                    Number(
                                        doctorSummary.averageExperience ||
                                        0
                                    ).toFixed(1)
                                }{" "}
                                yrs
                            </p>

                        </div>

                    </div>


                    <p
                        className="
                            text-xs
                            text-gray-400
                            mt-3
                        "
                    >
                        Across all doctors
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* Search & Filter */}
            {/* ================================= */}

            <div
                className="
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    p-3
                    mb-5
                    shadow-sm
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        gap-3
                    "
                >

                    {/* Search */}

                    <div
                        className="
                            relative
                            flex-1
                        "
                    >

                        <Search
                            size={18}
                            className="
                                absolute
                                left-3.5
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={
                                handleSearchChange
                            }
                            placeholder="Search doctor by name, specialization, hospital..."
                            className="
                                w-full
                                pl-11
                                pr-4
                                py-2.5
                                rounded-lg
                                border
                                border-gray-200
                                text-sm
                                text-gray-800
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    {/* Filter */}

                    <div
                        className="
                            relative
                            md:w-60
                        "
                    >

                        <Filter
                            size={17}
                            className="
                                absolute
                                left-3.5
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                                pointer-events-none
                            "
                        />


                        <select
                            value={specialization}
                            onChange={
                                handleSpecializationChange
                            }
                            className="
                                w-full
                                appearance-none
                                pl-11
                                pr-4
                                py-2.5
                                rounded-lg
                                border
                                border-gray-200
                                bg-white
                                text-sm
                                text-gray-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        >

                            <option value="">
                                All Specializations
                            </option>


                            {specializations.map(
                                (item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>


                {/* Active Filters */}

                {(search || specialization) && (

                    <div
                        className="
                            mt-3
                            px-1
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <p
                            className="
                                text-xs
                                text-gray-500
                            "
                        >
                            Showing filtered results
                        </p>


                        <button
                            type="button"
                            onClick={() => {

                                setSearch("");

                                setSpecialization("");

                                setCurrentPage(1);

                            }}
                            className="
                                text-xs
                                font-semibold
                                text-blue-600
                                hover:text-blue-700
                            "
                        >
                            Clear filters
                        </button>

                    </div>

                )}

            </div>


            {/* ================================= */}
            {/* Refresh Error */}
            {/* ================================= */}

            {error && (

                <div
                    className="
                        mb-5
                        bg-red-50
                        border
                        border-red-200
                        text-red-600
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                    "
                >
                    {error}
                </div>

            )}


            {/* ================================= */}
            {/* Quality Banner */}
            {/* ================================= */}

            {!loading && doctors.length > 0 && (

                <div
                    className="
                        mb-5
                        py-3.5
                        overflow-hidden
                        rounded-xl
                        border
                        border-blue-100
                        bg-gradient-to-r
                        from-blue-50
                        via-indigo-50
                        to-white
                        px-5
                    "
                >

                    <div className="flex items-center justify-between gap-6">

                        {/* LEFT */}
                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    w-10
                                    shrink-0
                                    h-10
                                    rounded-xl
                                    bg-white
                                    text-blue-600
                                    flex
                                    items-center
                                    justify-center
                                    shadow-sm
                                "
                            >
                                <Stethoscope size={21} />
                            </div>

                            <div>

                                <p className="text-sm font-semibold text-blue-800">
                                    Quality Care, Trusted Professionals
                                </p>

                                <p className="text-xs text-gray-500 mt-0.5">
                                    Our doctors are verified professionals committed to providing quality healthcare.
                                </p>

                            </div>

                        </div>


                        {/* RIGHT */}
                        <div className="hidden lg:flex items-center gap-6 text-xs text-gray-500">

                            <span className="flex items-center gap-1.5">
                                <ShieldCheck
                                    size={16}
                                    className="text-blue-600"
                                />
                                Verified Doctors
                            </span>

                            <span className="flex items-center gap-1.5">
                                <Clock3
                                    size={16}
                                    className="text-blue-600"
                                />
                                24/7 Care
                            </span>

                        </div>

                    </div>

                </div>

            )}

            {/* ================================= */}
            {/* Empty State */}
            {/* ================================= */}

            {!loading &&
            doctors.length === 0 ? (

                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        p-10
                        text-center
                    "
                >

                    <FaUserMd
                        className="
                            mx-auto
                            text-gray-300
                            mb-3
                        "
                        size={32}
                    />

                    <h2
                        className="
                            font-semibold
                            text-gray-700
                        "
                    >
                        No doctors found
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        Try changing your search
                        or filter.
                    </p>

                </div>

            ) : (

                <>

                    {/* ================================= */}
                    {/* Doctors Grid */}
                    {/* ================================= */}

                    <div
                        className="
                            relative
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            xl:grid-cols-3
                            gap-4
                        "
                    >

                        {doctors.map(
                            (doctor) => (

                                <div
                                    key={doctor._id}
                                    onClick={() =>
                                        navigate(
                                            `/admin/doctors/${doctor._id}`
                                        )
                                    }
                                    className="
                                        bg-white
                                        border
                                        border-gray-200
                                        rounded-xl
                                        overflow-hidden
                                        shadow-sm
                                        cursor-pointer
                                        hover:shadow-md
                                        hover:border-blue-200
                                        transition
                                    "
                                >

                                    {/* Doctor Info */}

                                    <div
                                        className="
                                            p-4
                                            flex
                                            items-start
                                            gap-3
                                        "
                                    >

                                        {/* Image */}

                                        <div
                                            className="
                                                w-14
                                                h-14
                                                rounded-full
                                                bg-blue-50
                                                border
                                                border-blue-100
                                                flex
                                                items-center
                                                justify-center
                                                text-blue-600
                                                shrink-0
                                                overflow-hidden
                                            "
                                        >

                                            {doctor.profileImage ||
                                            doctor.user?.profileImage ? (

                                                <img
                                                    src={
                                                        doctor.profileImage ||
                                                        doctor.user?.profileImage
                                                    }
                                                    alt={
                                                        doctor.user?.fullName ||
                                                        "Doctor"
                                                    }
                                                    className="
                                                        w-full
                                                        h-full
                                                        object-cover
                                                    "
                                                />

                                            ) : (

                                                <FaUserMd
                                                    size={23}
                                                />

                                            )}

                                        </div>


                                        {/* Details */}

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    justify-between
                                                    gap-2
                                                "
                                            >

                                                <div
                                                    className="
                                                        min-w-0
                                                    "
                                                >

                                                    <h2
                                                        className="
                                                            font-semibold
                                                            text-gray-900
                                                            truncate
                                                        "
                                                    >
                                                        {
                                                            doctor.user?.fullName ||
                                                            "Unknown Doctor"
                                                        }
                                                    </h2>


                                                    <p
                                                        className="
                                                            text-sm
                                                            text-blue-600
                                                            truncate
                                                            mt-0.5
                                                        "
                                                    >
                                                        {
                                                            doctor.specialization ||
                                                            "No specialization"
                                                        }
                                                    </p>

                                                </div>


                                                <ChevronRight
                                                    size={19}
                                                    className="
                                                        text-gray-400
                                                        shrink-0
                                                        mt-1
                                                    "
                                                />

                                            </div>


                                            <div
                                                className="
                                                    mt-3
                                                    space-y-2
                                                    text-xs
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-gray-500
                                                    "
                                                >

                                                    <FaHospital
                                                        className="
                                                            text-gray-400
                                                            shrink-0
                                                        "
                                                    />

                                                    <span
                                                        className="
                                                            truncate
                                                        "
                                                    >
                                                        {
                                                            doctor.hospital ||
                                                            "Hospital not provided"
                                                        }
                                                    </span>

                                                </div>


                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-gray-500
                                                    "
                                                >

                                                    <FaGraduationCap
                                                        className="
                                                            text-gray-400
                                                            shrink-0
                                                        "
                                                    />

                                                    <span
                                                        className="
                                                            truncate
                                                        "
                                                    >
                                                        {
                                                            doctor.qualification ||
                                                            "Qualification not provided"
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Footer */}

                                    <div
                                        className="
                                            border-t
                                            border-gray-100
                                            px-4
                                            py-3
                                            grid
                                            grid-cols-3
                                            items-center
                                            gap-2
                                        "
                                    >

                                        {/* Experience */}

                                        <div>

                                            <p
                                                className="
                                                    text-[11px]
                                                    text-gray-400
                                                "
                                            >
                                                Experience
                                            </p>

                                            <p
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-800
                                                    mt-0.5
                                                "
                                            >
                                                {
                                                    doctor.experience ??
                                                    0
                                                }{" "}
                                                yrs
                                            </p>

                                        </div>


                                        {/* Patients */}

                                        <div>

                                            <p
                                                className="
                                                    text-[11px]
                                                    text-gray-400
                                                "
                                            >
                                                Patients
                                            </p>

                                            <p
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-800
                                                    mt-0.5
                                                "
                                            >
                                                {
                                                    doctor.patientsTreated ??
                                                    0
                                                }
                                            </p>

                                        </div>


                                        {/* Status */}

                                        <div
                                            className="
                                                flex
                                                justify-end
                                            "
                                        >

                                            <span
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    px-2.5
                                                    py-1
                                                    rounded-full
                                                    text-[11px]
                                                    font-semibold
                                                    ${
                                                        doctor.user?.isActive === false ||
                                                        doctor.isActive === false
                                                            ? "bg-red-50 text-red-600"
                                                            : "bg-emerald-50 text-emerald-600"
                                                    }
                                                `}
                                            >
                                                {
                                                    doctor.user?.isActive === false ||
                                                    doctor.isActive === false
                                                        ? "Inactive"
                                                        : "Available"
                                                }
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}


                        {/* Loading Overlay */}

                        {loading && (

                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-white/60
                                    rounded-xl
                                    flex
                                    items-start
                                    justify-center
                                    pt-8
                                    z-10
                                "
                            >

                                <div
                                    className="
                                        bg-white
                                        border
                                        border-gray-200
                                        rounded-xl
                                        px-4
                                        py-2
                                        shadow-sm
                                        text-sm
                                        text-gray-500
                                    "
                                >
                                    Loading...
                                </div>

                            </div>

                        )}

                    </div>


                    {/* ================================= */}
                    {/* Bottom Summary */}
                    {/* ================================= */}

                    {!search &&
                    !specialization &&
                    totalDoctors > 0 && (

                        <div
                            className="
                                mt-4
                                bg-blue-50
                                border
                                border-gray-200
                                rounded-xl
                                px-5
                                py-4
                                text-center
                            "
                        >

                            <div
                                className="
                                    mx-auto
                                    w-9
                                    h-9
                                    rounded-full
                                    bg-blue-50
                                    text-blue-600
                                    flex
                                    items-center
                                    justify-center
                                    mb-2
                                "
                            >
                                <Users size={18} />
                            </div>


                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-800
                                "
                            >
                                {doctorSummary.activeDoctors ===
                                totalDoctors
                                    ? "All doctors are active"
                                    : `${doctorSummary.activeDoctors} active doctors`}
                            </p>


                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                    mt-0.5
                                "
                            >
                                You have{" "}
                                {
                                    doctorSummary.activeDoctors
                                }{" "}
                                active doctors registered
                                in the system.
                            </p>

                        </div>

                    )}


                    {/* ================================= */}
                    {/* Pagination */}
                    {/* ================================= */}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={
                            setCurrentPage
                        }
                    />

                </>

            )}

        </div>
    );
}


export default AdminDoctors;