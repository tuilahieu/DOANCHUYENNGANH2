// import { url } from "inspector";
import { logout } from "../auth/logout.js";
import { apiGet, apiPost } from "../base/api.js";
import { checkLogin } from "../utils/checkLogin.js";
import { initLoading, showLoading, hideLoading } from "../utils/loading.js";

document.addEventListener("DOMContentLoaded", async () => {
  checkLogin();
  await initLoading();
  showLoading();

  const token = localStorage.getItem("token");
  const studentTable = document.getElementById("studentTable");
  const addModal = document.getElementById("addModal");
  const addStudentBtn = document.getElementById("addStudentBtn");
  const cancelAdd = document.getElementById("cancelAdd");
  const addStudentForm = document.getElementById("addStudentForm");
  const totalStudents = document.getElementById("totalStudents");
  const searchBtn = document.getElementById("searchBtn");
  const searchCodeInput = document.getElementById("searchCodeInput");
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");

  async function fetchStudents() {
    try {
      const res = await apiGet("/students?page=" + page, token);
      studentTable.innerHTML = "";

      if (res.status) {
        totalStudents.innerText = res.pagination.totalItems || 0;
        if (res.data.length === 0) {
          studentTable.innerHTML += `<tr><td colspan="6" class="text-center py-4">Không tìm thấy sinh viên nào !!</td></tr>`;
        }
        renderStudentTable(res.data);
        renderPagination(res.pagination, (newPage) => {
          params.set("page", newPage);
          window.location.search = params.toString();
        });
      } else {
        console.log(res);
        alert(res.message || res.errors[0].message || "Chưa có sinh viên nào!");
        logout();
      }
    } catch (err) {
      console.error("❌ Lỗi khi fetch sinh viên:", err);
      alert(err);
    } finally {
      hideLoading();
    }
  }

  async function searchStudentByCode(code) {
    await initLoading();
    showLoading();
    if (!code) window.location.reload();
    try {
      const data = await apiGet(`/students/code/${code}`, token);
      // const data = await res.json();

      if (data.status && data.data) {
        renderStudentTable([data.data]);
      } else {
        renderStudentTable([]);
      }
    } catch (error) {
      console.error(error);
      renderStudentTable([]);
    } finally {
      setTimeout(() => {
        hideLoading();
      }, 100);
    }
  }

  searchBtn.onclick = async () => {
    const code = searchCodeInput.value.trim();
    studentTable.innerHTML = "";
    await searchStudentByCode(code);
  };

  function renderStudentTable(students) {
    students.forEach((s) => {
      studentTable.innerHTML += `
            <tr class="border-b hover:bg-gray-50 transition">
              <td class="px-4 py-2 border text-center">${s.student_code}</td>
              <td class="px-4 py-2 border">${s.full_name}</td>
              <td class="px-4 py-2 border">${s.email}</td>
              <td class="px-4 py-2 border text-center">${s.gender}</td>
              <td class="px-4 py-2 border text-center">${formatDateVN(
                s.date_of_birth
              )}</td>
              <td class="px-4 py-2 border text-center">
                <button
              data-id="${s._id}"
              data-student-code="${s.student_code}"
              data-full-name="${s.full_name}"
              class="view-score-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Xem điểm
            </button>
          </td>
              </td>
            </tr>`;
    });

    document.querySelectorAll(".view-score-btn").forEach((btn) => {
      // console.log("click");
      btn.addEventListener("click", () => {
        const studentId = btn.dataset.id;
        const studentCode = btn.dataset.studentCode;
        const fullName = btn.dataset.fullName;
        // console.log("Clicked student:", studentId, studentCode, fullName);
        openScoreModal(studentId, studentCode, fullName);
      });
    });
  }

  async function openScoreModal(studentId, studentCode, fullName) {
    try {
      showLoading();

      // Gọi API để lấy thông tin điểm
      const [studyData, scoreData] = await Promise.all([
        apiGet(`/student-study/${studentId}`, token),
        apiGet(`/student-score/${studentId}`, token),
      ]);
      const { class_id, faculty_id, major_id } = studyData.data;
      const [className, FacultyName, MajorName] = await Promise.all([
        apiGet(`/classes/${class_id}`, token),
        apiGet(`/faculties/${faculty_id}`, token),
        apiGet(`/majors/${major_id}`, token),
      ]);
      // console.log(className, FacultyName, MajorName);

      // xử lí get name từng môn học
      const subjectsHTML = await Promise.all(
        scoreData.data.map(async (subject) => {
          const subjectInfo = await apiGet(
            `/subjects/${subject.subject_id}`,
            token
          );
          // console.log(subject);
          return `
      <tr>
        <td class="border p-2 text-center">${subjectInfo.data.subject_code}</td>
        <td class="border p-2">${subjectInfo.data.subject_name}</td>
        <td class="border p-2 text-center">${subjectInfo.data.credit}</td>
        <td class="border p-2 text-center">${subjectInfo.data.semester}</td>
        <td class="border p-2 text-center">${subject.score_regular}</td>
        <td class="border p-2 text-center">${subject.score_midterm}</td>
        <td class="border p-2 text-center">${subject.score_final ?? ""}</td>
        <td class="border p-2 text-center">${subject.grade ?? ""}</td>
        <td class="border p-2 text-center">${subject.status || "chờ thi"}</td>
      </tr>`;
        })
      );
      // Render modal hiển thị thông tin
      const modal = document.getElementById("scoreModal");
      const modalContent = document.getElementById("scoreContent");

      modal.classList.remove("hidden");

      modalContent.innerHTML = `
      <h2 class="text-xl font-semibold mb-2">${fullName} - Mã SV: ${studentCode}</h2>
      <div class="mb-4">
        <p><strong>Lớp:</strong> ${className.data.class_name}</p>
        <p><strong>Khoa:</strong> ${FacultyName.data.name}</p>
        <p><strong>Chuyên ngành:</strong> ${MajorName.data.name}</p>
      </div>
      
      <table class="w-full border-collapse border border-gray-300 mb-3">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-2">Mã môn</th>
            <th class="border p-2">Tên môn</th>
            <th class="border p-2">Số tín chỉ</th>
            <th class="border p-2">Kì học</th>
            <th class="border p-2">Điểm CK</th>
            <th class="border p-2">Điểm GK</th>
            <th class="border p-2">Điểm thi</th>
            <th class="border p-2">Điểm chữ</th>
            <th class="border p-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody class="text-center">
          ${subjectsHTML}
        </tbody>
      </table>

      <div class="flex justify-end">
        <button
          id="closeScoreModal"
          class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          Đóng
        </button>
      </div>
    `;

      document.getElementById("closeScoreModal").onclick = () => {
        modal.classList.add("hidden");
      };
    } catch (err) {
      console.error(err);
      // alert("Lỗi khi tải dữ liệu điểm học tập!");
    } finally {
      hideLoading();
    }
  }

  function renderPagination(pagination, onPageChange) {
    const container = document.getElementById("paginationContainer");
    container.innerHTML = ""; // Xóa cũ

    if (!pagination || pagination.totalPages <= 1) return; // Không cần phân trang nếu chỉ có 1 trang

    const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

    // Nút Prev
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "«";
    prevBtn.className =
      "px-3 py-1 rounded border text-sm " +
      (hasPrevPage
        ? "hover:bg-blue-100 text-blue-600 border-blue-400"
        : "text-gray-400 border-gray-300 cursor-not-allowed");
    prevBtn.disabled = !hasPrevPage;
    prevBtn.onclick = () => hasPrevPage && onPageChange(currentPage - 1);
    container.appendChild(prevBtn);

    // Các số trang
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className =
        "px-3 py-1 rounded border text-sm " +
        (i === currentPage
          ? "bg-blue-600 text-white border-blue-600"
          : "hover:bg-blue-100 text-blue-600 border-blue-400");
      btn.onclick = () => onPageChange(i);
      container.appendChild(btn);
    }

    // Nút Next
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "»";
    nextBtn.className =
      "px-3 py-1 rounded border text-sm " +
      (hasNextPage
        ? "hover:bg-blue-100 text-blue-600 border-blue-400"
        : "text-gray-400 border-gray-300 cursor-not-allowed");
    nextBtn.disabled = !hasNextPage;
    nextBtn.onclick = () => hasNextPage && onPageChange(currentPage + 1);
    container.appendChild(nextBtn);
  }

  // ➕ Mở / đóng modal thêm sinh viên
  addStudentBtn.onclick = () => addModal.classList.remove("hidden");
  cancelAdd.onclick = () => addModal.classList.add("hidden");

  // 🧾 Xử lý thêm sinh viên
  addStudentForm.onsubmit = async (e) => {
    e.preventDefault();

    const body = {
      student_code: +document.getElementById("student_code").value.trim(),
      full_name: document.getElementById("full_name").value.trim(),
      email:
        document.getElementById("student_code").value.trim() + "@eaut.edu.vn",
      gender: document.getElementById("gender").value.trim(),
      date_of_birth: document.getElementById("date_of_birth").value.trim(),
      address: document.getElementById("address").value.trim(),
      password: "123456@Ab",
    };
    try {
      const res = await apiPost("/students", body, token);
      console.log(res);

      if (res.status) {
        addModal.classList.add("hidden");
        await fetchStudents();
      } else {
        alert(res.message || res.errors[0].message);
      }
    } catch (err) {
      console.error("❌ Lỗi khi thêm sinh viên:", err);
      //   alert(err.error || "Đã có lỗi xảy ra!");
    } finally {
      hideLoading();
    }
  };

  function formatDateVN(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
  }

  await fetchStudents();
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logout();
  });
});
