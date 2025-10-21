import { getDB } from "../services/database.services.js";
import { ObjectId } from "mongodb";

const collectionName = "student_studies";

/**
 * Lấy toàn bộ danh sách student_studies
 */
export async function getAllStudentStudies() {
  const db = getDB();
  return await db.collection(collectionName).find().toArray();
}

/**
 * Lấy thông tin student_study theo ID
 */
export async function getStudentStudyByStudentId(id) {
  const db = getDB();
  return await db
    .collection(collectionName)
    .findOne({ student_id: new ObjectId(id) });
}

/**
 * Tạo mới bản ghi student_study
 */
export async function createStudentStudy(data) {
  const db = getDB();
  const newStudy = {
    ...data,
    student_id: new ObjectId(data.student_id),
    class_id: new ObjectId(data.class_id),
    major_id: new ObjectId(data.major_id),
    faculty_id: new ObjectId(data.faculty_id),
    created_at: new Date(),
    updated_at: new Date(),
  };

  const result = await db.collection(collectionName).insertOne(newStudy);
  return result.insertedId.toString();
}

/**
 * Cập nhật bản ghi student_study
 */
export async function updateStudentStudy(id, data) {
  const db = getDB();
  const updateData = { ...data, updated_at: new Date() };

  // Nếu có id thì chuyển về ObjectId
  if (data.student_id) updateData.student_id = new ObjectId(data.student_id);
  if (data.class_id) updateData.class_id = new ObjectId(data.class_id);
  if (data.major_id) updateData.major_id = new ObjectId(data.major_id);
  if (data.faculty_id) updateData.faculty_id = new ObjectId(data.faculty_id);

  const result = await db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

  return result.matchedCount;
}

/**
 * Xóa bản ghi student_study
 */
export async function deleteStudentStudy(id) {
  const db = getDB();
  const result = await db
    .collection(collectionName)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount;
}
