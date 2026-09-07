const isAdmin = (req, res, next) => {

    // User must already be authenticated
    if (!req.isAuthenticated || !req.isAuthenticated()) {

        return res.status(401).json({
            success: false,
            message: "Authentication required.",
        });

    }

    // User must have admin role
    if (req.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Admin access required.",
        });

    }

    next();

};

module.exports = isAdmin;