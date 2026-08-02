import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Only allow tokens explicitly issued for the admin, never a regular user token
        if (token_decode.role !== "admin") {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        next();
    } catch (error) {
        console.log(error);
        // jwt.verify throws on expiry, bad signature, malformed token, etc.
        // Always tell the frontend this is an auth problem (not a generic
        // server error) so handleAuthError() recognizes it and logs the
        // admin out / redirects to login, instead of showing a confusing
        // "Error" toast while the orders/products list just stays empty.
        res.json({ success: false, message: "Session expired. Login again" });
    }
};

export default adminAuth;
