import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

import {
    FaArrowLeft,
    FaCalendarAlt,
    FaPlus,
    FaTrash,
    FaClock,
    FaSave,
} from "react-icons/fa";


function DoctorAvailability() {

    const navigate = useNavigate();

    const [availability, setAvailability] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const sortSlots = (slots) => {

        return [...slots].sort(
            (a, b) =>
                convertTo24Hour(a).localeCompare(
                    convertTo24Hour(b)
                )
        );
    };

    const convertTo24Hour = (time) => {

        if (!time) return "";

        const [timePart, modifier] = time.split(" ");

        let [hours, minutes] = timePart.split(":");

        if (modifier === "PM" && hours !== "12") {
            hours = String(Number(hours) + 12);
        }

        if (modifier === "AM" && hours === "12") {
            hours = "00";
        }

        return `${hours.padStart(2, "0")}:${minutes}`;
    };


    const convertTo12Hour = (time) => {

        if (!time) return "";

        let [hours, minutes] = time.split(":");

        hours = Number(hours);

        const modifier = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12;

        return `${String(hours).padStart(2, "0")}:${minutes} ${modifier}`;
    };


    // Fetch current availability

    useEffect(() => {

        const fetchAvailability = async () => {

            try {

                const response = await api.get("/doctors/me");

                setAvailability(
                    response.data.doctor.availability || []
                );

            } catch (error) {

                console.error(
                    "Error fetching availability:",
                    error
                );

                toast.error(
                    "Unable to load availability."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchAvailability();

    }, []);


    // Add a new day

    const addDay = () => {

        const daysOfWeek = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ];

        const availableDay = daysOfWeek.find(
            (day) =>
                !availability.some(
                    (item) => item.day === day
                )
        );

        if (!availableDay) {

            toast.error("All days have already been added.");

            return;
        }

        setAvailability((prev) => [
            ...prev,
            {
                day: availableDay,
                slots: [],
            },
        ]);
    };


    // Remove a day

    const removeDay = (dayIndex) => {

        setAvailability((prev) =>
            prev.filter(
                (_, index) => index !== dayIndex
            )
        );

    };


    // Change day name

    const updateDay = (dayIndex, value) => {

        setAvailability((prev) => {

            const updated = [...prev];

            updated[dayIndex] = {
                ...updated[dayIndex],
                day: value,
            };

            return updated;

        });

    };


    // Add slot

    const addSlot = (dayIndex) => {

        setAvailability((prev) => {

            const updated = [...prev];

            updated[dayIndex] = {
                ...updated[dayIndex],
                slots: [
                    ...updated[dayIndex].slots,
                    "09:00 AM",
                ],
            };

            return updated;

        });

    };


    // Update slot

    const updateSlot = (
        dayIndex,
        slotIndex,
        value
    ) => {

        setAvailability((prev) => {

            const updated = [...prev];

            const currentSlots = [
                ...updated[dayIndex].slots,
            ];

            if (
                value &&
                currentSlots.some(
                    (slot, index) =>
                        index !== slotIndex &&
                        slot === value
                )
            ) {

                toast.error(
                    "This time slot already exists."
                );

                return prev;
            }

            currentSlots[slotIndex] = value;

            updated[dayIndex] = {
                ...updated[dayIndex],
                slots: currentSlots,
            };

            return updated;
        });
    };


    // Remove slot

    const removeSlot = (
        dayIndex,
        slotIndex
    ) => {

        setAvailability((prev) => {

            const updated = [...prev];

            updated[dayIndex] = {
                ...updated[dayIndex],

                slots: updated[dayIndex].slots.filter(
                    (_, index) =>
                        index !== slotIndex
                ),
            };

            return updated;

        });

    };


    // Save availability

    const handleSave = async () => {

        // Check every day
        for (const day of availability) {

            if (!day.day) {

                toast.error("Please select a day.");

                return;
            }

            if (!day.slots || day.slots.length === 0) {

                toast.error(
                    `${day.day} must have at least one time slot.`
                );

                return;
            }

            // Check empty slots
            if (
                day.slots.some(
                    (slot) => !slot || !slot.trim()
                )
            ) {

                toast.error(
                    `Please fill all time slots for ${day.day}.`
                );

                return;
            }

            // Check duplicate slots
            const uniqueSlots = new Set(day.slots);

            if (
                uniqueSlots.size !== day.slots.length
            ) {

                toast.error(
                    `Duplicate time slots found on ${day.day}.`
                );

                return;
            }
        }


        // Check duplicate days

        const days = availability.map(
            (item) => item.day
        );

        const uniqueDays = new Set(days);

        if (
            uniqueDays.size !== days.length
        ) {

            toast.error(
                "The same day cannot be added twice."
            );

            return;
        }


        setSaving(true);

        const cleanedAvailability =
            availability.map((day) => ({
                ...day,
                slots: sortSlots(day.slots),
            }));

        try {

            await api.put(
                "/doctors/availability",
                {
                    availability: cleanedAvailability,
                }
            );

            toast.success(
                "Availability updated successfully!"
            );

            navigate("/doctor/profile");

        } catch (error) {

            console.error(
                "Error updating availability:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to update availability."
            );

        } finally {

            setSaving(false);

        }
    };


    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">

                <p className="text-gray-500">
                    Loading availability...
                </p>

            </div>
        );

    }
    

    return (
        // <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="min-h-screen   py-8 px-4">

            <div className="max-w-3xl mx-auto">

                {/* Main Card */}

                {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200"> */}
                <div className="bg-white/50 rounded-2xl shadow-sm p-6 md:p-8">

                    {/* Header */}

                    <div className="px-6 md:px-8 py-6 border-b border-gray-200">

                        <button
                            onClick={() =>
                                navigate("/doctor/profile")
                            }
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-5"
                        >

                            <FaArrowLeft />

                            Back to Profile

                        </button>


                        <div className="flex items-center gap-4">

                            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">

                                <FaCalendarAlt className="text-blue-600 text-lg" />

                            </div>


                            <div>

                                <h1 className="text-2xl font-bold text-gray-800">

                                    Manage Availability

                                </h1>

                                <p className="text-sm text-gray-500 mt-1">

                                    Set the days and time slots when
                                    patients can book appointments.

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Availability */}

                    <div className="p-6 md:p-8">

                        {availability.length === 0 ? (

                            <div className="text-center py-10">

                                <FaCalendarAlt className="mx-auto text-gray-300 text-4xl mb-3" />

                                <p className="text-gray-500 mb-5">

                                    No availability added yet.

                                </p>


                                <button
                                    onClick={addDay}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
                                >

                                    <FaPlus />

                                    Add Day

                                </button>

                            </div>

                        ) : (

                            <div className="space-y-5">

                                {availability.map(
                                    (day, dayIndex) => (

                                        <div
                                            key={dayIndex}
                                            className="border border-gray-200 rounded-xl p-5"
                                        >

                                            {/* Day Header */}

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">

                                                <select
                                                    value={day.day}
                                                    onChange={(e) =>
                                                        updateDay(
                                                            dayIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >

                                                    <option>
                                                        Monday
                                                    </option>

                                                    <option>
                                                        Tuesday
                                                    </option>

                                                    <option>
                                                        Wednesday
                                                    </option>

                                                    <option>
                                                        Thursday
                                                    </option>

                                                    <option>
                                                        Friday
                                                    </option>

                                                    <option>
                                                        Saturday
                                                    </option>

                                                    <option>
                                                        Sunday
                                                    </option>

                                                </select>


                                                <button
                                                    onClick={() =>
                                                        removeDay(
                                                            dayIndex
                                                        )
                                                    }
                                                    className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium"
                                                >

                                                    <FaTrash />

                                                    Remove Day

                                                </button>

                                            </div>


                                            {/* Slots */}

                                            <div className="space-y-2">

                                                {day.slots.map(
                                                    (
                                                        slot,
                                                        slotIndex
                                                    ) => (

                                                        <div
                                                            key={slotIndex}
                                                            className="flex items-center gap-2"
                                                        >

                                                            <div className="relative flex-1">

                                                                <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                                                                <input
                                                                    type="time"
                                                                    step="1800"
                                                                    value={convertTo24Hour(slot)}
                                                                    onChange={(e) =>
                                                                        updateSlot(
                                                                            dayIndex,
                                                                            slotIndex,
                                                                            convertTo12Hour(e.target.value)
                                                                        )
                                                                    }
                                                                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />

                                                            </div>


                                                            <button
                                                                onClick={() =>
                                                                    removeSlot(
                                                                        dayIndex,
                                                                        slotIndex
                                                                    )
                                                                }
                                                                className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition"
                                                            >

                                                                {/* <FaTrash className="text-amber-500 text-sm" /> */}
                                                                <FaTrash className="text-gray-400 hover:text-gray-600 text-sm transition" />

                                                            </button>

                                                        </div>

                                                    )
                                                )}

                                            </div>


                                            {/* Add Slot */}

                                            <button
                                                onClick={() =>
                                                    addSlot(
                                                        dayIndex
                                                    )
                                                }
                                                className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            >

                                                <FaPlus />

                                                Add Time Slot

                                            </button>

                                        </div>

                                    )
                                )}


                                {/* Add Day */}

                                <button
                                    onClick={addDay}
                                    className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition"
                                >

                                    <FaPlus />

                                    Add Another Day

                                </button>

                            </div>

                        )}


                        {/* Save */}

                        {availability.length > 0 && (

                            <div className="flex justify-end mt-7 pt-5 border-t border-gray-200">

                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition disabled:opacity-60"
                                >

                                    <FaSave />

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default DoctorAvailability;