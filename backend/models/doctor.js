const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        specialization: {
            type: String,
            required: true,
            trim: true,
        },

        experience: {
            type: Number,
            required: true,
            min: 0,
        },

        consultationFee: {
            type: Number,
            required: true,
            min: 0,
        },

        qualification: {
            type: String,
            required: true,
            trim: true,
        },

        hospital: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            default: "https://placehold.co/400x400?text=Doctor",
        },

        bio: {
            type: String,
            trim: true,
        },
        
        availability: [
            {
                day: {
                    type: String,
                    enum: [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                    ],
                    required: true,
                },
                slots: [
                    {
                        type: String,
                        trim: true,
                    },
                ],
                // startTime: {
                //     type: String,
                //     required: true,
                // },
                // endTime: {
                //     type: String,
                //     required: true,
                // },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Doctor", doctorSchema);