import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
});


// --------------------------------------------------
// Global API error handling
// --------------------------------------------------

api.interceptors.response.use(

    // Successful response
    (response) => {
        return response;
    },

    // Failed response
    (error) => {

        // Server could not be reached
        if (!error.response) {

            // Only trigger the global ServerError page
            // for GET requests.
            //
            // POST / PUT / PATCH / DELETE failures
            // are handled by the individual component
            // using toast/error UI.

            if (error.config?.method?.toLowerCase() === "get") {

                window.dispatchEvent(
                    new Event("backend-offline")
                );

            }

        }

        return Promise.reject(error);

    }

);

export default api;