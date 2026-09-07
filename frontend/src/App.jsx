import { useEffect, useState } from "react";
import ServerError from "./components/common/ServerError";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorRegister from "./components/doctor/DoctorRegister";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import PatientDashboard from "./components/patient/PatientDashboard";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import BookAppointment from "./components/appointment/BookAppointment";

import DoctorProfile from "./components/doctor/DoctorProfile";
import EditDoctorProfile from "./components/doctor/EditDoctorProfile";
import DoctorAvailability from "./components/doctor/DoctorAvailability";

import Profile from "./components/patient/profile";
import EditProfile from "./components/patient/EditProfile";
import AppointmentDetails from "./components/appointment/AppointmentDetails";

import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";

import AdminDoctors from "./components/admin/AdminDoctors";
import AdminPatients from "./components/admin/AdminPatients";
import AdminAppointments from "./components/admin/AdminAppointments";
import AdminDoctorDetails from "./components/admin/AdminDoctorDetails";
import AdminPatientDetails from "./components/admin/AdminPatientDetails";

function App() {

    const [backendOffline, setBackendOffline] = useState(false);


    useEffect(() => {

        const handleBackendOffline = () => {
            setBackendOffline(true);
        };

        window.addEventListener(
            "backend-offline",
            handleBackendOffline
        );


        return () => {

            window.removeEventListener(
                "backend-offline",
                handleBackendOffline
            );

        };

    }, []);


    const handleRetry = () => {
        window.location.reload();
    };



    if (backendOffline) {

        return (
            <ServerError
                onRetry={handleRetry}
            />
        );

    }


    return (

        <BrowserRouter>

            <Routes>

                {/* ===================================== */}
                {/* NORMAL APPLICATION */}
                {/* ===================================== */}

                <Route element={<Layout />}>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/doctor/register"
                        element={<DoctorRegister />}
                    />

                    <Route
                        path="/doctors"
                        element={<Doctors />}
                    />

                    <Route
                        path="/doctors/:id"
                        element={<DoctorDetails />}
                    />

                    <Route
                        path="/patient/dashboard"
                        element={
                            <ProtectedRoute allowedRole="patient">
                                <PatientDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/doctor/dashboard"
                        element={
                            <ProtectedRoute allowedRole="doctor">
                                <DoctorDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/book-appointment/:doctorId"
                        element={
                            <ProtectedRoute allowedRole="patient">
                                <BookAppointment />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/doctor/profile"
                        element={<DoctorProfile />}
                    />

                    <Route
                        path="/doctor/profile/edit"
                        element={<EditDoctorProfile />}
                    />

                    <Route
                        path="/doctor/availability"
                        element={<DoctorAvailability />}
                    />

                    <Route
                        path="/patient/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/patient/profile/edit"
                        element={<EditProfile />}
                    />

                    <Route
                        path="/patient/appointments/:appointmentId"
                        element={<AppointmentDetails />}
                    />

                    <Route
                        path="/unauthorized"
                        element={<Unauthorized />}
                    />

                    <Route
                        path="*"
                        element={<NotFound />}
                    />

                </Route>


                {/* ===================================== */}
                {/* ADMIN APPLICATION */}
                {/* ===================================== */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminLayout>
                                <AdminDashboard />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/doctors"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminLayout>
                                <AdminDoctors />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/patients"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminLayout>
                                <AdminPatients />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/patients/:id"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminLayout>
                                <AdminPatientDetails />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/appointments"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminLayout>
                                <AdminAppointments />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/doctors/:id"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminLayout>
                                <AdminDoctorDetails />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />


            </Routes>

        </BrowserRouter>

    );

}

export default App;

