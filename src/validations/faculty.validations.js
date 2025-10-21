import { checkSchema } from "express-validator";

export const facultyCreateSchema = checkSchema({
  name: {
    notEmpty: {
      errorMessage: "Tên khoa không được để trống.",
    },
  },
});
