import { checkSchema } from "express-validator";
import { ObjectId } from "mongodb";

export const SubjectCreateSchema = checkSchema({
  subject_code: {
    notEmpty: {
      errorMessage: "Mã môn học không được để trống.",
    },
  },
  subject_name: {
    notEmpty: {
      errorMessage: "Tên môn học không được để trống.",
    },
  },
  credit: {
    notEmpty: {
      errorMessage: "Số tín chỉ không được để trống.",
    },
  },
  major_id: {
    notEmpty: {
      errorMessage: "Chuyên ngành không được bỏ trống",
    },
    custom: {
      options: (value) => ObjectId.isValid(value),
      errorMessage: "major tham chiếu tới không hợp lệ",
    },
  },
  semester: {
    notEmpty: {
      errorMessage: "Học kỳ không được bỏ trống",
    },
    isInt: {
      options: { min: 1 },
      errorMessage: "Học kỳ phải là số nguyên dương",
    },
  },
});
