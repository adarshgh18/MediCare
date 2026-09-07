import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../services/api";

import Pagination from "../components/common/Pagination";

import ServerError from "../components/common/ServerError";

import {
    getApiErrorType,
    API_ERROR_TYPES,
} from "../services/apiError";

import {
    FaUserMd,
    FaSearch,
    FaHospital,
    FaBriefcase,
    FaRupeeSign,
} from "react-icons/fa";

import { Stethoscope } from "lucide-react";
import { RefreshCw, ServerCrash } from "lucide-react";

function Doctors() {

    const [doctors, setDoctors] = useState([]);
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDoctors, setTotalDoctors] = useState(0);
    const doctorsPerPage = 9;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const [specialization, setSpecialization] = useState("All");

    const fetchDoctors = async () => {

        try {

            setError(null);
            setLoading(true);

            const response = await api.get(
                `/doctors?page=${currentPage}&limit=${doctorsPerPage}`
            );

            setDoctors(response.data.doctors || []);

            setTotalPages(
                response.data.totalPages || 1
            );

            setTotalDoctors(
                response.data.totalDoctors || 0
            );

        } catch (err) {

            console.error("Failed to fetch doctors:", err);
            setDoctors([]);
            setError(err);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchDoctors();

    }, [currentPage]);


    // Get unique specializations

    const specializations = [
        "All",
        ...new Set(
            doctors.map(
                (doctor) => doctor.specialization
            )
        ),
    ];


    // Filter doctors

    const filteredDoctors = doctors.filter((doctor) => {

        const doctorName =
            doctor.user?.fullName?.toLowerCase() || "";

        const doctorSpecialization =
            doctor.specialization?.toLowerCase() || "";

        const hospital =
            doctor.hospital?.toLowerCase() || "";

        const searchValue =
            search.toLowerCase();

        const matchesSearch =
            doctorName.includes(searchValue) ||
            doctorSpecialization.includes(searchValue) ||
            hospital.includes(searchValue);

        const matchesSpecialization =
            specialization === "All" ||
            doctor.specialization === specialization;

        return (
            matchesSearch &&
            matchesSpecialization
        );

    });

    if (error && !error.response) {

        return (

            <div className="min-h-screen bg-[#f0f5fa] px-4 py-10">

                <div className="
                max-w-3xl
                mx-auto
                min-h-[60vh]
                flex
                items-center
                justify-center
            ">

                    <div className="
                    w-full
                    max-w-md
                    text-center
                    bg-white
                    border
                    border-gray-200
                    rounded-3xl
                    shadow-sm
                    px-7
                    py-10
                ">

                        <div className="
                        w-16
                        h-16
                        mx-auto
                        rounded-2xl
                        bg-red-50
                        flex
                        items-center
                        justify-center
                        mb-5
                    ">

                            <ServerCrash
                                size={30}
                                className="text-red-500"
                            />

                        </div>


                        <h2 className="
                        text-xl
                        font-bold
                        text-gray-900
                    ">

                            Unable to connect to MediCare

                        </h2>


                        <p className="
                        text-sm
                        text-gray-500
                        mt-2
                        leading-6
                    ">

                            We couldn't load the doctors right now.
                            Please check your connection or try again
                            in a moment.

                        </p>


                        <button
                            onClick={fetchDoctors}
                            className="
                            mt-6
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-5
                            py-2.5
                            rounded-xl
                            text-sm
                            font-semibold
                            transition
                        "
                        >

                            <RefreshCw size={16} />

                            Try Again

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="min-h-screen ">

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Header */}

                <div className="mb-8">

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

                        {/* Left Side */}

                        <div>

                            <p className="flex items-center gap-2 text-sm font-semibold tracking-widest text-blue-500 uppercase">

                                <Stethoscope
                                    size={15}
                                    strokeWidth={2.3}
                                    className="text-blue-500"
                                />

                                Healthcare Professionals

                            </p>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">

                                Find a Doctor who fits your care.

                            </h1>

                            <p className="text-gray-500 mt-2">

                                Search and choose a doctor based on your healthcare needs.

                            </p>

                        </div>


                        {/* Doctor Count Card */}

                        <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm w-fit">

                            {/* Doctor initials */}

                            <div className="flex items-center">

                                {doctors.slice(0, 3).map((doctor, index) => (

                                    <div
                                        key={doctor._id}
                                        className={`
                                            w-10 h-10
                                            rounded-full
                                            flex items-center justify-center
                                            text-xs font-bold
                                            border-2 border-white
                                            ${index === 0
                                                ? "bg-blue-100 text-blue-600"
                                                : index === 1
                                                    ? "bg-purple-100 text-purple-600"
                                                    : "bg-emerald-100 text-emerald-600"
                                            }
                                            ${index !== 0 ? "-ml-2" : ""}
                                        `}
                                    >

                                        {doctor.user?.fullName
                                            ?.split(" ")
                                            .map((name) => name[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()
                                        }

                                    </div>

                                ))}

                            </div>


                            {/* Count */}

                            <div className="leading-tight">

                                <p className="text-lg font-bold text-gray-900">

                                    {doctors.length}+

                                </p>

                                <p className="text-sm text-gray-500">

                                    Verified Doctors

                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Search + Filter */}

                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-8">

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">

                        {/* Search */}

                        <div className="relative">

                            <FaSearch
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search by doctor, specialization or hospital..."
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>


                        {/* Specialization */}

                        <select
                            value={specialization}
                            onChange={(e) =>
                                setSpecialization(e.target.value)
                            }
                            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >

                            {specializations.map((item) => (

                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>

                            ))}

                        </select>

                    </div>

                </div>


                {/* Result count */}

                <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                        <span className="font-bold">
                            {filteredDoctors.length}
                        </span>

                        {filteredDoctors.length === 1
                            ? "doctor"
                            : "doctors"}{" "}
                        found
                    </span>
                </div>


                {/* Doctors */}

                {filteredDoctors.length === 0 ? (

                    <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center">

                        <FaUserMd
                            className="mx-auto text-4xl text-gray-300 mb-4"
                        />

                        <h2 className="text-xl font-semibold text-gray-800">

                            No doctors found

                        </h2>

                        <p className="text-gray-500 mt-2">

                            Try changing your search or specialization filter.

                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {filteredDoctors.map((doctor) => (

                            <div
                                key={doctor._id}
                                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                            >

                                {/* Doctor */}

                                <div className="flex items-center gap-4">

                                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">

                                        <FaUserMd className="text-blue-600 text-2xl" />

                                    </div>

                                    <div>

                                        <h2 className="text-lg font-bold text-gray-900">

                                            {doctor.user?.fullName}

                                        </h2>

                                        <p className="text-blue-600 text-sm font-medium">

                                            {doctor.specialization}

                                        </p>

                                        {/* Rating */}

                                        <div className="flex items-center gap-2 mt-1.5">

                                            {doctor.averageRating ? (

                                                <>
                                                    <div className="flex items-center gap-1">

                                                        <span className="text-yellow-500 text-sm">
                                                            ★
                                                        </span>

                                                        <span className="text-sm font-semibold text-gray-800">
                                                            {doctor.averageRating}
                                                        </span>

                                                    </div>

                                                    <span className="text-sm text-gray-300">
                                                        •
                                                    </span>

                                                    <span className="text-sm text-gray-500">

                                                        {doctor.reviewCount}{" "}

                                                        {doctor.reviewCount === 1
                                                            ? "review"
                                                            : "reviews"}

                                                    </span>
                                                </>

                                            ) : (

                                                <span className="text-sm text-gray-400">
                                                    No reviews yet
                                                </span>

                                            )}

                                        </div>

                                    </div>

                                </div>


                                {/* Details */}

                                <div className="mt-6 space-y-3 text-sm text-gray-600">

                                    <div className="flex items-center gap-3">

                                        <FaHospital className="text-gray-400" />

                                        <span>
                                            {doctor.hospital || "Hospital not specified"}
                                        </span>

                                    </div>


                                    <div className="flex items-center gap-3">

                                        <FaBriefcase className="text-gray-400" />

                                        <span>

                                            {doctor.experience
                                                ? `${doctor.experience} years experience`
                                                : "Experience not specified"}

                                        </span>

                                    </div>


                                    <div className="flex items-center gap-3">

                                        <FaRupeeSign className="text-gray-400" />

                                        <span>

                                            Consultation Fee:{" "}

                                            <strong className="text-gray-800">

                                                ₹{doctor.consultationFee}

                                            </strong>

                                        </span>

                                    </div>

                                </div>


                                {/* Action */}

                                <button
                                    onClick={() =>
                                        navigate(`/doctors/${doctor._id}`)
                                    }
                                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition"
                                >

                                    View Doctor

                                </button>

                            </div>

                        ))}

                    </div>

                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

            </div>

        </div>

    );

}

export default Doctors;