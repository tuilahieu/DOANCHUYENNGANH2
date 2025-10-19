import { checkSchema } from "express-validator";
import { ObjectId } from "mongodb";

export const classCreateSchema = checkSchema({
  class_name: {
    notEmpty: {
      errorMessage: "Tên lớp không được bỏ trống",
    },
    isString: {
      errorMessage: "Tên lớp phải là chuỗi ký tự",
    },
  },

  major_id: {
    notEmpty: {
      errorMessage: "Ngành học không được bỏ trống",
    },
    custom: {
      options: (value) => ObjectId.isValid(value),
      errorMessage: "major_id tham chiếu tới không hợp lệ",
    },
  },

  course_year: {
    notEmpty: {
      errorMessage: "Khóa học (course_year) không được bỏ trống",
    },
    isInt: {
      options: { min: 2000, max: new Date().getFullYear() + 1 },
      errorMessage: "Khóa học phải là số nguyên hợp lệ (>= 2000)",
    },
    toInt: true,
  },
});
