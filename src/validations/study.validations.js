import { checkSchema } from "express-validator";
import { ObjectId } from "mongodb";

export const StudyCreateSchema = checkSchema({
  status: {
    isIn: {
      options: [["ĐANG HỌC", "BẢO LƯU", "ĐÃ TỐT NGHIỆP", "THÔI HỌC"]],
      errorMessage:
        "Trạng thái không hợp lệ. [ĐANG HỌC, BẢO LƯU, ĐÃ TỐT NGHIỆP, THÔI HỌC]",
    },
    notEmpty: {
      errorMessage: "Trạng thái không được để trống.",
    },
  },
  student_id: {
    notEmpty: {
      errorMessage: "Mã tham chiếu SV không được bỏ trống",
    },
    custom: {
      options: (value) => ObjectId.isValid(value),
      errorMessage: "Student_id tham chiếu tới không hợp lệ",
    },
  },
  class_id: {
    notEmpty: {
      errorMessage: "Mã tham chiếu lớp học không được bỏ trống",
    },
    custom: {
      options: (value) => ObjectId.isValid(value),
      errorMessage: "class_id tham chiếu tới không hợp lệ",
    },
  },
  major_id: {
    notEmpty: {
      errorMessage: "mã tham chiếu chuyên ngành không được bỏ trống",
    },
    custom: {
      options: (value) => ObjectId.isValid(value),
      errorMessage: "major tham chiếu tới không hợp lệ",
    },
  },
  faculty_id: {
    notEmpty: {
      errorMessage: "mã tham chiếu khoa không được bỏ trống",
    },
    custom: {
      options: (value) => ObjectId.isValid(value),
      errorMessage: "faculty_id tham chiếu tới không hợp lệ",
    },
  },
});
