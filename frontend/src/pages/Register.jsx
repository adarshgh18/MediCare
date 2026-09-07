import { useContext,useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    HeartPulse,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";


function Register() {

    const { setUser } = useContext(AuthContext);

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);


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
    // Submit
    // ----------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();


        const {
            fullName,
            username,
            email,
            password,
            confirmPassword,
        } = formData;


        // Basic validation

        if (
            !fullName.trim() ||
            !username.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {

            toast.error("Please fill in all fields.");

            return;

        }


        // Password confirmation

        if (password !== confirmPassword) {

            toast.error("Passwords do not match.");

            return;

        }


        try {

            setLoading(true);


            const response = await api.post(
                "/auth/register",
                {
                    fullName: fullName.trim(),
                    username: username.trim(),
                    email: email.trim(),
                    password,
                }
            );


            toast.success(
                response.data.message ||
                "Registration successful."
            );

            setUser(response.data.user);
            navigate("/patient/dashboard");

        }

        catch (err) {

            console.log("Registration error:", err);
            console.log(
                "Backend response:",
                err.response?.data
            );


            toast.error(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            px-4
            py-10
        ">

            <div className="
                w-full
                max-w-5xl
                bg-white
                rounded-3xl
                shadow-sm
                border
                border-gray-200
                overflow-hidden
                grid
                lg:grid-cols-2
            ">


                {/* -------------------------------- */}
                {/* Left Section */}
                {/* -------------------------------- */}

                <div className="
                    hidden
                    lg:flex
                    flex-col
                    justify-between
                    bg-blue-600
                    text-white
                    p-10
                ">

                    <div>

                        <div className="
                            w-12
                            h-12
                            rounded-xl
                            bg-white/15
                            flex
                            items-center
                            justify-center
                            mb-6
                        ">

                            <HeartPulse size={26} />

                        </div>


                        <h1 className="
                            text-4xl
                            font-bold
                            leading-tight
                        ">

                            Your health,
                            <br />
                            our priority.

                        </h1>


                        <p className="
                            text-blue-100
                            mt-5
                            leading-7
                            max-w-md
                        ">

                            Create your MediCare account and
                            manage your healthcare appointments
                            with ease.

                        </p>

                    </div>


                    <p className="
                        text-sm
                        text-blue-100
                    ">

                        Secure healthcare management with MediCare.

                    </p>

                </div>


                {/* -------------------------------- */}
                {/* Form Section */}
                {/* -------------------------------- */}

                <div className="p-7 md:p-10">


                    {/* Header */}

                    <div className="mb-8">

                        <p className="
                            text-sm
                            font-semibold
                            tracking-widest
                            uppercase
                            text-blue-600
                        ">

                            MediCare

                        </p>


                        <h2 className="
                            text-3xl
                            font-bold
                            text-gray-900
                            mt-2
                        ">

                            Create your account

                        </h2>


                        <p className="
                            text-gray-500
                            mt-2
                            text-sm
                        ">

                            Join MediCare and take control of
                            your healthcare journey.

                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        autoComplete="off"
                        className="space-y-5"
                    >


                        {/* Full Name */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">

                                Full Name

                            </label>


                            <div className="relative">

                                <User
                                    size={18}
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
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="
                                        w-full
                                        border
                                        border-gray-200
                                        rounded-xl
                                        pl-11
                                        pr-4
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        transition
                                    "
                                />

                            </div>

                        </div>


                        {/* Username */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">

                                Username

                            </label>


                            <div className="relative">

                                <User
                                    size={18}
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
                                    name="username"
                                    autoComplete="new-username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    className="
                                        w-full
                                        border
                                        border-gray-200
                                        rounded-xl
                                        pl-11
                                        pr-4
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        transition
                                    "
                                />

                            </div>

                        </div>


                        {/* Email */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">

                                Email Address

                            </label>


                            <div className="relative">

                                <Mail
                                    size={18}
                                    className="
                                        absolute
                                        left-4
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
                                    placeholder="Enter your email"
                                    className="
                                        w-full
                                        border
                                        border-gray-200
                                        rounded-xl
                                        pl-11
                                        pr-4
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        transition
                                    "
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">

                                Password

                            </label>


                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                    "
                                />


                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    className="
                                        w-full
                                        border
                                        border-gray-200
                                        rounded-xl
                                        pl-11
                                        pr-12
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        transition
                                    "
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                        hover:text-gray-600
                                    "
                                >

                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }

                                </button>

                            </div>

                        </div>


                        {/* Confirm Password */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">

                                Confirm Password

                            </label>


                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                    "
                                />


                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    autoComplete="new-password"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className="
                                        w-full
                                        border
                                        border-gray-200
                                        rounded-xl
                                        pl-11
                                        pr-12
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        transition
                                    "
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                        hover:text-gray-600
                                    "
                                >

                                    {showConfirmPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }

                                </button>

                            </div>

                        </div>


                        {/* Register Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                bg-blue-600
                                hover:bg-blue-700
                                disabled:bg-blue-300
                                disabled:cursor-not-allowed
                                text-white
                                py-3
                                rounded-xl
                                font-semibold
                                transition
                                shadow-sm
                            "
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account"
                            }

                        </button>


                        {/* Doctor Registration */}

                        <p className="
                            text-center
                            mt-4
                            text-sm
                            text-gray-500
                        ">

                            Are you a doctor?{" "}

                            <Link
                                to="/doctor/register"
                                className="
                                    text-blue-600
                                    transition
                                    font-medium
                                    hover:text-blue-700
                                "
                            >

                                Register as a Doctor

                            </Link>

                        </p>

                    </form>


                    {/* Login */}

                    <p className="
                        text-center
                        text-sm
                        text-gray-500
                        mt-6
                    ">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="
                                text-blue-600
                                font-semibold
                                hover:text-blue-700
                            "
                        >

                            Login

                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );

}


export default Register;