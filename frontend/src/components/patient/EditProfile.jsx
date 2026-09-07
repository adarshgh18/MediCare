import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

import {
    ArrowLeft,
    User,
    Mail,
    AtSign,
    Save,
    X,
} from "lucide-react";


function EditProfile() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        role: "",
    });


    // ----------------------------------
    // Fetch Current Profile
    // ----------------------------------

    const fetchProfile = async () => {

        try {

            const response = await api.get("/users/profile");

            const user = response.data.user;

            setFormData({
                fullName: user.fullName || "",
                username: user.username || "",
                email: user.email || "",
                role: user.role || "",
            });

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
    // Handle Input
    // ----------------------------------

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // ----------------------------------
    // Save Profile
    // ----------------------------------

    const handleSave = async () => {

        if (!formData.fullName.trim()) {

            toast.error("Full name is required.");

            return;

        }


        if (!formData.username.trim()) {

            toast.error("Username is required.");

            return;

        }


        if (!formData.email.trim()) {

            toast.error("Email is required.");

            return;

        }


        try {

            setSaving(true);

            const response = await api.patch(
                "/users/profile",
                formData
            );


            toast.success(
                response.data.message ||
                "Profile updated successfully!"
            );


            // Go back to profile after successful update

            setTimeout(() => {

                navigate("/patient/profile");

            }, 800);

        }

        catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message ||
                "Unable to update profile."
            );

        }

        finally {

            setSaving(false);

        }

    };


    // ----------------------------------
    // Loading
    // ----------------------------------

    if (loading) {

        return (

            <div className="
                min-h-[70vh]
                flex
                items-center
                justify-center
            ">

                <p className="text-gray-500">

                    Loading profile...

                </p>

            </div>

        );

    }


    return (

        <div className="min-h-screen  ">

            <div className="max-w-4xl mx-auto px-4 py-10">


                {/* Back Button */}

                <button
                    onClick={() => navigate("/patient/profile")}
                    className="
                        flex
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

                    <ArrowLeft size={18} />

                    Back to Profile

                </button>



                {/* Edit Card */}

                <div className="
                    bg-white
                    rounded-2xl
                    border border-gray-200
                    shadow-sm
                    overflow-hidden
                ">


                    {/* Header */}

                    <div className="
                        px-6 md:px-8
                        py-7
                        border-b border-gray-200
                    ">

                        <h1 className="
                            text-2xl
                            md:text-3xl
                            font-bold
                            text-gray-900
                        ">

                            Edit Profile

                        </h1>


                        <p className="
                            text-sm
                            text-gray-500
                            mt-2
                        ">

                            Update your personal information.

                        </p>

                    </div>



                    {/* Form */}

                    <div className="px-6 md:px-8 py-8">


                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-6
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


                                <div className="relative mt-2">

                                    <User
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
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="
                                            w-full
                                            pl-10 pr-4 py-3
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-50
                                            outline-none
                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-100
                                        "
                                    />

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


                                <div className="relative mt-2">

                                    <AtSign
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
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="
                                            w-full
                                            pl-10 pr-4 py-3
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-50
                                            outline-none
                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-100
                                        "
                                    />

                                </div>

                            </div>



                            {/* Email */}

                            <div >

                                <label className="
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">

                                    Email Address

                                </label>


                                <div className="relative mt-2">

                                    <Mail
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
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="
                                            w-full
                                            pl-10 pr-4 py-3
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-50
                                            outline-none
                                            focus:border-blue-500
                                            focus:ring-2
                                            focus:ring-blue-100
                                        "
                                    />

                                </div>

                                
                            </div>

                            {/* Role */}

                            <div>

                                <label className="
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                        ">
                                    Role
                                </label>

                                <input
                                    type="text"
                                    value={formData.role}
                                    disabled
                                    className="
                                            mt-2
                                            w-full
                                            px-4 py-3
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-100
                                            text-gray-500
                                            capitalize
                                            cursor-not-allowed
                                        "
                                />

                                <p className="text-xs text-gray-400 mt-1">
                                    Account role cannot be changed.
                                </p>

                            </div>

                        </div>


                        {/* Buttons */}

                        <div className="
                            mt-8
                            pt-6
                            border-t border-gray-200
                            flex
                            flex-col-reverse
                            sm:flex-row
                            justify-end
                            gap-3
                        ">


                            <button
                                onClick={() =>
                                    navigate("/patient/profile")
                                }
                                disabled={saving}
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-5 py-2.5
                                    rounded-lg
                                    border border-gray-200
                                    text-gray-600
                                    hover:bg-gray-50
                                    font-medium
                                    transition
                                "
                            >

                                <X size={17} />

                                Cancel

                            </button>



                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-5 py-2.5
                                    rounded-lg
                                    bg-blue-600
                                    hover:bg-blue-700
                                    disabled:bg-blue-300
                                    disabled:cursor-not-allowed
                                    text-white
                                    font-semibold
                                    transition
                                "
                            >

                                <Save size={17} />

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default EditProfile;