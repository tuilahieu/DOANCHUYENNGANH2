import { getDB } from "../services/database.services.js";
import { ObjectId } from "mongodb";

const collectionName = "majors";

export async function getAllMajors() {
  const db = getDB();
  return await db.collection(collectionName).find().toArray();
}

export async function getMajorByName(name) {
  const db = getDB();
  return await db.collection(collectionName).findOne({ name });
}

export async function createMajor(major) {
  const db = getDB();
  major.created_at = new Date();
  major.updated_at = new Date();
  major.faculty_id = new ObjectId(major.faculty_id);
  const result = await db.collection(collectionName).insertOne(major);
  console.log(result);
  return result.insertedId.toString();
}

export async function updateMajor(id, data) {
  const db = getDB();
  data.updated_at = new Date();
  const result = await db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount;
}

export async function deleteMajor(id) {
  const db = getDB();
  const result = await db
    .collection(collectionName)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount;
}
