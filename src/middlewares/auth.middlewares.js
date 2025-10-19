import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { decode } from "punycode";
dotenv.config();

export function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      status: false,
      message: "Bạn không có quyền truy cập trang này.",
    });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      status: false,
      message: "Bạn không có quyền truy cập trang này",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // lưu thông tin user vào request để mỗi lần request sẽ biết là ai làm hành động này
    console.log(decoded);
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({
      status: false,
      message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
    });
  }
}

export function authorize(allowedRoles = []) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: false,
          message: "Bạn cần đăng nhập để truy cập vào đây.",
        });
      }
      // console.log(req.user);/

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          status: false,
          message: "Bạn không có quyền truy cập tài nguyên này.",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Lỗi kiểm tra quyền truy cập.",
        error: error.message,
      });
    }
  };
}
