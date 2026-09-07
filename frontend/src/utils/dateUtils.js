export const formatShortDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const formatLongDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

export const formatDateIN = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export const formatDateGB = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export const formatMemberSince = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });
};