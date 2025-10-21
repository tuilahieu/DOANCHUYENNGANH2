import * as Classes from "../models/class.models.js";

class ClassesController {
  async getAll(req, res) {
    try {
      const classes = await Classes.getAllClasses();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const classData = await Classes.getClassById(req.params.id);
      if (!classData) {
        return res
          .status(404)
          .json({ status: false, message: "Không có lớp này." });
      }
      res.json(classData);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async getByClassName(req, res) {
    try {
      const classData = await Classes.getClassByClassName(req.params.className);
      console.log(req.params.className);
      if (!classData) {
        return res
          .status(404)
          .json({ status: false, message: "Không có lớp này." });
      }
      res.json(classData);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async create(req, res) {
    try {
      const isExisted = await Classes.getClassByClassName(req.body.class_name);
      console.log(isExisted);
      if (isExisted)
        return res.status(409).json({
          status: false,
          message: "Lớp " + req.body.class_name + " đã tồn tại !",
        });

      const newClassId = await Classes.createClass(req.body);
      res.status(201).json({ status: true, id: newClassId });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async update(req, res) {
    try {
      if (!req.body)
        return res.json({
          status: false,
          message: "Không có dữ liệu đầu vào.",
        });
      if (Object.entries(req.body).length === 0) {
        return res.json({
          status: false,
          message: "Không có trường nào thay đổi.",
        });
      }
      const matched = await Classes.updateClass(req.params.id, req.body);
      if (!matched)
        return res
          .status(404)
          .json({ status: false, message: "Không tồn tại lớp này." });
      res.json({ status: "success", message: "Đã cập nhật !!" });
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await Classes.deleteClass(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ status: false, message: "Không có lớp này." });
      }
      res.json({ status: true, message: "Xóa thành công !!" });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }
}

export default new ClassesController();
