import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

  } catch (error) {
    console.error("Token Generation Error:", error);
    return null;
  }
};

export default generateToken;
