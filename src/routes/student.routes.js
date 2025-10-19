import express from "express";
import { body } from "express-validator";
import * as StudentController from "../controllers/student.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.middlewares.js";
import { validate } from "../utils/validateResult.js";
import { studentCreateSchema } from "../validations/student.validations.js";
import { checkExtraFields } from "../utils/checkExtraFields.js";

const router = express.Router();

const validFields = [
  "student_code",
  "full_name",
  "password",
  "email",
  "gender",
  "date_of_birth",
  "address",
];

router.use(authenticate);
// only student can access
router.get("/:id", StudentController.getById);

// admin can access with middleware *authorize*
router.get("/", authorize(["Hiệu trưởng"]), StudentController.getAll);
router.get(
  "/code/:studentCode",
  authorize(["Hiệu trưởng"]),
  StudentController.getByStudentCode
);
router.post(
  "/",
  authorize(["Hiệu trưởng"]),
  checkExtraFields(validFields),
  studentCreateSchema,
  validate,
  StudentController.create
);
router.put(
  "/:id",
  authorize(["Hiệu trưởng"]),
  checkExtraFields(validFields),
  StudentController.update
);
router.delete("/:id", authorize(["Hiệu trưởng"]), StudentController.remove);

export default router;
