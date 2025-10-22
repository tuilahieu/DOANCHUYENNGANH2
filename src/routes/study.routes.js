import express from "express";
import StudentStudyController from "../controllers/study.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.middlewares.js";
import { StudyCreateSchema } from "../validations/study.validations.js";
import { validate } from "../utils/validateResult.js";
import { checkExtraFields } from "../utils/checkExtraFields.js";

const router = express.Router();

const validFields = [
  "status",
  "student_id",
  "class_id",
  "major_id",
  "faculty_id",
];

router.get("/:id", authenticate, StudentStudyController.getByStudentId);

router.use(authenticate, authorize(["Hiệu trưởng"]));

router.get("/", StudentStudyController.getAll);
router.post(
  "/",
  checkExtraFields(validFields),
  StudyCreateSchema,
  validate,
  StudentStudyController.create
);
router.put("/:id", StudentStudyController.update);
router.delete("/:id", StudentStudyController.delete);

export default router;
