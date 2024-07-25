import jwt from "jsonwebtoken";

export const GenerateJwt = (value, type = "id") => {
  const payload = type === "email" ? { email: value } : { id: value };
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "10d" });
};
