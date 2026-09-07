import { Link } from "react-router-dom";
import {
    HeartPulse,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

function Footer() {

    return (

        <footer className="bg-gray-900 text-gray-300">

            {/* Main Footer */}

            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}

                    <div>

                        <Link
                            to="/"
                            className="flex items-center gap-2 text-2xl font-bold text-white"
                        >

                            <HeartPulse
                                size={28}
                                className="text-blue-400"
                            />

                            MediCare

                        </Link>

                        <p className="mt-4 text-sm leading-6 text-gray-400 max-w-sm">

                            Your trusted healthcare platform for
                            finding doctors, booking appointments,
                            and managing your healthcare journey.

                        </p>

                    </div>


                    {/* Quick Links */}

                    <div>

                        <h3 className="text-white font-semibold mb-4">

                            Quick Links

                        </h3>

                        <div className="flex flex-col gap-3 text-sm">

                            <Link
                                to="/"
                                className="hover:text-white transition"
                            >
                                Home
                            </Link>

                            <Link
                                to="/doctors"
                                className="hover:text-white transition"
                            >
                                Find Doctors
                            </Link>

                            <Link
                                to="/patient/dashboard"
                                className="hover:text-white transition"
                            >
                                My Appointments
                            </Link>

                            <Link
                                to="/patient/profile"
                                className="hover:text-white transition"
                            >
                                My Profile
                            </Link>

                        </div>

                    </div>


                    {/* For Patients */}

                    <div>

                        <h3 className="text-white font-semibold mb-4">

                            Patient Care

                        </h3>

                        <div className="flex flex-col gap-3 text-sm">

                            <Link
                                to="/doctors"
                                className="hover:text-white transition"
                            >
                                Find a Doctor
                            </Link>

                            <Link
                                to="/doctors"
                                className="hover:text-white transition"
                            >
                                Book Appointment
                            </Link>

                            <Link
                                to="/patient/dashboard"
                                className="hover:text-white transition"
                            >
                                Manage Appointments
                            </Link>

                            <Link
                                to="/patient/profile"
                                className="hover:text-white transition"
                            >
                                Account Settings
                            </Link>

                        </div>

                    </div>


                    {/* Contact */}

                    <div>

                        <h3 className="text-white font-semibold mb-4">

                            Contact Us

                        </h3>

                        <div className="space-y-4 text-sm">

                            <div className="flex items-start gap-3">

                                <MapPin
                                    size={18}
                                    className="text-blue-400 mt-0.5 shrink-0"
                                />

                                <span>
                                    MediCare Healthcare Center
                                    <br />
                                    New Delhi, India
                                </span>

                            </div>


                            <div className="flex items-center gap-3">

                                <Phone
                                    size={18}
                                    className="text-blue-400 shrink-0"
                                />

                                <span>
                                    +91 98765 43210
                                </span>

                            </div>


                            <div className="flex items-center gap-3">

                                <Mail
                                    size={18}
                                    className="text-blue-400 shrink-0"
                                />

                                <span>
                                    support@medicare.com
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* Bottom Footer */}

            <div className="border-t border-gray-800">

                <div className="max-w-7xl mx-auto px-6 py-5">

                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm">

                        <p className="text-gray-500">

                            © {new Date().getFullYear()} MediCare.
                            All rights reserved.

                        </p>


                        <div className="flex items-center gap-6">

                            <button
                                className="text-gray-500 hover:text-white transition"
                            >
                                Privacy Policy
                            </button>

                            <button
                                className="text-gray-500 hover:text-white transition"
                            >
                                Terms of Service
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </footer>

    );

}

export default Footer;