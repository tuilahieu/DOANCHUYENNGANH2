import { checkSchema } from "express-validator";

export const adminCreateSchema = checkSchema({
  email_alias: {
    notEmpty: {
      errorMessage: "Tên email không được để trống",
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
        const expectedEmail = `${req.body.email_alias}@${process.env.TEACHER_DOMAIN_UNIVERSITY}`;
        if (value !== expectedEmail) {
          throw new Error(`Email phải có dạng ${expectedEmail}`);
        }
        return true;
      },
    },
  },
  position: {
    isIn: {
      options: [["Giảng viên", "Hiệu trưởng", "Cố vấn học tập", "Tuyển sinh"]],
      errorMessage: "Chức vụ không hợp lệ",
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
