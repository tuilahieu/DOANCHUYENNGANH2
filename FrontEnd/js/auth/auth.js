import { apiPost } from "../base/api.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const rememberMe = document.getElementById("rememberMe").checked;
  const errorMsg = document.getElementById("errorMsg");
  const loginBtn = document.getElementById("loginBtn");

  errorMsg.classList.add("hidden");

  try {
    // 🔄 Loading state
    loginBtn.disabled = true;
    loginBtn.classList.add("opacity-50", "cursor-not-allowed");
    loginBtn.textContent = "Đang đăng nhập...";

    // 📨 Gửi request
    const res = await apiPost("/auth/login", { email, password, rememberMe });

    // ❌ Nếu sai thông tin
    if (!res.status) {
      errorMsg.textContent = res.message || "Sai tài khoản hoặc mật khẩu!";
      errorMsg.classList.remove("hidden");
      resetButton();
      return;
    }

    console.log("Đăng nhập thành công:", res);

    // ✅ Lưu token và role
    localStorage.setItem("token", res.token);
    const payload = JSON.parse(atob(res.token.split(".")[1]));
    localStorage.setItem("role", payload.role);

    window.location.href = "/";
  } catch (error) {
    console.error("Login error:", error);
    errorMsg.textContent = "Không thể kết nối đến máy chủ!";
    errorMsg.classList.remove("hidden");
    resetButton();
  }

  // 🔁 Hàm phụ để khôi phục nút
  function resetButton() {
    loginBtn.disabled = false;
    loginBtn.classList.remove("opacity-50", "cursor-not-allowed");
    loginBtn.textContent = "Đăng nhập";
  }
});
