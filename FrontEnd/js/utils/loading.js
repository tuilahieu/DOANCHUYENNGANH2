// js/loading.js
export async function initLoading() {
  // Chèn nội dung loading.html vào body
  const response = await fetch("../components/loading.html");
  const html = await response.text();
  document.body.insertAdjacentHTML("beforeend", html);
}

export function showLoading() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.classList.add("active");
}

export function hideLoading() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.classList.remove("active");
}
