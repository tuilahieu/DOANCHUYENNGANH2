import { getDB } from "../services/database.services.js";
import { ObjectId } from "mongodb";

const collectionName = "classes";

export async function getAllClasses() {
  const db = getDB();
  return await db.collection(collectionName).find().toArray();
}

export async function getClassById(id) {
  const db = getDB();
  return await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
}

export async function getClassByClassName(className) {
  const db = getDB();
  return await db.collection(collectionName).findOne({ class_name: className });
}

export async function createClass(_class) {
  const db = getDB();
  _class.created_at = new Date();
  _class.updated_at = new Date();
  _class.major_id = new ObjectId(_class.major_id);
  const result = await db.collection(collectionName).insertOne(_class);
  return result.insertedId.toString();
}

export async function updateClass(id, data) {
  const db = getDB();
  data.updated_at = new Date();
  const result = await db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount;
}

export async function deleteClass(id) {
  const db = getDB();
  const result = await db
    .collection(collectionName)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount;
}
