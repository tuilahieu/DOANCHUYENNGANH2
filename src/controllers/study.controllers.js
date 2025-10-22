import * as StudentStudies from "../models/study.models.js";

class StudentStudyController {
  async getAll(req, res) {
    try {
      const studies = await StudentStudies.getAllStudentStudies();
      res.json({ status: true, data: studies });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async getByStudentId(req, res) {
    try {
      const study = await StudentStudies.getStudentStudyByStudentId(
        req.params.id
      );
      if (!study) {
        return res
          .status(404)
          .json({ status: false, message: "Không tìm thấy dữ liệu." });
      }
      res.json({ status: true, data: study });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async create(req, res) {
    try {
      const isExist = await StudentStudies.getStudentStudyByStudentId(
        req.body.student_id
      );
      if (isExist) {
        return res.status(400).json({
          status: false,
          message: "Sinh viên này đã có thông tin học tập.",
        });
      }
      const newStudyId = await StudentStudies.createStudentStudy(req.body);
      res
        .status(201)
        .json({ status: true, message: "Tạo thành công", id: newStudyId });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async update(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.json({
          status: false,
          message: "Không có dữ liệu đầu vào.",
        });
      }

      const matched = await StudentStudies.updateStudentStudy(
        req.params.id,
        req.body
      );

      if (!matched)
        return res
          .status(404)
          .json({ status: false, message: "Không tồn tại bản ghi này." });

      res.json({ status: "success", message: "Đã cập nhật thành công!" });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await StudentStudies.deleteStudentStudy(req.params.id);
      if (!deleted)
        return res
          .status(404)
          .json({ status: false, message: "Không có bản ghi này." });

      res.json({ status: true, message: "Xóa thành công!" });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }
}

export default new StudentStudyController();
