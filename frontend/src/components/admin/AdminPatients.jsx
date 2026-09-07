import { useEffect, useState } from "react";

import {
    Users,
    Trash2,
    Search,
    Mail,
    CalendarDays,
    UserRound,
    Eye,
} from "lucide-react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import ServerError from "../common/ServerError";
import Pagination from "../common/Pagination";
import { getApiErrorMessage } from "../../services/apiError";

import { formatShortDate } from "../../utils/dateUtils";


function AdminPatients() {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPatients, setTotalPatients] = useState(0);

    const navigate = useNavigate();


    // ----------------------------------
    // Fetch Patients
    // ----------------------------------

    const fetchPatients = async () => {

        try {

            setLoading(true);
            setServerError(false);

            const response = await api.get(
                "/admin/patients",
                {
                    params: {
                        page: currentPage,
                        limit: 9,
                        search: search.trim(),
                    },
                }
            );


            setPatients(
                response.data.patients || []
            );

            setTotalPages(
                response.data.totalPages || 1
            );

            setTotalPatients(
                response.data.totalPatients || 0
            );

        }

        catch (err) {

            console.error(
                "Failed to fetch admin patients:",
                err
            );
            setServerError(true);
        }

        finally {
            setLoading(false);
        }

    };


    // ----------------------------------
    // Fetch when page/search changes
    // ----------------------------------

    useEffect(() => {

        const timer = setTimeout(() => {
            fetchPatients();
        }, 300);

        return () => clearTimeout(timer);

    }, [currentPage, search]);


    // ----------------------------------
    // Search Handler
    // ----------------------------------

    const handleSearchChange = (e) => {

        setSearch(e.target.value);
        setCurrentPage(1);

    };

    // ----------------------------------
    // Delete Patient
    // ----------------------------------

    const handleDeletePatient = async (patientId) => {

        const confirmed = window.confirm(
            "Are you sure you want to remove this patient?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/admin/patients/${patientId}`
            );

            setPatients((currentPatients) =>
                currentPatients.filter(
                    (patient) =>
                        patient._id !== patientId
                )
            );


            setTotalPatients(
                (currentTotal) =>
                    Math.max(currentTotal - 1, 0)
            );


            toast.success(
                "Patient removed successfully."
            );

            // If current page becomes empty,
            // move back one page.

            if (
                patients.length === 1 &&
                currentPage > 1
            ) {

                setCurrentPage(
                    currentPage - 1
                );

            }

        }

        catch (err) {

            console.error(
                "Failed to delete patient:",
                err
            );


            toast.error(
                getApiErrorMessage(
                    err,
                    "Failed to remove patient."
                )
            );

        }

    };


    // ----------------------------------
    // Loading
    // ----------------------------------

    if (loading && patients.length === 0) {

        return (
            <div className="p-6 md:p-8">

                <p className="text-gray-500">
                    Loading patients...
                </p>

            </div>
        );

    }


    // ----------------------------------
    // Server Error
    // ----------------------------------

    if (serverError) {

        return (
            <ServerError
                onRetry={fetchPatients}
            />
        );

    }


    return (
        <div className="
            p-6
            md:p-8
        ">

            {/* ================================= */}
            {/* Header */}
            {/* ================================= */}

            <div className="
                flex
                mb-7
                items-start
                justify-between
                gap-6
            ">

                <div>
                    <p className="
                        text-sm
                        text-blue-600
                        font-semibold
                    ">
                        Administration
                    </p>

                    <h1 className="
                        text-3xl
                        mt-1
                        font-bold
                        text-gray-900
                    ">
                        Patients
                    </h1>

                    <p className="
                        text-gray-500
                        mt-2
                    ">
                        Manage and monitor all registered patients.
                    </p>
                </div>


                {/* Total Patients */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    gap-3
                    bg-white
                    border
                    border-blue-100
                    rounded-2xl
                    px-4
                    py-3
                    shadow-sm
                ">

                    <div className="
                        w-10
                        text-blue-600
                        h-10
                        rounded-xl
                        bg-blue-50
                        flex
                        items-center
                        justify-center
                    ">
                        <Users size={20} />
                    </div>

                    <div>
                        <p className="
                            text-xs
                            text-gray-500
                        ">
                            Total Patients
                        </p>

                        <p className="
                            text-xl
                            leading-6
                            font-bold
                            text-gray-900
                        ">
                            {totalPatients}
                        </p>
                    </div>

                </div>

            </div>


            {/* ================================= */}
            {/* Search */}
            {/* ================================= */}

            <div className="
                mb-5
            ">

                <div className="
                    relative
                    w-full
                    max-w-2xl
                ">

                    <Search
                        size={19}
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
                        onChange={handleSearchChange}
                        placeholder="Search by patient name or username..."
                        className="
                            w-full
                            pl-11
                            pr-4
                            py-3
                            bg-white
                            border
                            border-gray-200
                            rounded-xl
                            text-sm
                            text-gray-800
                            placeholder-gray-400
                            outline-none
                            focus:border-blue-400
                            focus:ring-2
                            focus:ring-blue-100
                            transition
                        "
                    />

                </div>

            </div>


            {/* ================================= */}
            {/* Empty State */}
            {/* ================================= */}

            {patients.length === 0 ? (

                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    p-10
                    text-center
                ">

                    <div className="
                        w-14
                        h-14
                        mx-auto
                        rounded-2xl
                        bg-blue-50
                        flex
                        items-center
                        justify-center
                        text-blue-500
                        mb-4
                    ">

                        <Users size={28} />

                    </div>


                    <h2 className="
                        font-semibold
                        text-gray-800
                    ">

                        {search
                            ? "No patients found"
                            : "No patients registered"}

                    </h2>


                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">

                        {search
                            ? "Try a different name or username."
                            : "No patients are registered yet."}

                    </p>

                </div>

            ) : (

                <>
                    {/* ================================= */}
                    {/* Patient Table */}
                    {/* ================================= */}

                    <div className="
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        shadow-sm
                        overflow-hidden
                    ">

                        <div className="
                            overflow-x-auto
                        ">

                            <table className="
                                w-full
                                min-w-[760px]
                            ">

                                {/* Table Header */}

                                <thead>

                                    <tr className="
                                        border-b
                                        border-gray-200
                                        bg-gray-50/70
                                    ">

                                        <th className="
                                            text-left
                                            px-5
                                            py-4
                                            text-[11px]
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-gray-500
                                        ">
                                            Patient
                                        </th>


                                        <th className="
                                            text-left
                                            px-5
                                            py-4
                                            text-[11px]
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-gray-500
                                        ">
                                            Contact
                                        </th>


                                        <th className="
                                            text-left
                                            px-5
                                            py-4
                                            text-[11px]
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-gray-500
                                        ">
                                            Registered On
                                        </th>


                                        <th className="
                                            text-right
                                            px-5
                                            py-4
                                            text-[11px]
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-gray-500
                                        ">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                {/* Table Body */}

                                <tbody>

                                    {patients.map(
                                        (patient) => (

                                            <tr
                                                key={patient._id}
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/patients/${patient._id}`
                                                    )
                                                }
                                                className="
                                                    border-b
                                                    border-gray-100
                                                    last:border-0
                                                    hover:bg-blue-50
                                                    cursor-pointer
                                                    transition-colors
                                                    duration-150
                                                "
                                            >

                                                {/* Patient */}

                                                <td className="
                                                    px-5
                                                    py-4
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
                                                            bg-blue-50
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-blue-600
                                                            shrink-0
                                                        ">

                                                            <UserRound
                                                                size={19}
                                                            />

                                                        </div>


                                                        <div className="
                                                            min-w-0
                                                        ">

                                                            <p className="
                                                                font-semibold
                                                                text-gray-900
                                                                truncate
                                                            ">
                                                                {patient.fullName ||
                                                                    "Unknown Patient"}
                                                            </p>


                                                            <p className="
                                                                text-xs
                                                                text-blue-600
                                                                mt-0.5
                                                                truncate
                                                            ">
                                                                @{patient.username}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* Contact */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2.5
                                                    ">

                                                        <Mail
                                                            size={16}
                                                            className="
                                                                text-gray-400
                                                                shrink-0
                                                            "
                                                        />


                                                        <span className="
                                                            text-sm
                                                            text-gray-700
                                                            truncate
                                                            max-w-[240px]
                                                        ">

                                                            {patient.email ||
                                                                "Email not provided"}

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* Registered On */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2.5
                                                    ">

                                                        <CalendarDays
                                                            size={16}
                                                            className="
                                                                text-gray-400
                                                                shrink-0
                                                            "
                                                        />


                                                        <span className="
                                                            text-sm
                                                            text-gray-700
                                                        ">

                                                            {patient.createdAt
                                                                ? formatShortDate(patient.createdAt)
                                                                : "—"}

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* Actions */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">
                                                    <div className="
                                                        flex
                                                        justify-end
                                                        items-center
                                                    ">

                                                        <button
                                                            type="button"
                                                            onClick={(e) => {

                                                                e.stopPropagation();

                                                                handleDeletePatient(
                                                                    patient._id
                                                                );

                                                            }}
                                                            className="
                                                                inline-flex
                                                                duration-150
                                                                items-center
                                                                gap-2
                                                                px-3.5
                                                                py-2
                                                                rounded-lg
                                                                border
                                                                border-red-200
                                                                bg-white
                                                                text-red-500
                                                                hover:bg-red-50
                                                                hover:border-red-300
                                                                hover:text-red-600
                                                                text-xs
                                                                font-semibold
                                                                transition-all
                                                        "
                                                            title="Remove patient"
                                                        >

                                                            <Trash2 size={14} />

                                                            Remove

                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* Footer */}
                    {/* ================================= */}

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-3
                        mt-4
                    ">

                        <p className="
                            text-xs
                            text-gray-500
                        ">

                            Showing{" "}
                            {patients.length > 0
                                ? `${(currentPage - 1) * 9 + 1} to ${
                                    Math.min(
                                        (currentPage - 1) * 9 +
                                        patients.length,
                                        totalPatients
                                    )
                                }`
                                : "0"}{" "}
                            of {totalPatients} patients

                        </p>


                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />

                    </div>

                </>

            )}

        </div>
    );

}

export default AdminPatients;