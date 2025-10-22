import express from "express";
import MajorController from "../controllers/major.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.middlewares.js";
import { majorCreateSchema } from "../validations/major.validations.js";
import { validate } from "../utils/validateResult.js";
import { checkExtraFields } from "../utils/checkExtraFields.js";

const router = express.Router();

const validFields = ["name", "faculty_id"];

router.get("/:id", authenticate, MajorController.getById);

router.use(authenticate, authorize(["Hiệu trưởng"]));
router.get("/", MajorController.getAll);
router.post(
  "/",
  checkExtraFields(validFields),
  majorCreateSchema,
  validate,
  MajorController.create
);
router.put("/:id", checkExtraFields(validFields), MajorController.update);
router.delete("/:id", MajorController.delete);

export default router;
