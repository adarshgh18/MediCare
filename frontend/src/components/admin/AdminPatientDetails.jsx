import { useEffect, useState } from "react";

import {
    ArrowLeft,
    UserRound,
    Mail,
    CalendarDays,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

import ServerError from "../common/ServerError";

import { getApiErrorMessage } from "../../services/apiError";


function AdminPatientDetails() {

    const { id } = useParams();
    const navigate = useNavigate();


    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState(false);


    // ----------------------------------
    // Fetch Patient
    // ----------------------------------

    const fetchPatient = async () => {

        try {

            setLoading(true);
            setServerError(false);


            const response = await api.get(
                `/admin/patients/${id}`
            );

            setPatient(
                response.data.patient
            );

        }

        catch (err) {

            console.error(
                "Failed to fetch patient details:",
                err
            );


            setServerError(true);

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchPatient();

    }, [id]);


    // ----------------------------------
    // Loading
    // ----------------------------------

    if (loading) {

        return (

            <div className="p-8">

                <p className="text-gray-500">

                    Loading patient details...

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
                onRetry={fetchPatient}
            />

        );

    }


    // ----------------------------------
    // Patient Not Found
    // ----------------------------------

    if (!patient) {

        return (

            <div className="p-8">

                <div className="
                    bg-red-50
                    border
                    border-red-200
                    rounded-xl
                    p-5
                    text-red-600
                ">

                    {getApiErrorMessage(
                        {},
                        "Patient not found."
                    )}

                </div>

            </div>

        );

    }


    return (

        <div className="p-6 md:p-8">

            {/* ================================== */}
            {/* Back */}
            {/* ================================== */}

            <button
                type="button"
                onClick={() =>
                    navigate("/admin/patients")
                }
                className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-gray-500
                    hover:text-blue-600
                    transition
                    mb-6
                "
            >

                <ArrowLeft size={17} />

                Back to Patients

            </button>


            {/* ================================== */}
            {/* Header */}
            {/* ================================== */}

            <div className="mb-8">

                <p className="
                    text-sm
                    font-semibold
                    text-blue-600
                ">

                    Administration

                </p>


                <h1 className="
                    text-3xl
                    font-bold
                    text-gray-900
                    mt-1
                ">

                    Patient Details

                </h1>


                <p className="
                    text-gray-500
                    mt-2
                ">

                    View patient account information.

                </p>

            </div>


            {/* ================================== */}
            {/* Patient Card */}
            {/* ================================== */}

            <div className="
                max-w-3xl
                bg-white
                border
                border-gray-200
                rounded-2xl
                shadow-sm
                overflow-hidden
            ">

                {/* Profile Header */}

                <div className="
                    p-6
                    md:p-8
                    bg-blue-50
                    border-b
                    border-blue-100
                ">

                    <div className="
                        flex
                        items-center
                        gap-5
                    ">

                        <div className="
                            w-16
                            h-16
                            rounded-2xl
                            bg-white
                            flex
                            items-center
                            justify-center
                            text-blue-600
                            shadow-sm
                        ">

                            <UserRound size={30} />

                        </div>


                        <div>

                            <h2 className="
                                text-2xl
                                font-bold
                                text-gray-900
                            ">

                                {patient.fullName ||
                                    "Unknown Patient"}

                            </h2>


                            <p className="
                                text-sm
                                text-gray-500
                                mt-1
                            ">

                                @{patient.username}

                            </p>

                        </div>

                    </div>

                </div>


                {/* Details */}

                <div className="
                    p-6
                    md:p-8
                ">

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-6
                    ">

                        {/* Email */}

                        <div>

                            <div className="
                                flex
                                items-center
                                gap-2
                                text-gray-400
                                mb-2
                            ">

                                <Mail size={17} />

                                <span className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wide
                                ">

                                    Email

                                </span>

                            </div>


                            <p className="
                                text-gray-800
                                break-all
                            ">

                                {patient.email ||
                                    "Email not provided"}

                            </p>

                        </div>


                        {/* Username */}

                        <div>

                            <div className="
                                flex
                                items-center
                                gap-2
                                text-gray-400
                                mb-2
                            ">

                                <UserRound size={17} />

                                <span className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wide
                                ">

                                    Username

                                </span>

                            </div>


                            <p className="
                                text-gray-800
                            ">

                                @{patient.username}

                            </p>

                        </div>


                        {/* Role */}

                        <div>

                            <p className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-gray-400
                                mb-2
                            ">

                                Role

                            </p>


                            <span className="
                                inline-flex
                                px-3
                                py-1
                                rounded-full
                                bg-blue-50
                                text-blue-600
                                text-sm
                                font-medium
                            ">

                                Patient

                            </span>

                        </div>


                        {/* Registered */}

                        <div>

                            <div className="
                                flex
                                items-center
                                gap-2
                                text-gray-400
                                mb-2
                            ">

                                <CalendarDays size={17} />

                                <span className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wide
                                ">

                                    Registered

                                </span>

                            </div>


                            <p className="
                                text-gray-800
                            ">

                                {patient.createdAt
                                    ? new Date(
                                        patient.createdAt
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )
                                    : "—"}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default AdminPatientDetails;