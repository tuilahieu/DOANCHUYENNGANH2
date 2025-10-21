import * as Subjects from "../models/subject.models.js";

class SubjectController {
  async getAll(req, res) {
    try {
      const faculies = await Subjects.getAllSubjects();
      res.json(faculies);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async create(req, res) {
    try {
      const isExist = await Subjects.getSubjectByName(req.body.subject_code);
      if (isExist) {
        return res.status(400).json({
          status: false,
          message: "Mã môn học " + req.body.subject_code + " đã tồn tại.",
        });
      }
      const newMajorId = await Subjects.createSubject(req.body);
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
      const matched = await Subjects.updateSubject(req.params.id, req.body);
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
      const deleted = await Subjects.deleteSubject(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ status: false, message: "Không có môn học này." });
      }
      res.json({ status: true, message: "Xóa thành công !!" });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }
}

export default new SubjectController();
