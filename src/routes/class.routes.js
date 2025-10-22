import express from "express";
import ClassController from "../controllers/class.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.middlewares.js";
import { classCreateSchema } from "../validations/class.validations.js";
import { validate } from "../utils/validateResult.js";
import { checkExtraFields } from "../utils/checkExtraFields.js";

const router = express.Router();

const validFields = ["class_name", "major_id", "course_year"];

router.get("/:id", authenticate, ClassController.getById);
router.use(authenticate, authorize(["admin"]));
router.get("/", ClassController.getAll);
router.get("/name/:className", ClassController.getByClassName);
router.post(
  "/",
  checkExtraFields(validFields),
  classCreateSchema,
  validate,
  ClassController.create
);
router.put("/:id", checkExtraFields(validFields), ClassController.update);
// ít khi xóa ( hầu như không xóa sau đi đã thêm nên k test lại lỗi )
router.delete("/:id", ClassController.delete);

export default router;
