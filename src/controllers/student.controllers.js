import * as Student from "../models/student.models.js";

export async function getAll(req, res) {
  try {
    const students = await Student.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const isValidIdLength = req.params.id.length === 24;
    if (!isValidIdLength) {
      return res.status(404).json({
        status: false,
        message: "Không đúng định dạng ID (24 kí tự).",
      });
    }
    const student = await Student.getStudentById(req.params.id);
    if (!student) {
      return res
        .status(404)
        .json({ status: false, message: "Không có sinh viên này." });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}

export async function getByStudentCode(req, res) {
  const studentCode = Number(req.params.studentCode); // chuyển về number
  try {
    const student = await Student.getStudentByStudentCode(studentCode);

    if (!student)
      return res
        .status(404)
        .json({ status: false, message: "Không có sinh viên này." });

    res.json(student);
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}

export async function create(req, res) {
  try {
    const isExist = await Student.getStudentByStudentCode(
      req.body.student_code
    );
    if (isExist) {
      return res.json({ status: false, message: "Sinh viên đã tồn tại." });
    }
    const id = await Student.createStudent(req.body);
    res.json({
      status: "success",
      message: "Tạo thành công",
      id: id.toString(),
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}

export async function update(req, res) {
  try {
    if (!req.body) {
      return res.json({ status: false, message: "Không có dữ liệu đầu vào." });
    }

    if (Object.entries(req.body).length === 0) {
      return res.json({
        status: false,
        message: "Không có trường nào thay đổi.",
      });
    }
    const matched = await Student.updateStudent(req.params.id, req.body);
    if (!matched)
      return res
        .status(404)
        .json({ status: false, message: "Không có sinh viên này." });
    res.json({
      status: true,
      message: "Cập nhật thành công !!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const deleted = await Student.deleteStudent(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: false, message: "Không tìm thấy sinh viên này." });
    res.json({ status: true, message: "Xóa thành công sinh viên." });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}
