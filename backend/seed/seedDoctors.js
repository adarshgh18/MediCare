const mongoose = require("mongoose");

const User = require("../models/user");
const Doctor = require("../models/doctor");

const doctorData = require("./doctorData");

async function main() {

    await mongoose.connect(
        "mongodb://127.0.0.1:27017/mediCare"
    );

    console.log("MongoDB Connected");

}

main()
    .then(seedDatabase)
    .catch(console.log);


async function seedDatabase() {

    try {

        console.log("Seeding Started...");

        await Doctor.deleteMany({});

        await User.deleteMany({
            role: "doctor",
        });

        for (const doctor of doctorData) {

            // 1. User create karo
            const user = new User({
                fullName: doctor.fullName,
                username: doctor.username,
                email: doctor.email,
                role: "doctor",
            });

            // Password save karo (passport-local-mongoose hash kar dega)
            const registeredUser = await User.register(user, doctor.password);

            // 2. Doctor profile create karo
            const newDoctor = new Doctor({
                user: registeredUser._id,
                specialization: doctor.specialization,
                experience: doctor.experience,
                consultationFee: doctor.consultationFee,
                qualification: doctor.qualification,
                hospital: doctor.hospital,
                bio: doctor.bio,
                availability: doctor.availability,
            });

            // 3. Doctor save karo
            await newDoctor.save();

            console.log(`${doctor.fullName} created`);
        }

        console.log("Database Seeded Successfully");

    }

    catch (err) {

        console.log(err);

    }

    finally {

        mongoose.connection.close();

    }

}