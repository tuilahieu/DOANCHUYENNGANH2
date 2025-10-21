import { getDB } from "../services/database.services.js";
import { ObjectId } from "mongodb";

const collectionName = "faculties";

export async function getAllFaculties() {
  const db = getDB();
  return await db.collection(collectionName).find().toArray();
}

export async function getFacultyByName(name) {
  const db = getDB();
  return await db.collection(collectionName).findOne({ name });
}

export async function createFaculty(faculty) {
  const db = getDB();
  faculty.created_at = new Date();
  faculty.updated_at = new Date();
  const result = await db.collection(collectionName).insertOne(faculty);
  console.log(result);
  return result.insertedId.toString();
}

export async function updateFaculty(id, data) {
  const db = getDB();
  data.updated_at = new Date();
  const result = await db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount;
}

export async function deleteFaculty(id) {
  const db = getDB();
  const result = await db
    .collection(collectionName)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount;
}
