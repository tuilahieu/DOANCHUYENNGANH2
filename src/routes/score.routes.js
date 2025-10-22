import express from "express";
import StudentScoreController from "../controllers/score.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.middlewares.js";
import { ScoreCreateSchema } from "../validations/score.validations.js";
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

router.get(
  "/:id",
  authenticate,
  StudentScoreController.getById.bind(StudentScoreController)
);

router.use(authenticate, authorize(["Hiệu trưởng"]));

router.get("/", StudentScoreController.getAll);
router.post(
  "/",
  //   checkExtraFields(validFields),
  ScoreCreateSchema,
  validate,
  StudentScoreController.create.bind(StudentScoreController)
);
router.put("/:id", StudentScoreController.update.bind(StudentScoreController));

// router.delete("/:id", StudentScoreController.delete);

export default router;
