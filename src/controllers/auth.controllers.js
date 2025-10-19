import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getDB } from "../services/database.services.js";

export async function login(req, res) {
  const { email, password, rememberMe = false } = req.body;

  if (!email || !password)
    return res.status(400).json({
      status: false,
      message: "Vui lòng nhập đầy đủ email và mật khẩu",
    });

  try {
    const db = getDB();

    const admin = await db.collection("admins").findOne({ email });

    if (admin) {
      const match = await bcrypt.compare(password, admin.password);
      if (!match)
        return res
          .status(401)
          .json({ status: false, message: "Mật khẩu không chính xác" });

      const token = jwt.sign(
        {
          id: admin._id,
          role: admin.position || "UNKNOWN",
          user: admin.full_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: rememberMe ? process.env.JWT_EXPIRES_IN : "2h" }
      );

      return res.json({
        status: true,
        message: "Đăng nhập thành công (Admin)",
        role: admin.position || "UNKNOWN",
        token,
        // access_time: rememberMe ? process.env.JWT_EXPIRES_IN : "2h",
      });
    }

    const student = await db.collection("students").findOne({ email });

    if (student) {
      const match = await bcrypt.compare(password, student.password);
      if (!match)
        return res
          .status(401)
          .json({ status: false, message: "Mật khẩu không chính xác" });

      const token = jwt.sign(
        { id: student._id, role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: rememberMe ? process.env.JWT_EXPIRES_IN : "2h" }
      );

      return res.json({
        status: true,
        message: "Đăng nhập thành công",
        // role: "student",
        token,
      });
    }

    return res
      .status(401)
      .json({ status: false, message: "Email hoặc mật khẩu không chính xác" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Lỗi máy chủ" });
  }
}
