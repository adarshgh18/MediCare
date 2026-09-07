require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/user");


async function createAdmin() {

    try {

        // Connect to the same database
        await mongoose.connect(process.env.ATLASDB_URL);

        console.log( "MongoDB Connected Successfully" );


        // Check if admin already exists
        const existingAdmin = await User.findOne({
            role: "admin",
        });


        if (existingAdmin) {

            console.log(
                `Admin already exists: ${existingAdmin.username}`
            );

            await mongoose.connection.close();

            return;

        }


        // Create admin user
        const admin = new User({

            fullName: "MediCare Admin",

            username: "admin",

            email: "admin@medicare.com",

            role: "admin",

        });


        await User.register(
            admin,
            "Admin@12345"
        );


        console.log(
            "Admin created successfully."
        );

        console.log(
            "Username: admin"
        );

        console.log(
            "Password: Admin@12345"
        );


        await mongoose.connection.close();

    }

    catch (err) {

        console.error(
            "Failed to create admin:",
            err
        );

        await mongoose.connection.close();

    }

}


createAdmin();