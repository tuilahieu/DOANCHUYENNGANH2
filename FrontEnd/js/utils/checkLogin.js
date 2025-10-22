export function checkLogin() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }
}
