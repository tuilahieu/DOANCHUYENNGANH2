import { checkSchema } from "express-validator";
import { ObjectId } from "mongodb";

export const ScoreCreateSchema = checkSchema({
  student_id: {
    notEmpty: {
      errorMessage: "Mã tham chiếu SV không được bỏ trống",
    },
    custom: {
      options: (value) => ObjectId.isValid(value),
      errorMessage: "Student_id tham chiếu tới không hợp lệ",
    },
  },
  subject_id: {
    notEmpty: {
      errorMessage: "Mã tham chiếu môn học không được bỏ trống",
    },
    custom: {
      options: (value) => ObjectId.isValid(value),
      errorMessage: "subject_id tham chiếu tới không hợp lệ",
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
  year: {
    notEmpty: {
      errorMessage: "Năm học không được bỏ trống",
    },
    isInt: {
      options: { min: 2000 },
      errorMessage: "Năm học phải là số nguyên dương và lớn hơn 2000",
    },
  },
  score_regular: {
    notEmpty: {
      errorMessage: "Điểm thường xuyên không được bỏ trống",
    },
    isFloat: {
      options: { min: 0, max: 10 },
      errorMessage: "Điểm thường xuyên phải là số từ 0 đến 10",
    },
  },
  score_midterm: {
    notEmpty: {
      errorMessage: "Điểm giữa kỳ không được bỏ trống",
    },
    isFloat: {
      options: { min: 0, max: 10 },
      errorMessage: "Điểm giữa kỳ phải là số từ 0 đến 10",
    },
  },
});
