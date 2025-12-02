import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        next();
    } catch (error) {
        console.error("Auth Error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please sign in again." });
        }

        return res.status(401).json({ message: "Invalid or unauthorized token" });
    }
};
