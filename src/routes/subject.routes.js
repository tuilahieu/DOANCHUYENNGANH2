import express from "express";
import SubjectController from "../controllers/subject.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.middlewares.js";
import { validate } from "../utils/validateResult.js";
import { checkExtraFields } from "../utils/checkExtraFields.js";
import { SubjectCreateSchema } from "../validations/subject.validations.js";

const router = express.Router();

const validFields = [
  "subject_code",
  "subject_name",
  "credit",
  "major_id",
  "semester",
];

router.get(
  "/:id",
  authenticate,
  // authorize(["Hiệu trưởng"]),
  SubjectController.getById
);
router.use(authenticate, authorize(["Hiệu trưởng"]));
router.get("/", SubjectController.getAll);
router.post(
  "/",
  checkExtraFields(validFields),
  SubjectCreateSchema,
  validate,
  SubjectController.create
);
router.put("/:id", checkExtraFields(validFields), SubjectController.update);
router.delete("/:id", SubjectController.delete);

export default router;
