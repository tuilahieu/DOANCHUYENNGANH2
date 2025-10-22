import { apiGet } from "../base/api.js";
import { initLoading, showLoading, hideLoading } from "../utils/loading.js";
import { checkLogin } from "../utils/checkLogin.js";
import { decodeJwt } from "../utils/decodeJwt.js";

document.addEventListener("DOMContentLoaded", async () => {
  checkLogin();
  await initLoading();
  showLoading();
  const token = localStorage.getItem("token");
  const userName = document.getElementById("userName");
  const loadingState = document.getElementById("loadingState");
  const userInfoContainer = document.getElementById("userInfoContainer");

  try {
    loadingState.classList.remove("hidden");
    userInfoContainer.classList.add("hidden");

    // const payload = JSON.parse(atob(token.split(".")[1]));
    const payload = decodeJwt(token);
    const adminId = payload.id;

    // 📨 Gọi API lấy thông tin admin
    const res = await apiGet(`/admin/${adminId}`, token);

    if (!res || !res.status) {
      alert(res.message || "Đã có lỗi xảy ra.");
      return;
    }

    const admin = res.data;

    // 🧾 Hiển thị thông tin ra giao diện
    document.getElementById("displayName").textContent = admin.full_name;
    document.getElementById("displayEmail").textContent = admin.email;
    document.getElementById("displayRole").textContent = admin.position;
    document.getElementById("displayBirthDay").textContent =
      admin.date_of_birth;
    document.getElementById("displayGender").textContent = admin.gender;

    userName.textContent = admin.full_name;

    // Ẩn loading, hiện dữ liệu
    loadingState.classList.add("hidden");
    userInfoContainer.classList.remove("hidden");
  } catch (error) {
    console.error("Lỗi khi tải thông tin admin:", error);
    alert(error.message || "Đã có lỗi xảy ra.");
  } finally {
    hideLoading();
  }

  // 🚪 Đăng xuất
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  });
});
