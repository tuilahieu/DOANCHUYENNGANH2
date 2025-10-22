import { getDB } from "../services/database.services.js";
import { ObjectId } from "mongodb";

const collectionName = "subjects";

export async function getAllSubjects() {
  const db = getDB();
  return await db.collection(collectionName).find().toArray();
}

export async function getSubjectById(id) {
  const db = getDB();
  return await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
}

export async function createSubject(subject) {
  const db = getDB();
  subject.created_at = new Date();
  subject.updated_at = new Date();
  subject.major_id = new ObjectId(subject.major_id);
  const result = await db.collection(collectionName).insertOne(subject);
  console.log(result);
  return result.insertedId.toString();
}

export async function updateSubject(id, data) {
  const db = getDB();
  data.updated_at = new Date();
  const result = await db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount;
}

export async function deleteSubject(id) {
  const db = getDB();
  const result = await db
    .collection(collectionName)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount;
}
