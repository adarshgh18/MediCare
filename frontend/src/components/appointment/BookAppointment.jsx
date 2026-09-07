import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../services/apiError";

import {
    CalendarDays,
    Clock3,
    UserRound,
    Building2,
    IndianRupee,
    FileText,
    ShieldCheck,
    Stethoscope,
} from "lucide-react";


function BookAppointment() {

    const { doctorId } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);

    const [appointmentDate, setAppointmentDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(false);


    // -----------------------------------
    // Selected day
    // -----------------------------------

    const selectedDay = appointmentDate
        ? new Date(appointmentDate).toLocaleDateString("en-US", {
            weekday: "long",
        })
        : "";


    // -----------------------------------
    // Available slots for selected day
    // -----------------------------------

    const availableDay = doctor?.availability?.find(
        (day) => day.day === selectedDay
    );


    // -----------------------------------
    // Fetch doctor
    // -----------------------------------

    const fetchDoctor = async () => {

        try {

            const response = await api.get(`/doctors/${doctorId}`);

            setDoctor(response.data.doctor);

        }

        catch (err) {

            console.error("Fetch doctor error:", err);

            toast.error(
                getApiErrorMessage(
                    err,
                    "Unable to load doctor details."
                )
            );
        }

    };


    useEffect(() => {

        fetchDoctor();

    }, [doctorId]);


    // -----------------------------------
    // Handle date change
    // -----------------------------------

    const handleDateChange = (e) => {

        setAppointmentDate(e.target.value);

        // Reset previously selected slot
        setSelectedSlot("");

    };


    // -----------------------------------
    // Book appointment
    // -----------------------------------

    const handleSubmit = async () => {

        if (!appointmentDate) {

            toast.error("Please select an appointment date.");

            return;

        }


        if (!selectedSlot) {

            toast.error("Please select a time slot.");

            return;

        }


        if (!reason.trim()) {

            toast.error("Please enter the reason for your visit.");

            return;

        }


        try {

            setLoading(true);


            const response = await api.post(
                "/appointments",
                {
                    doctorId,
                    appointmentDate,
                    timeSlot: selectedSlot,
                    reason: reason.trim(),
                }
            );


            console.log(response.data);


            toast.success("Appointment booked successfully!");


            setTimeout(() => {

                navigate("/patient/dashboard");

            }, 1000);

        }

        catch (err) {

            console.error("Booking appointment error:", err);

            toast.error(
                getApiErrorMessage(
                    err,
                    "Unable to book appointment. Please try again."
                )
            );

        }

        finally {

            setLoading(false);

        }

    };


    // -----------------------------------
    // Loading
    // -----------------------------------

    if (!doctor) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="text-gray-500">
                    Loading doctor details...
                </div>

            </div>

        );

    }


    // -----------------------------------
    // Today's date
    // -----------------------------------

    const today = new Date()
        .toISOString()
        .split("T")[0];


    return (

        <div className="min-h-screen  ">

            <div className="max-w-6xl mx-auto px-4 py-10">

                {/* -------------------------------- */}
                {/* Page Header */}
                {/* -------------------------------- */}

                <div className="mb-8">

                    <p className="text-sm font-semibold tracking-[0.18em] text-blue-600 uppercase">

                        Appointment Booking

                    </p>


                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">

                        Book your consultation

                    </h1>


                    <p className="text-gray-500 mt-3 max-w-2xl">

                        Choose a convenient time with your specialist.
                        Your appointment details will be confirmed instantly.

                    </p>

                </div>



                {/* -------------------------------- */}
                {/* Main Layout */}
                {/* -------------------------------- */}

                <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-6">


                    {/* ================================= */}
                    {/* LEFT SIDE */}
                    {/* ================================= */}

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">


                        {/* Doctor Information */}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-7 border-b border-gray-200">


                            <div className="flex items-center gap-4">


                                {/* Doctor Image / Initials */}

                                {

                                    doctor.image ? (

                                        <img
                                            src={doctor.image}
                                            alt={doctor.user.fullName}
                                            className="w-20 h-20 rounded-2xl object-cover border border-gray-200"
                                        />

                                    ) : (

                                        <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center">

                                            <span className="text-2xl font-bold text-blue-600">

                                                {doctor.user.fullName
                                                    ?.split(" ")
                                                    .map((name) => name[0])
                                                    .join("")
                                                    .slice(0, 2)
                                                    .toUpperCase()
                                                }

                                            </span>

                                        </div>

                                    )

                                }


                                <div>

                                    <div className="flex items-center gap-2 flex-wrap">

                                        <h2 className="text-xl font-bold text-gray-900">

                                            Dr. {doctor.user.fullName}

                                        </h2>


                                        <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">

                                            Available

                                        </span>

                                    </div>


                                    <p className="text-gray-500 mt-1">

                                        {doctor.specialization}

                                        {" · "}

                                        {doctor.experience} years experience

                                    </p>


                                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">

                                        <Building2 size={16} />

                                        {doctor.hospital}

                                    </div>

                                </div>

                            </div>


                            {/* Fee */}

                            <div className="sm:text-right">

                                <p className="text-2xl font-bold text-gray-900">

                                    ₹{doctor.consultationFee}

                                </p>

                                <p className="text-sm text-gray-500">

                                    per visit

                                </p>

                            </div>

                        </div>



                        {/* ================================= */}
                        {/* Appointment Date */}
                        {/* ================================= */}

                        <div className="mt-8">

                            <label className="block text-sm font-semibold text-gray-800 mb-3">

                                Appointment date

                            </label>


                            <div className="relative">

                                <CalendarDays
                                    size={20}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />


                                <input
                                    type="date"
                                    min={today}
                                    value={appointmentDate}
                                    onChange={handleDateChange}
                                    className="
                                        w-full
                                        border border-gray-200
                                        rounded-xl
                                        px-12 py-3.5
                                        text-gray-800
                                        bg-gray-50
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                        transition
                                    "
                                />

                            </div>

                        </div>



                        {/* ================================= */}
                        {/* Time Slots */}
                        {/* ================================= */}

                        <div className="mt-8">

                            <div className="flex items-center justify-between mb-3">

                                <label className="text-sm font-semibold text-gray-800">

                                    Select a time slot

                                </label>


                                {
                                    selectedDay && availableDay && (

                                        <span className="text-xs text-gray-500">

                                            {selectedDay}

                                        </span>

                                    )
                                }

                            </div>


                            {

                                !appointmentDate ? (

                                    <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center">

                                        <Clock3
                                            size={24}
                                            className="mx-auto text-gray-400 mb-2"
                                        />

                                        <p className="text-sm text-gray-500">

                                            Select a date to see available time slots.

                                        </p>

                                    </div>

                                ) : !availableDay ? (

                                    <div className="border border-red-100 bg-red-50 rounded-xl p-5">

                                        <p className="text-sm text-red-600">

                                            {doctor.user.fullName} is not available on{" "}

                                            <span className="font-semibold">

                                                {selectedDay}

                                            </span>

                                            .

                                        </p>

                                    </div>

                                ) : availableDay.slots.length === 0 ? (

                                    <div className="border border-gray-200 bg-gray-50 rounded-xl p-5">

                                        <p className="text-sm text-gray-500">

                                            No time slots are available for this day.

                                        </p>

                                    </div>

                                ) : (

                                    <div className="flex flex-wrap gap-3">

                                        {

                                            availableDay.slots.map((slot) => (

                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedSlot(slot)
                                                    }
                                                    className={`
                                                        px-5 py-2.5
                                                        rounded-xl
                                                        border
                                                        text-sm
                                                        font-semibold
                                                        transition
                                                        ${
                                                            selectedSlot === slot
                                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                                                        }
                                                    `}
                                                >

                                                    {slot}

                                                </button>

                                            ))

                                        }

                                    </div>

                                )

                            }

                        </div>



                        {/* ================================= */}
                        {/* Reason */}
                        {/* ================================= */}

                        <div className="mt-8">

                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">

                                <FileText size={17} />

                                Reason for visit

                            </label>


                            <textarea
                                rows="5"
                                value={reason}
                                onChange={(e) =>
                                    setReason(e.target.value)
                                }
                                placeholder="Briefly describe your symptoms or reason for consultation..."
                                className="
                                    w-full
                                    border border-gray-200
                                    rounded-xl
                                    px-4 py-3
                                    text-gray-800
                                    bg-gray-50
                                    resize-none
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                    transition
                                "
                            />

                        </div>



                        {/* ================================= */}
                        {/* Confirm Button */}
                        {/* ================================= */}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="
                                mt-8
                                w-full
                                bg-blue-600
                                hover:bg-blue-700
                                disabled:bg-blue-300
                                disabled:cursor-not-allowed
                                text-white
                                py-3.5
                                rounded-xl
                                font-semibold
                                transition
                                shadow-sm
                            "
                        >

                            {loading
                                ? "Booking Appointment..."
                                : "Confirm Appointment"
                            }

                        </button>

                    </div>



                    {/* ================================= */}
                    {/* RIGHT SIDE - BOOKING SUMMARY */}
                    {/* ================================= */}

                    <div className="lg:sticky lg:top-24 h-fit">


                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">


                            {/* Summary Header */}

                            <div className="flex items-center gap-3 pb-5 border-b border-gray-200">

                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                                    <Stethoscope
                                        size={21}
                                        className="text-blue-600"
                                    />

                                </div>


                                <h2 className="text-lg font-bold text-gray-900">

                                    Booking summary

                                </h2>

                            </div>



                            {/* Summary Details */}

                            <div className="space-y-5 py-6">


                                {/* Doctor */}

                                <div className="flex items-center justify-between gap-4">

                                    <div className="flex items-center gap-3 text-gray-500">

                                        <UserRound size={18} />

                                        <span>
                                            Doctor
                                        </span>

                                    </div>


                                    <span className="font-semibold text-gray-900 text-right">

                                        {doctor.user.fullName}

                                    </span>

                                </div>



                                {/* Date */}

                                <div className="flex items-center justify-between gap-4">

                                    <div className="flex items-center gap-3 text-gray-500">

                                        <CalendarDays size={18} />

                                        <span>
                                            Date
                                        </span>

                                    </div>


                                    <span className="font-semibold text-gray-900 text-right">

                                        {
                                            appointmentDate
                                                ? new Date(
                                                    appointmentDate
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )
                                                : "Select a date"
                                        }

                                    </span>

                                </div>



                                {/* Time */}

                                <div className="flex items-center justify-between gap-4">

                                    <div className="flex items-center gap-3 text-gray-500">

                                        <Clock3 size={18} />

                                        <span>
                                            Time
                                        </span>

                                    </div>


                                    <span className="font-semibold text-gray-900 text-right">

                                        {selectedSlot || "Select a slot"}

                                    </span>

                                </div>

                            </div>



                            {/* Fee */}

                            <div className="border-t border-gray-200 pt-5">

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3 text-gray-500">

                                        <IndianRupee size={18} />

                                        <span>
                                            Consultation fee
                                        </span>

                                    </div>


                                    <span className="text-xl font-bold text-gray-900">

                                        ₹{doctor.consultationFee}

                                    </span>

                                </div>

                            </div>



                            {/* Privacy */}

                            <div className="mt-6 bg-gray-50 rounded-xl p-4 flex gap-3">

                                <ShieldCheck
                                    size={21}
                                    className="text-blue-600 flex-shrink-0 mt-0.5"
                                />


                                <p className="text-sm text-gray-500 leading-5">

                                    Your information is private and securely
                                    handled by MediCare.

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default BookAppointment;