import * as Majors from "../models/major.models.js";

class MajorController {
  async getAll(req, res) {
    try {
      const faculies = await Majors.getAllMajors();
      res.json(faculies);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async create(req, res) {
    try {
      const isExist = await Majors.getMajorByName(req.body.name);
      if (isExist) {
        return res.status(400).json({
          status: false,
          message: "Chuyên ngành " + req.body.name + " đã tồn tại.",
        });
      }
      const newMajorId = await Majors.createMajor(req.body);
      res.status(201).json({ status: true, id: newMajorId });
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
      const matched = await Majors.updateMajor(req.params.id, req.body);
      if (!matched)
        return res
          .status(404)
          .json({ status: false, message: "Không tồn tại khoa này." });
      res.json({ status: "success", message: "Đã cập nhật !!" });
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await Majors.deleteMajor(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ status: false, message: "Không có khoa này." });
      }
      res.json({ status: true, message: "Xóa thành công !!" });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }
}

export default new MajorController();
