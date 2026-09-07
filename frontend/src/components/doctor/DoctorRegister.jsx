import { useContext,useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


import { AuthContext } from "../../context/AuthContext";

import api from "../../services/api";

import {
    UserRound,
    Mail,
    Lock,
    Stethoscope,
    GraduationCap,
    BriefcaseMedical,
    Building2,
    IndianRupee,
    FileText,
} from "lucide-react";


function DoctorRegister() {

    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({

        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",

        specialization: "",
        experience: "",
        consultationFee: "",
        qualification: "",
        hospital: "",
        bio: "",

    });


    const [loading, setLoading] = useState(false);

    const { fetchCurrentUser } = useContext(AuthContext);
    
    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        // ------------------------------
        // Password check
        // ------------------------------

        if ( formData.password !== formData.confirmPassword ) {

            toast.error( "Passwords do not match." );

            return;

        }


        try {

            setLoading(true);


            const response = await api.post(
                "/auth/register-doctor",
                {
                    fullName: formData.fullName,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,

                    specialization: formData.specialization,
                    experience: Number(formData.experience),
                    consultationFee: Number(formData.consultationFee),
                    qualification: formData.qualification,
                    hospital: formData.hospital,
                    bio: formData.bio,
                }
            );


            toast.success(
                response.data.message ||
                "Doctor registration  successful."
            );


            // --------------------------------
            // ADMIN ADDING DOCTOR
            // --------------------------------

            if (user?.role === "admin") {

                navigate("/admin/doctors");
                return;
            }

            // --------------------------------
            // NORMAL DOCTOR REGISTRATION
            // --------------------------------


            // Get the newly created logged-in user
            // await fetchCurrentUser();
            setUser(response.data.user);

            // Now ProtectedRoute knows that the user is a doctor
            navigate("/doctor/dashboard");

        }

        catch (err) {

            console.error(err);
            
            toast.error(
                err.response?.data?.message ||
                "Doctor registration failed."
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
                max-w-4xl
                bg-white
                rounded-2xl
                shadow-sm
                border
                border-gray-200
                p-6
                md:p-8
            ">


                {/* Header */}

                <div className="text-center mb-8">

                    <div className="
                        w-14
                        h-14
                        mx-auto
                        rounded-2xl
                        bg-blue-50
                        flex
                        items-center
                        justify-center
                        mb-4
                    ">

                        <Stethoscope
                            className="
                                text-blue-600
                            "
                            size={28}
                        />

                    </div>


                    <h1 className="
                        text-2xl
                        md:text-3xl
                        font-bold
                        text-gray-900
                    ">

                        Doctor Registration

                    </h1>


                    <p className="
                        text-gray-500
                        text-sm
                        mt-2
                    ">

                        Create your professional MediCare profile

                    </p>

                </div>



                <form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >


                    {/* ==========================
                        ACCOUNT INFORMATION
                    =========================== */}

                    <div>

                        <h2 className="
                            text-lg
                            font-semibold
                            text-gray-800
                            mb-4
                        ">

                            Account Information

                        </h2>


                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-4
                        ">


                            {/* Full Name */}

                            <InputField
                                icon={<UserRound size={18} />}
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />


                            {/* Username */}

                            <InputField
                                icon={<UserRound size={18} />}
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                required
                            />


                            {/* Email */}

                            <InputField
                                icon={<Mail size={18} />}
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />


                            {/* Password */}

                            <InputField
                                icon={<Lock size={18} />}
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                                required
                            />


                            {/* Confirm Password */}

                            <InputField
                                icon={<Lock size={18} />}
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                            />

                        </div>

                    </div>



                    {/* ==========================
                        PROFESSIONAL INFORMATION
                    =========================== */}

                    <div>

                        <h2 className="
                            text-lg
                            font-semibold
                            text-gray-800
                            mb-4
                        ">

                            Professional Information

                        </h2>


                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-4
                        ">


                            {/* Specialization */}

                            <InputField
                                icon={
                                    <BriefcaseMedical
                                        size={18}
                                    />
                                }
                                label="Specialization"
                                name="specialization"
                                value={
                                    formData.specialization
                                }
                                onChange={handleChange}
                                placeholder="e.g. Cardiologist"
                                required
                            />


                            {/* Qualification */}

                            <InputField
                                icon={
                                    <GraduationCap
                                        size={18}
                                    />
                                }
                                label="Qualification"
                                name="qualification"
                                value={
                                    formData.qualification
                                }
                                onChange={handleChange}
                                placeholder="e.g. MBBS, MD"
                                required
                            />


                            {/* Experience */}

                            <InputField
                                icon={
                                    <BriefcaseMedical
                                        size={18}
                                    />
                                }
                                label="Experience (Years)"
                                name="experience"
                                type="number"
                                min="0"
                                value={
                                    formData.experience
                                }
                                onChange={handleChange}
                                placeholder="e.g. 5"
                                required
                            />


                            {/* Consultation Fee */}

                            <InputField
                                icon={
                                    <IndianRupee
                                        size={18}
                                    />
                                }
                                label="Consultation Fee"
                                name="consultationFee"
                                type="number"
                                min="0"
                                value={
                                    formData.consultationFee
                                }
                                onChange={handleChange}
                                placeholder="e.g. 500"
                                required
                            />


                            {/* Hospital */}

                            <InputField
                                icon={
                                    <Building2
                                        size={18}
                                    />
                                }
                                label="Hospital"
                                name="hospital"
                                value={
                                    formData.hospital
                                }
                                onChange={handleChange}
                                placeholder="Hospital name"
                                required
                            />

                        </div>


                        {/* Bio */}

                        <div className="mt-4">

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">

                                <span className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <FileText
                                        size={17}
                                        className="
                                            text-gray-400
                                        "
                                    />

                                    Professional Bio

                                    <span className="
                                        text-gray-400
                                        font-normal
                                    ">

                                        (Optional)

                                    </span>

                                </span>

                            </label>


                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                maxLength="500"
                                placeholder="
                                    Tell patients about your experience,
                                    expertise and approach...
                                "
                                className="
                                    w-full
                                    border
                                    border-gray-200
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-sm
                                    text-gray-700
                                    outline-none
                                    resize-none
                                    focus:border-blue-400
                                    focus:ring-2
                                    focus:ring-blue-100
                                    transition
                                "
                            />

                        </div>

                    </div>



                    {/* Submit */}

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
                        "
                    >

                        {loading
                            ? "Creating Doctor Account..."
                            : "Register as Doctor"
                        }

                    </button>


                    {/* Login */}

                    <p className="
                        text-center
                        text-sm
                        text-gray-500
                    ">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="
                                text-blue-600
                                font-medium
                                hover:text-blue-700
                            "
                        >

                            Login

                        </Link>

                    </p>

                </form>

            </div>

        </div>

    );

}


function InputField({
    icon,
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required,
    min,
}) {

    return (

        <div>

            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
            ">

                {label}

            </label>


            <div className="relative">

                <div className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                ">

                    {icon}

                </div>


                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    min={min}
                    className="
                        w-full
                        border
                        border-gray-200
                        rounded-xl
                        pl-10
                        pr-4
                        py-3
                        text-sm
                        text-gray-700
                        outline-none
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                        transition
                    "
                />

            </div>

        </div>

    );

}


export default DoctorRegister;