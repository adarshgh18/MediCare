import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

import {
    ArrowLeft,
    User,
    ShieldCheck,
    CalendarDays,
    Pencil,
} from "lucide-react";


function Profile() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


    // ----------------------------------
    // Fetch Profile
    // ----------------------------------

    const fetchProfile = async () => {

        try {

            const response = await api.get("/users/profile");

            setUser(response.data.user);

        }

        catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message ||
                "Unable to load profile."
            );

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchProfile();

    }, []);


    // ----------------------------------
    // Loading
    // ----------------------------------

    if (loading) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <p className="text-gray-500">
                    Loading profile...
                </p>

            </div>

        );

    }


    if (!user) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <p className="text-gray-500">
                    Profile not found.
                </p>

            </div>

        );

    }


    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric",
            }
        )
        : "—";


    return (

        <div className="min-h-screen ">

            <div className="max-w-5xl mx-auto px-4 py-10">


                {/* Back Button */}

                <button
                    onClick={() => navigate("/patient/dashboard")}
                    className="
                        flex items-center gap-2
                        text-sm font-medium
                        text-gray-500
                        hover:text-blue-600
                        transition
                        mb-6
                    "
                >

                    <ArrowLeft size={18} />

                    Back to Dashboard

                </button>



                {/* Main Profile Card */}

                <div className="
                    bg-white
                    rounded-2xl
                    border border-gray-200
                    shadow-sm
                    overflow-hidden
                ">


                    {/* -------------------------------- */}
                    {/* Profile Header */}
                    {/* -------------------------------- */}

                    <div className="
                        px-6 md:px-8
                        py-8
                        border-b border-gray-200
                    ">

                        <div className="
                            flex
                            flex-col sm:flex-row
                            sm:items-center
                            justify-between
                            gap-6
                        ">


                            <div className="
                                flex
                                items-center
                                gap-5
                            ">


                                {/* Avatar */}

                                <div className="
                                    w-20 h-20
                                    rounded-2xl
                                    bg-blue-50
                                    border border-blue-100
                                    flex items-center justify-center
                                ">

                                    <User
                                        size={38}
                                        className="text-blue-600"
                                    />

                                </div>


                                <div>

                                    <h1 className="
                                        text-2xl
                                        md:text-3xl
                                        font-bold
                                        text-gray-900
                                    ">

                                        {user.fullName}

                                    </h1>


                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        mt-2
                                    ">

                                        <span className="
                                            px-2.5 py-1
                                            rounded-full
                                            bg-blue-50
                                            text-blue-700
                                            text-xs
                                            font-semibold
                                            capitalize
                                        ">

                                            {user.role}

                                        </span>


                                        <span className="
                                            text-sm
                                            text-gray-500
                                        ">

                                            @{user.username}

                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* Edit Button */}

                            <button
                                onClick={() =>
                                    navigate("/patient/profile/edit")
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-4 py-2.5
                                    rounded-lg
                                    bg-blue-600
                                    hover:bg-blue-700
                                    text-white
                                    text-sm
                                    font-semibold
                                    transition
                                "
                            >

                                <Pencil size={16} />

                                Edit Profile

                            </button>


                        </div>

                    </div>



                    {/* -------------------------------- */}
                    {/* Personal Information */}
                    {/* -------------------------------- */}

                    <div className="px-6 md:px-8 py-8">


                        <div className="mb-6">

                            <h2 className="
                                text-lg
                                font-bold
                                text-gray-900
                            ">

                                Personal Information

                            </h2>

                            <p className="
                                text-sm
                                text-gray-500
                                mt-1
                            ">

                                Your personal information associated with your MediCare account.

                            </p>

                        </div>



                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-5
                        ">


                            {/* Full Name */}

                            <div>

                                <label className="
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">

                                    Full Name

                                </label>

                                <div className="
                                    mt-2
                                    px-4 py-3
                                    rounded-lg
                                    bg-gray-50
                                    border border-gray-100
                                    text-gray-800
                                ">

                                    {user.fullName}

                                </div>

                            </div>



                            {/* Username */}

                            <div>

                                <label className="
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">

                                    Username

                                </label>

                                <div className="
                                    mt-2
                                    px-4 py-3
                                    rounded-lg
                                    bg-gray-50
                                    border border-gray-100
                                    text-gray-800
                                ">

                                    @{user.username}

                                </div>

                            </div>



                            {/* Email */}

                            <div>

                                <label className="
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">

                                    Email Address

                                </label>

                                <div className="
                                    mt-2
                                    px-4 py-3
                                    rounded-lg
                                    bg-gray-50
                                    border border-gray-100
                                    text-gray-800
                                ">

                                    {user.email}

                                </div>

                            </div>



                            {/* Account Type */}

                            <div>

                                <label className="
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">

                                    Account Type

                                </label>

                                <div className="
                                    mt-2
                                    px-4 py-3
                                    rounded-lg
                                    bg-gray-50
                                    border border-gray-100
                                    text-gray-800
                                    capitalize
                                ">

                                    {user.role}

                                </div>

                            </div>

                        </div>

                    </div>



                    {/* -------------------------------- */}
                    {/* Account Information */}
                    {/* -------------------------------- */}

                    <div className="px-6 md:px-8 pb-8">

                        <div className="
                            bg-blue-50
                            border border-blue-100
                            rounded-xl
                            p-5
                            flex
                            items-start
                            gap-4
                        ">

                            <div className="
                                w-10 h-10
                                rounded-lg
                                bg-white
                                flex
                                items-center
                                justify-center
                                flex-shrink-0
                            ">

                                <CalendarDays
                                    size={20}
                                    className="text-blue-600"
                                />

                            </div>


                            <div>

                                <h3 className="
                                    font-semibold
                                    text-gray-900
                                ">

                                    Account Information

                                </h3>


                                <p className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                ">

                                    Member since {memberSince}

                                </p>


                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    mt-3
                                    text-sm
                                    text-green-700
                                ">

                                    <ShieldCheck size={17} />

                                    Your account is active and secure.

                                </div>

                            </div>

                        </div>

                    </div>


                </div>

            </div>

        </div>

    );

}

export default Profile;