import { apiGet } from "../base/api.js";
import { initLoading, showLoading, hideLoading } from "../utils/loading.js";
import { checkLogin } from "../utils/checkLogin.js";
document.addEventListener("DOMContentLoaded", async () => {
  await initLoading();
  showLoading();
  checkLogin();
  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const studentId = payload.id;
  const tbody = document.getElementById("scoreTableBody");

  try {
    const res = await apiGet(`/student-score/${studentId}`, token);

    if (!res || !res.status) {
      alert(res?.message);
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }

    const scores = res.data;
    tbody.innerHTML = ""; // Xóa "Đang tải dữ liệu..."

    if (!scores || scores.length === 0) {
      tbody.innerHTML = `
              <tr>
                <td colspan="9" class="text-center py-4 text-gray-500">
                  Không có dữ liệu điểm.
                </td>
              </tr>`;
      return;
    }

    // Cache để tránh gọi trùng nhiều lần cùng môn
    const subjectCache = {};

    // Hiển thị từng dòng điểm
    for (const d of scores) {
      let subjectName = "-";
      try {
        if (subjectCache[d.subject_id]) {
          subjectName = subjectCache[d.subject_id];
        } else {
          const subject = await apiGet(`/subjects/${d.subject_id}`, token);
          subjectName = subject?.data?.subject_name || "Không có";
          subjectCache[d.subject_id] = subjectName;
        }
      } catch (err) {
        console.error("Lỗi lấy môn học:", err);
      }

      const row = document.createElement("tr");
      row.innerHTML = `
              <td class="border px-3 py-2">${subjectName}</td>
              <td class="border px-3 py-2 text-center">${d.semester ?? "-"}</td>
              <td class="border px-3 py-2 text-center">${d.year ?? "-"}</td>
              <td class="border px-3 py-2 text-center">${
                d.score_regular ?? "-"
              }</td>
              <td class="border px-3 py-2 text-center">${
                d.score_midterm ?? "-"
              }</td>
              <td class="border px-3 py-2 text-center">${
                d.score_final ?? "-"
              }</td>
              <td class="border px-3 py-2 text-center">${
                d.score_total ?? "-"
              }</td>
              <td class="border px-3 py-2 text-center">${d.grade ?? "-"}</td>
              <td class="border px-3 py-2 text-center">${
                d.status ?? "Chưa có"
              }</td>
            `;
      tbody.appendChild(row);
    }
  } catch (error) {
    console.error(error);
    tbody.innerHTML = `
            <tr>
              <td colspan="9" class="text-center text-red-500 py-4">
                Lỗi tải dữ liệu.
              </td>
            </tr>`;
  } finally {
    hideLoading();
  }

  // Nút quay lại
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "./";
  });
});
