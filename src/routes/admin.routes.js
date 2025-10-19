import express from "express";
import * as AdminController from "../controllers/admin.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.middlewares.js";
import { adminCreateSchema } from "../validations/admin.validations.js";
import { checkExtraFields } from "../utils/checkExtraFields.js";
import { validate } from "../utils/validateResult.js";

const router = express.Router();

const validFields = [
  "email_alias",
  "full_name",
  "password",
  "email",
  "position",
  "gender",
  "date_of_birth",
  "address",
];

router.use(authenticate, authorize(["Hiệu trưởng"]));

router.get("/", AdminController.getAll);
router.get("/:id", AdminController.getById);
router.post(
  "/",
  checkExtraFields(validFields),
  adminCreateSchema,
  validate,
  AdminController.create
);
router.put("/:id", AdminController.update);
router.delete("/:id", AdminController.remove);

export default router;
