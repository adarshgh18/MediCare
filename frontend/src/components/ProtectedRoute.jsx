import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

function ProtectedRoute({ children, allowedRole }) {

    const { user, isLoggedIn, loading } = useContext(AuthContext);

    if (loading) {

        return <Loader />;

    }

    if (!isLoggedIn) {

        return <Navigate to="/login" replace />;

    }

    if (user.role !== allowedRole) {

        return <Navigate to="/unauthorized" replace />;

    }

    return children;

}

export default ProtectedRoute;