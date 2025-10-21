import express from "express";
import dotenv from "dotenv";
import {
  connectDB,
  getDB,
  disconnectDB,
} from "./services/database.services.js";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import classRoutes from "./routes/class.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";
import majorRoutes from "./routes/major.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import studentStudies from "./routes/study.routes.js";
import studentScores from "./routes/score.routes.js";

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/classes", classRoutes);
app.use("/faculties", facultyRoutes);
app.use("/majors", majorRoutes);
app.use("/subjects", subjectRoutes);
app.use("/student-study", studentStudies);
app.use("/student-score", studentScores);

app.use((req, res) => {
  res.status(404).json({
    message: "404 NOT FOUND",
    path: req.originalUrl,
  });
});

connectDB().then(async () => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

process.on("SIGINT", async () => {
  console.log("\n🧹 Closing MongoDB connection...");
  disconnectDB();
  console.log("MongoDB disconnected");
  process.exit(0);
});
