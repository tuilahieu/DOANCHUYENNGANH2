## MÔN HỌC: ĐỒ ÁN CHUYÊN NGÀNH

ĐỀ TÀI: Xây dựng Website quản lý sinh viên trường Đại học Công nghệ Đông Á

1.  Mục tiêu: Xây dựng hệ thống giúp nhà trường quản lý thông tin sinh viên, môn học, điểm, lớp học, giảng viên và tài khoản người dùng một cách tập trung, chính xác và thuận tiện.
    Ý nghĩa:

    - Giảm tải công việc quản lý thủ công.
    - Giúp sinh viên, giảng viên và phòng đào tạo tra cứu thông tin dễ dàng.
      -Tăng tính minh bạch và chính xác trong việc quản lý điểm, môn học.

2.  Phân tích yêu cầu (SRS)
    2.1 Đối tượng sử dụng:
    -Quản trị viên (Admin) – Quản lý toàn bộ hệ thống.
    -Sinh viên – Xem thông tin cá nhân, điểm, thanh toán học phí.
    2.2: Chức năng chính theo từng vai trò:
    -Admin

        - Quản lý tài khoản người dùng
        - Quản lý khoa, ngành, lớp học
        - Quản lý danh sách sinh viên và giảng viên
        - Quản lý môn học
        - Phân quyền người dùng

    Sinh viên

    - Xem thông tin cá nhân
    - Tra cứu điểm, lịch học, lịch thi
    - Đăng ký môn học (nếu có chức năng này)

Hệ thống quản lý sinh viên
├── 1. Quản lý tài khoản
│ ├── 1.1. Đăng nhập
│ ├── 1.2. Đăng xuất
│ ├── 1.3. Phân quyền người dùng
│
├── 2. Quản lý sinh viên
│ ├── 2.1. Thêm / sửa / xóa sinh viên
│ ├── 2.2. Tra cứu thông tin sinh viên
│
│
├── 4. Quản lý môn học
│ ├── 4.1. Thêm / sửa / xóa môn học
│ ├── 4.2. Quản lý lớp học phần
│
├── 5. Quản lý điểm
│ ├── 5.1. Nhập điểm sinh viên
│ ├── 5.2. Tra cứu điểm theo sinh viên / lớp / môn
│
└── 6. Báo cáo - thống kê
├── 6.1. Thống kê sinh viên theo lớp, ngành
├── 6.2. Báo cáo kết quả học tập

3. CƠ SỞ DỮ LIỆU

admins: {
id: ObjectID
email_alias: string
full_name: string
email: string
password: string
position: enum
gender: enum
date_of_birth: iso8601
address: string
}

students: {
id: ObjectID
student_code: number
full_name: string
date_of_birth: Date
gender: enum("nam", "nữ")
phone: string
email: string
password: string
address: string
created_at: Date
updated_at: Date
}

student_studies: {
id: ObjectID
student_id: ObjectID // => students.id
class_id: ObjectID // => classes.id
status: enum("ĐANG HỌC", "ĐÃ THÔI HỌC", "ĐÃ TỐT NGHIỆP"),
created_at: Date,
updated_at: Date
}

classes: {
id: ObjectID
class_name: string, // VD: D21CNTT01
major_id: ObjectID, // Thuộc ngành nào
course_year: number, // Khóa học (VD: 2021)
created_at: Date,
updated_at: Date
}

faculties: {
id: ObjectID
name: string // CNTT, Dược,...
created_at: Date,
updated_at: Date
}

majors: {
id: ObjectID
name: string
faculty_id: ObjectID,
created_at: Date,
updated_at: Date
}

subjects: {
id: ObjectID,
subject_code: string, // Mã môn học (VD: IT101)
subject_name: string, // Tên môn học (VD: Lập trình C++)
credit: number, // Số tín chỉ
major_id: ObjectID, // Thuộc ngành nào
semester: number, // Học kỳ (VD: 1, 2, 3...)
created_at: Date,
updated_at: Date
}

student_scores: {
id: ObjectID,
student_id: ObjectID, // users.id
subject_id: ObjectID, // subjects.id
semester: number,
year: number,
score_regular: float,
score_midterm: float,
score_final: float,
score_total: float, // Tính toán tự động
grade: string, // A, B, C, D, F
status: string, // "passed" | "failed"
created_at: Date,
updated_at: Date
}

4. SETUP CODE DỰ ÁN
   LÀM BACKEND TRƯỚC
   CÔNG NGHỆ SỬ DỤNG: NODEJS, MONGODB
   package use: package.json
   <!-- npm install express mongodb cors dotenv express-validator jsonwebtoken bcryptjs bcrypt -->
   <!-- dev: nodemon -->
