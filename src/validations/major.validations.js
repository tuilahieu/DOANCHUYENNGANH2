import { checkSchema } from "express-validator";
import { ObjectId } from "mongodb";

export const majorCreateSchema = checkSchema({
  name: {
    notEmpty: {
      errorMessage: "Tên chuyên ngành không được để trống.",
    },
  },
  faculty_id: {
    notEmpty: {
      errorMessage: "Chuyên ngành không được bỏ trống",
    },
    custom: {
      options: (value) => ObjectId.isValid(value),
      errorMessage: "faculty_id tham chiếu tới không hợp lệ",
    },
  },
});
