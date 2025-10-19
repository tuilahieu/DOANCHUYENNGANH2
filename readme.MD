# 🎓 ĐỒ ÁN CHUYÊN NGÀNH

## Đề tài: Xây dựng Website Quản lý Sinh viên – Trường Đại học Công nghệ Đông Á

---

## 🧭 1. Giới thiệu

### 🎯 Mục tiêu

Xây dựng hệ thống giúp nhà trường quản lý **thông tin sinh viên, môn học, điểm, lớp học, giảng viên và tài khoản người dùng** một cách tập trung, chính xác và thuận tiện.

### 💡 Ý nghĩa

- Giảm tải công việc quản lý thủ công.
- Giúp sinh viên, giảng viên và phòng đào tạo tra cứu thông tin dễ dàng.
- Tăng tính minh bạch và chính xác trong quản lý điểm, môn học và kết quả học tập.

---

## 👥 2. Đối tượng sử dụng

| Vai trò       | Quyền hạn chính                                                                            |
| ------------- | ------------------------------------------------------------------------------------------ |
| **Admin**     | Quản lý toàn bộ hệ thống: tài khoản, khoa, lớp, sinh viên, giảng viên, môn học, phân quyền |
| **Sinh viên** | Xem thông tin cá nhân, điểm số, lịch học, lịch thi, đăng ký môn học (nếu có)               |

---

## ⚙️ 3. Phân tích chức năng (SRS)

### 3.1. Quản trị viên (Admin)

- 👤 Quản lý tài khoản người dùng (thêm / sửa / xóa / phân quyền)
- 🏫 Quản lý khoa, ngành, lớp học
- 🎓 Quản lý danh sách sinh viên, giảng viên
- 📘 Quản lý môn học
- 🔐 Phân quyền người dùng

### 3.2. Sinh viên

- 👨‍🎓 Xem thông tin cá nhân
- 📊 Tra cứu điểm, lịch học, lịch thi
- 📝 Đăng ký môn học _(tùy chọn)_

---

## 🧩 4. Cấu trúc hệ thống

Hệ thống quản lý sinh viên
├── 1. Quản lý tài khoản
│ ├── Đăng nhập / Đăng xuất
│ ├── Phân quyền người dùng
│
├── 2. Quản lý sinh viên
│ ├── Thêm / sửa / xóa sinh viên
│ ├── Tra cứu thông tin sinh viên
│
├── 3. Quản lý lớp học
│ ├── Thêm / sửa / xóa lớp
│ ├── Quản lý sinh viên trong lớp
│
├── 4. Quản lý môn học
│ ├── Thêm / sửa / xóa môn học
│ ├── Quản lý lớp học phần
│
├── 5. Quản lý điểm
│ ├── Nhập điểm sinh viên
│ ├── Tra cứu điểm theo sinh viên / lớp / môn
│
└── 6. Báo cáo - thống kê
├── Thống kê sinh viên theo lớp, ngành
├── Báo cáo kết quả học tập

---

## 🗄️ 5. Thiết kế cơ sở dữ liệu (MongoDB)

### 📁 **admins**

| Trường        | Kiểu dữ liệu | Mô tả           |
| ------------- | ------------ | --------------- |
| id            | ObjectId     | ID admin        |
| email_alias   | string       | Tên hiển thị    |
| full_name     | string       | Họ và tên       |
| email         | string       | Email đăng nhập |
| password      | string       | Mật khẩu (hash) |
| position      | enum         | Chức vụ         |
| gender        | enum         | Giới tính       |
| date_of_birth | date         | Ngày sinh       |
| address       | string       | Địa chỉ         |

### 📁 **students**

| Trường        | Kiểu             | Mô tả        |
| ------------- | ---------------- | ------------ |
| id            | ObjectId         |
| student_code  | number           | Mã sinh viên |
| full_name     | string           |
| date_of_birth | date             |
| gender        | enum("nam","nữ") |
| phone         | string           |
| email         | string           |
| password      | string           |
| address       | string           |
| created_at    | date             |
| updated_at    | date             |

### 📁 **student_studies**

| Trường     | Kiểu                                           | Mô tả |
| ---------- | ---------------------------------------------- | ----- |
| id         | ObjectId                                       |
| student_id | ObjectId → students.id                         |
| class_id   | ObjectId → classes.id                          |
| status     | enum("ĐANG HỌC","ĐÃ THÔI HỌC","ĐÃ TỐT NGHIỆP") |
| created_at | date                                           |
| updated_at | date                                           |

### 📁 **classes**

| Trường      | Kiểu     | Mô tả           |
| ----------- | -------- | --------------- |
| id          | ObjectId |
| class_name  | string   | VD: D21CNTT01   |
| major_id    | ObjectId | Ngành học       |
| course_year | number   | Khóa (VD: 2021) |
| created_at  | date     |
| updated_at  | date     |

### 📁 **faculties**

| Trường     | Kiểu     | Mô tả          |
| ---------- | -------- | -------------- |
| id         | ObjectId |
| name       | string   | CNTT, Dược,... |
| created_at | date     |
| updated_at | date     |

### 📁 **majors**

| Trường     | Kiểu     | Mô tả |
| ---------- | -------- | ----- |
| id         | ObjectId |
| name       | string   |
| faculty_id | ObjectId |
| created_at | date     |
| updated_at | date     |

### 📁 **subjects**

| Trường       | Kiểu     | Mô tả             |
| ------------ | -------- | ----------------- |
| id           | ObjectId |
| subject_code | string   | VD: IT101         |
| subject_name | string   | VD: Lập trình C++ |
| credit       | number   | Số tín chỉ        |
| major_id     | ObjectId |
| semester     | number   | Học kỳ            |
| created_at   | date     |
| updated_at   | date     |

### 📁 **student_scores**

| Trường        | Kiểu     | Mô tả               |
| ------------- | -------- | ------------------- |
| id            | ObjectId |
| student_id    | ObjectId |
| subject_id    | ObjectId |
| semester      | number   |
| year          | number   |
| score_regular | float    | Điểm thường xuyên   |
| score_midterm | float    | Điểm giữa kỳ        |
| score_final   | float    | Điểm cuối kỳ        |
| score_total   | float    | Tổng điểm           |
| grade         | string   | A/B/C/D/F           |
| status        | string   | "passed" / "failed" |
| created_at    | date     |
| updated_at    | date     |

---

## ⚙️ 6. Công nghệ sử dụng (Backend)

| Thành phần              | Công nghệ                    |
| ----------------------- | ---------------------------- |
| **Ngôn ngữ**            | Node.js (ESM)                |
| **CSDL**                | MongoDB                      |
| **Framework**           | Express.js                   |
| **Bảo mật**             | JSON Web Token (JWT), bcrypt |
| **Xác thực & validate** | express-validator            |
| **Cấu hình môi trường** | dotenv                       |
| **Dev tools**           | nodemon, Postman             |

---

## 🚀 7. Hướng dẫn cài đặt & chạy

### 7.1. Cài đặt package

```bash
npm install
```
