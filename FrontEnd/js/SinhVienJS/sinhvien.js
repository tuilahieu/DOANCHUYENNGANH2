import { initLoading, showLoading, hideLoading } from "../utils/loading.js";
import { apiGet } from "../base/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initLoading();
  showLoading("Đang tải thông tin sinh viên...");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const studentId = payload.id;

    const res = await apiGet(`/students/${studentId}`, token);
    if (!res || !res.status) {
      alert(res?.message);
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }
    const sv = res.data;

    document.getElementById("studentInfo").innerHTML = `
            <div class="space-y-2">
              <p><strong>Mã SV:</strong> <span class="text-blue-700">${
                sv.student_code
              }</span></p>
              <p><strong>Họ tên:</strong> ${sv.full_name}</p>
              <p><strong>Email:</strong> ${sv.email}</p>
              <p><strong>Giới tính:</strong> ${sv.gender}</p>
              <p><strong>Ngày sinh:</strong> ${new Date(
                sv.date_of_birth
              ).toLocaleDateString("vi-VN")}</p>
              <p><strong>Địa chỉ:</strong> ${sv.address ?? "Chưa cập nhật"}</p>
            </div>
          `;
  } catch (err) {
    console.error(err);
    document.getElementById("studentInfo").innerHTML =
      "<p class='text-red-500 text-center'>Không thể tải thông tin sinh viên.</p>";
  } finally {
    hideLoading();
  }

  // 🎯 Nút điều hướng
  document.getElementById("viewScoreBtn").addEventListener("click", () => {
    window.location.href = "./xemdiem.html";
  });

  document.getElementById("nganhHocBtn").addEventListener("click", () => {
    window.location.href = "./nganhhoc.html";
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  });
});
