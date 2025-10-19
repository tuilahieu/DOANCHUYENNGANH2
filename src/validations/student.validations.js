import { checkSchema } from "express-validator";

export const studentCreateSchema = checkSchema({
  student_code: {
    notEmpty: {
      errorMessage: "Mã sinh viên không được để trống.",
    },
    isAlphanumeric: {
      errorMessage: "Mã sinh viên phải là số",
    },
    isLength: {
      options: { min: 8, max: 8 },
      errorMessage: "Mã sinh viên phải gồm 8 số",
    },
  },
  full_name: {
    notEmpty: {
      errorMessage: "Họ tên không được để trống",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Mật khẩu không được để trống",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "Mật khẩu cần ít nhất 6 kí tự",
    },
  },
  email: {
    isEmail: {
      errorMessage: "Sai định dạng email.",
    },
    custom: {
      options: (value, { req }) => {
        const expectedEmail = `${req.body.student_code}@${process.env.STUDENT_DOMAIN_UNIVERSITY}`;
        if (value !== expectedEmail) {
          throw new Error(`Email phải có dạng ${expectedEmail}`);
        }
        return true;
      },
    },
  },
  gender: {
    isIn: {
      options: [["Nam", "Nữ"]],
      errorMessage: "Giới tính không hợp lệ",
    },
  },
  date_of_birth: {
    isISO8601: {
      errorMessage: "Ngày tháng năm sinh sai định dạng",
    },
  },
  address: {
    isString: {
      errorMessage: "Địa chỉ cần phải là chuỗi kí tự",
    },
  },
});
