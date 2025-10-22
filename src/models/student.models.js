import { getDB } from "../services/database.services.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const collectionName = "students";

// Thêm hàm này vào file Model
export async function countAllStudents() {
  const db = getDB();
  return await db.collection(collectionName).countDocuments({});
}

export async function getAllStudents(page = 1, limit = 5) {
  // Tính toán skip DỰA TRÊN tham số đầu vào
  const skip = (page - 1) * limit;

  const db = getDB();
  return await db
    .collection(collectionName)
    .find({}, { projection: { password: 0 } })
    .skip(skip) // Dùng giá trị skip đã tính
    .limit(limit)
    .toArray();
}

export async function getStudentById(id) {
  const db = getDB();
  return await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
}

export async function getStudentByStudentCode(studentCode) {
  const db = getDB();
  return await db
    .collection(collectionName)
    .findOne({ student_code: studentCode });
}

export async function createStudent(student) {
  const db = getDB();
  const hashedPassword = await bcrypt.hash(student.password, 10);
  student.created_at = new Date();
  student.updated_at = new Date();
  const result = await db
    .collection(collectionName)
    .insertOne({ ...student, password: hashedPassword });
  return result.insertedId.toString();
}

export async function updateStudent(id, data) {
  const db = getDB();
  data.updated_at = new Date();
  const result = await db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount;
}

export async function deleteStudent(id) {
  const db = getDB();
  const result = await db
    .collection(collectionName)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount;
}
