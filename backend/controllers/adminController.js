import jwt from "jsonwebtoken";

// admin login - checks against ADMIN_EMAIL / ADMIN_PASSWORD in .env
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" });
        }

        if (
            email !== process.env.ADMIN_EMAIL ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // role: "admin" is what adminAuth middleware checks for
        const token = jwt.sign(
            { email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ success: true, token });
    } catch (error) {
        console.error("🔥 Admin login error:", error);
        res.json({ success: false, message: `Admin login error: ${error.message}` });
    }
};

export { adminLogin };
