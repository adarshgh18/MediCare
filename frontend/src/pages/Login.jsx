import { useState } from "react";
import api from "../services/api";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(

                "/auth/login",

                {
                    username,
                    password,
                }

            );

            setUser(response.data.user);

            toast.success("Login successful!");

            const role = response.data.user.role;

            let dashboardRoute;

            if (role === "admin") {

                dashboardRoute = "/admin/dashboard";

            } else if (role === "doctor") {

                dashboardRoute = "/doctor/dashboard";

            } else {

                dashboardRoute = "/patient/dashboard";

            }

            navigate(dashboardRoute);

        }

        catch (err) {

            toast.error(
                err.response?.data?.message || "Login failed."
            );

        }

    };

    return (
        <div className="min-h-screen  pt-30">
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto  shadow-lg p-8 rounded-lg "
        >

            <h1 className="text-3xl font-bold mb-6">
                Login
            </h1>

            <input

                type="text"
                placeholder="Username"
                className="border w-full p-3 mb-4 rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}

            />

            <input

                type="password"
                placeholder="Password"
                className="border w-full p-3 mb-4 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}

            />

            <button
                type="submit"
                className="bg-blue-600 text-white w-full py-3 rounded"
            >

                Login

            </button>


        </form>
        </div>

    );

}


export default Login;