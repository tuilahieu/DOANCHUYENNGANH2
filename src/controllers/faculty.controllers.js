import * as Faculties from "../models/faculty.models.js";

class FacultyController {
  async getAll(req, res) {
    try {
      const faculties = await Faculties.getAllFaculties();
      res.json({ status: true, data: faculties });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }
  async getById(req, res) {
    try {
      // console.log(req.params.id);
      const faculty = await Faculties.getFacultyById(req.params.id);
      res.json({ status: true, data: faculty });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async create(req, res) {
    try {
      const isExist = await Faculties.getFacultyByName(req.body.name);
      if (isExist) {
        return res
          .status(400)
          .json({ status: false, message: "Khoa đã tồn tại." });
      }
      const newFacultyId = await Faculties.createFaculty(req.body);
      res.status(201).json({ status: true, id: newFacultyId });
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
      const matched = await Faculties.updateFaculty(req.params.id, req.body);
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
      const deleted = await Faculties.deleteFaculty(req.params.id);
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

export default new FacultyController();
