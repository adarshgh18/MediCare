require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");

const session = require("express-session");

const { MongoStore } = require("connect-mongo");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");

const errorHandler = require("./middleware/errorHandler");

const cors = require("cors");

const authenticationRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");


const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const PORT = process.env.PORT || 8080;

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

main()
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((err) => {
    console.log(err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

app.use("/api/auth", authenticationRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin" , adminRoutes );

app.use("/api/appointments", appointmentRoutes);

app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(
    "/api/notifications",
    notificationRoutes
);

app.get("/", (req, res) => {
    res.send("Welcome to MediCare");
});


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});