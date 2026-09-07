export const API_ERROR_TYPES = {

    NETWORK: "NETWORK",

    UNAUTHORIZED: "UNAUTHORIZED",

    FORBIDDEN: "FORBIDDEN",

    NOT_FOUND: "NOT_FOUND",

    VALIDATION: "VALIDATION",

    CONFLICT: "CONFLICT",

    SERVER: "SERVER",

    UNKNOWN: "UNKNOWN",

};


export const getApiErrorType = (error) => {

    /*
     * No response means Axios could not
     * receive an HTTP response.
     *
     * Usually:
     * - backend stopped
     * - connection refused
     * - network problem
     */

    if (!error?.response) {

        return API_ERROR_TYPES.NETWORK;

    }


    const status = error.response.status;


    switch (status) {

        case 400:
            return API_ERROR_TYPES.VALIDATION;

        case 401:
            return API_ERROR_TYPES.UNAUTHORIZED;

        case 403:
            return API_ERROR_TYPES.FORBIDDEN;

        case 404:
            return API_ERROR_TYPES.NOT_FOUND;

        case 409:
            return API_ERROR_TYPES.CONFLICT;

        case 500:
        case 502:
        case 503:
        case 504:
            return API_ERROR_TYPES.SERVER;

        default:
            return API_ERROR_TYPES.UNKNOWN;

    }

};


export const isServerUnavailable = (error) => {

    const type = getApiErrorType(error);

    return (
        type === API_ERROR_TYPES.NETWORK ||
        type === API_ERROR_TYPES.SERVER
    );

};


export const getApiErrorMessage = (
    error,
    fallbackMessage = "Something went wrong."
) => {

    const type = getApiErrorType(error);

    const backendMessage =
        error?.response?.data?.message;


    switch (type) {

        case API_ERROR_TYPES.NETWORK:

            return "Unable to connect to MediCare. Please try again.";


        case API_ERROR_TYPES.UNAUTHORIZED:

            return backendMessage ||
                "Please login to continue.";


        case API_ERROR_TYPES.FORBIDDEN:

            return backendMessage ||
                "You are not authorized to perform this action.";


        case API_ERROR_TYPES.NOT_FOUND:

            return backendMessage ||
                "The requested resource was not found.";


        case API_ERROR_TYPES.VALIDATION:

            return backendMessage ||
                "Please check the entered information.";


        case API_ERROR_TYPES.CONFLICT:

            return backendMessage ||
                "This request conflicts with existing data.";


        case API_ERROR_TYPES.SERVER:

            return backendMessage ||
                "MediCare is temporarily unavailable. Please try again later.";


        default:

            return backendMessage || fallbackMessage;

    }

};


// export const getApiErrorMessage = (error, fallbackMessage = "Something went wrong.") => {

//     // Backend is not reachable
//     if (!error.response) {
//         return "Unable to connect to server. Please try again.";
//     }

//     const status = error.response.status;
//     const backendMessage = error.response.data?.message;

//     switch (status) {

//         case 400:
//             return backendMessage || "Invalid request.";

//         case 401:
//             return backendMessage || "Please login to continue.";

//         case 403:
//             return backendMessage || "You are not authorized to perform this action.";

//         case 404:
//             return backendMessage || "The requested resource was not found.";

//         case 409:
//             return backendMessage || "This request conflicts with existing data.";

//         case 500:
//             return backendMessage || "Server error. Please try again later.";

//         default:
//             return backendMessage || fallbackMessage;
//     }
// };