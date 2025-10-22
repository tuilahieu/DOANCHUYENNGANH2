import * as StudentScores from "../models/score.models.js";

class StudentScoreController {
  async getAll(req, res) {
    try {
      const studies = await StudentScores.getAllStudentScores();
      res.json({ status: true, data: studies });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async getById(req, res) {
    try {
      console.log(req.params.id);
      const study = await StudentScores.getStudentScoreByStudentId(
        req.params.id
      );
      if (!study) {
        return res.status(404).json({
          status: false,
          message: "Không tìm thấy dữ liệu.",
        });
      }
      res.json({ status: true, data: study });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async create(req, res) {
    try {
      // Lấy dữ liệu từ body
      const score_regular = parseFloat(req.body.score_regular);
      const score_midterm = parseFloat(req.body.score_midterm);
      const score_final =
        req.body.score_final !== undefined
          ? parseFloat(req.body.score_final)
          : null;

      let score_total = null;
      let status = "";
      let grade = null;

      if (score_final !== null && !isNaN(score_final)) {
        score_total = (
          score_regular * 0.1 +
          score_midterm * 0.2 +
          score_final * 0.7
        ).toFixed(2);
        status = score_total >= 4.0 ? "passed" : "failed";
        grade = this.caculatedGrade(score_total);
      }

      const calculatedStudentScore = {
        ...req.body,
        score_final,
        score_total: score_total ? parseFloat(score_total) : null,
        status,
        grade,
      };

      console.log(calculatedStudentScore);
      const newStudyId = await StudentScores.createStudentScore(
        calculatedStudentScore
      );
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

      // 🧮 Lấy dữ liệu cũ để cập nhật
      const oldData = await StudentScores.getStudentScoreById(req.params.id);
      if (!oldData) {
        return res
          .status(404)
          .json({ status: false, message: "Không tồn tại bản ghi này." });
      }

      // 🧩 Gộp dữ liệu mới với dữ liệu cũ
      const updatedData = { ...oldData, ...req.body };

      // Chuyển sang số
      const score_regular = parseFloat(updatedData.score_regular) || null;
      const score_midterm = parseFloat(updatedData.score_midterm) || null;
      const score_final =
        updatedData.score_final !== undefined
          ? parseFloat(updatedData.score_final)
          : null;

      let score_total = null;
      let status = "";
      let grade = null;

      // ✅ Nếu đã có điểm cuối kỳ thì mới tính
      if (score_final !== null && !isNaN(score_final)) {
        score_total = (
          score_regular * 0.1 +
          score_midterm * 0.2 +
          score_final * 0.7
        ).toFixed(2);
        status = score_total >= 4.0 ? "passed" : "failed";
        // console.log("this => ", this);
        grade = this.caculatedGrade(score_total);
      }

      // Dữ liệu cuối cùng để cập nhật
      const calculatedData = {
        ...req.body,
        score_total: score_total ? parseFloat(score_total) : null,
        status,
        grade,
        updated_at: new Date(),
      };

      const matched = await StudentScores.updateStudentStudy(
        req.params.id,
        calculatedData
      );

      if (!matched)
        return res
          .status(404)
          .json({ status: false, message: "Không tồn tại bản ghi này." });

      res.json({ status: true, message: "Đã cập nhật và tính lại điểm!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error: error.message });
    }
  }

  caculatedGrade(score_total) {
    if (score_total >= 8.5) return "A";
    if (score_total >= 7.0) return "B";
    if (score_total >= 5.5) return "C";
    if (score_total >= 4.0) return "D";
    return "F";
  }
}

export default new StudentScoreController();
