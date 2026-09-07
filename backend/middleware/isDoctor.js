module.exports = (req, res, next) => {

    if (req.user.role !== "doctor") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Doctor only.",
        });
    }

    next();
};