import {
    createContext,
    useEffect,
    useRef,
    useState,
} from "react";

import api from "../services/api";


export const AuthContext = createContext();


function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const hasCheckedAuth = useRef(false);


    const fetchCurrentUser = async () => {

        try {

            const response = await api.get("/auth/me");

            setUser(
                response.data.user || null
            );

        }

        catch (error) {

            /*
             * 401 is expected when the user
             * is not logged in.
             *
             * It is NOT an application error.
             */

            if (error.response?.status === 401) {

                setUser(null);

                return;

            }


            /*
             * If the backend is unavailable,
             * we don't show a global error here.
             *
             * Public pages should still be able
             * to render.
             */

            if (!error.response) {

                setUser(null);

                return;

            }


            /*
             * Unexpected authentication error.
             */

            console.error(
                "Authentication check failed:",
                error
            );

            setUser(null);

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        if (hasCheckedAuth.current) {
            return;
        }

        hasCheckedAuth.current = true;

        fetchCurrentUser();

    }, []);


    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoggedIn: !!user,
                loading,
                fetchCurrentUser,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export default AuthProvider;