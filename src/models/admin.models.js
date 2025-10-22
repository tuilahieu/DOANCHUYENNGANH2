import { getDB } from "../services/database.services.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const collectionName = "admins";

export async function getAllAdmins() {
  const db = getDB();
  return await db.collection(collectionName).find().toArray();
}

export async function getById(id) {
  const db = getDB();
  return await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
}

export async function getByEmail(email) {
  const db = getDB();
  return await db.collection(collectionName).findOne({ email });
}

export async function createAdmin(admin) {
  const db = getDB();
  const hashedPassword = await bcrypt.hash(admin.password, 10);
  admin.created_at = new Date();
  admin.updated_at = new Date();
  const result = await db
    .collection(collectionName)
    .insertOne({ ...admin, password: hashedPassword });
  return result.insertedId.toString();
}

export async function updateAdmin(id, data) {
  const db = getDB();
  data.updated_at = new Date();
  const result = await db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.matchedCount;
}

export async function deleteAdmin(id) {
  const db = getDB();
  const result = await db
    .collection(collectionName)
    .deleteOne({ _id: new ObjectId(id) });
  console.log(result);
  return result.deletedCount;
}
