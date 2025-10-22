import { initLoading, showLoading, hideLoading } from "../utils/loading.js";
import { apiGet } from "../base/api.js";
import { checkLogin } from "../utils/checkLogin.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initLoading();
  showLoading();
  checkLogin();

  try {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const studentId = payload.id;

    // Gọi API học tập
    const res = await apiGet(`/student-study/${studentId}`, token);
    if (!res || !res.status) {
      alert(res?.message);
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }
    const study = res.data;

    // Lấy thông tin liên kết
    const [cls, major, faculty] = await Promise.all([
      apiGet(`/classes/${study.class_id}`, token),
      apiGet(`/majors/${study.major_id}`, token),
      apiGet(`/faculties/${study.faculty_id}`, token),
    ]);

    const classInfo = cls.data;
    const majorInfo = major.data;
    const facultyInfo = faculty.data;

    document.getElementById("studyInfo").innerHTML = `
            <div class="border-b border-gray-200 pb-4">
              <p><strong>Trạng thái:</strong> ${study.status}</p>
            </div>

            <div class="border-b border-gray-200 pb-4">
              <h2 class="text-xl font-semibold text-blue-500">Lớp học</h2>
              <p><strong>Năm học:</strong> ${classInfo.course_year}</p>
              <p><strong>Tên lớp:</strong> ${classInfo.class_name}</p>
            </div>

            <div class="border-b border-gray-200 pb-4">
              <h2 class="text-xl font-semibold text-green-500">Ngành học</h2>
              <p><strong>Chuyên ngành:</strong> ${majorInfo.name}</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-purple-500">Khoa</h2>
              <p><strong>Tên khoa:</strong> ${facultyInfo.name}</p>
            </div>
          `;
  } catch (err) {
    console.error("Lỗi:", err);
    document.getElementById("studyInfo").innerHTML =
      '<p class="text-red-500 text-center">Không thể tải thông tin ngành học.</p>';
  } finally {
    hideLoading();
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/";
});
