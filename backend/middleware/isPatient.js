module.exports = (req, res, next) => {

    if (req.user.role !== "patient") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Patient only.",
        });
    }

    next();
};