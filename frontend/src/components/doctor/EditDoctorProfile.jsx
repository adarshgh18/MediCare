import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

function EditDoctorProfile() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        specialization: "",
        experience: "",
        consultationFee: "",
        qualification: "",
        hospital: "",
        bio: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    // Fetch existing profile

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await api.get("/doctors/me");

                const doctor = response.data.doctor;

                setFormData({
                    specialization: doctor.specialization || "",
                    experience: doctor.experience || "",
                    consultationFee: doctor.consultationFee || "",
                    qualification: doctor.qualification || "",
                    hospital: doctor.hospital || "",
                    bio: doctor.bio || "",
                });

            } catch (error) {

                console.error("Error fetching doctor profile:", error);

                setError("Unable to load your profile.");

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);


    // Handle input changes

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // Submit form

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);
        setError("");

        try {

            await api.put("/doctors/me", {
                specialization: formData.specialization,
                experience: Number(formData.experience),
                consultationFee: Number(formData.consultationFee),
                qualification: formData.qualification,
                hospital: formData.hospital,
                bio: formData.bio,
            });

            toast.success("Profile updated successfully!");
            navigate("/doctor/profile");

        } catch (error) {

            console.error("Error updating doctor profile:", error);

            setError(
                error.response?.data?.message ||
                "Unable to update your profile."
            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (
            <div className="max-w-4xl mx-auto px-4 py-10 text-center">

                <p className="text-gray-500">
                    Loading profile...
                </p>

            </div>
        );

    }


    return (
        <div className="max-w-4xl mx-auto px-4 py-8">

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

                {/* Header */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-800">
                        Edit Profile
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Update your professional information.
                    </p>

                </div>


                {/* Error */}

                {error && (

                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">

                        {error}

                    </div>

                )}


                <form onSubmit={handleSubmit}>

                    {/* Basic Information */}

                    <div className="grid md:grid-cols-2 gap-5">

                        {/* Specialization */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specialization
                            </label>

                            <input
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Experience */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experience (Years)
                            </label>

                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                min="0"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Consultation Fee */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Consultation Fee (₹)
                            </label>

                            <input
                                type="number"
                                name="consultationFee"
                                value={formData.consultationFee}
                                onChange={handleChange}
                                min="0"
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Qualification */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Qualification
                            </label>

                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Hospital */}

                        <div className="md:col-span-2">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hospital
                            </label>

                            <input
                                type="text"
                                name="hospital"
                                value={formData.hospital}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Bio */}

                        <div className="md:col-span-2">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                About / Bio
                            </label>

                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="5"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Write something about yourself..."
                            />

                        </div>

                    </div>


                    {/* Buttons */}

                    <div className="flex justify-end gap-3 mt-8">

                        <button
                            type="button"
                            onClick={() => navigate("/doctor/profile")}
                            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60"
                        >

                            {saving ? "Saving..." : "Save Changes"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditDoctorProfile;