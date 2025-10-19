import { ObjectId } from "mongodb";
import * as AdminModel from "../models/admin.models.js";

export const getAll = async (req, res) => {
  try {
    const admins = await AdminModel.getAllAdmins();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const admin = await AdminModel.getById(id);
    if (!admin)
      return res
        .status(404)
        .json({ status: false, message: "Không tìm thấy admin" });
    res.json({ status: true, data: admin });
  } catch (err) {
    res.status(400).json({ status: false, message: "ID không hợp lệ" });
  }
};

export const create = async (req, res) => {
  try {
    const {
      email_alias,
      full_name,
      password,
      email,
      position,
      gender,
      date_of_birth,
      address,
    } = req.body;
    const existed = await AdminModel.getByEmail(email);
    if (existed)
      return res
        .status(409)
        .json({ status: false, message: "Email đã tồn tại" });

    const admin = await AdminModel.createAdmin({
      email_alias,
      full_name,
      password,
      email,
      position,
      gender,
      date_of_birth,
      address,
    });
    res.status(201).json({ status: true, data: admin });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const updated = await AdminModel.update(id, req.body);
    res.json({ status: true, data: updated });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await AdminModel.deleteAdmin(id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: false, message: "Không tìm thấy quản trị viên này." });
    res.json({
      status: true,
      message: "Xóa thành công",
      action_by: { user: req.user.user, id: req.user.id },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
