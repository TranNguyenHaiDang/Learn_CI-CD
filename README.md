<h1 align="center">🚀 Nodejs CI/CD Architecture</h1>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="Actions" />
  <img src="https://img.shields.io/badge/Self--Hosted_Runner-4EAA25?style=for-the-badge&logo=github&logoColor=white" alt="Runner" />
</p>

<p align="center">
  <i>Tài liệu mô tả kiến trúc Triển khai liên tục (CI/CD) của dự án Nodejs, sử dụng Self-hosted Runner và Docker Compose khép kín.</i>
</p>

---

## 🐳 Bản Đồ Vận Hành Tổng Thể

Dưới đây là sơ đồ luồng tự động hóa duy nhất (Single-Job Workflow) được thực thi mỗi khi có sự kiện `git push` lên nhánh `main`:

```text
=============================================================================================
🛠️ GIAI ĐOẠN 0: THIẾT LẬP HẠ TẦNG
=============================================================================================
  [ ☁️ DOCKER HUB ] : Sinh Access Token (Quyền Read & Write).
  [ 🐙 GITHUB ]     : Lưu Token (DOCKER_USERNAME, DOCKER_PASSWORD) & PORT vào Secrets.
  [ 🖥️ VPS ]        : Cài đặt Runner, Docker, Docker Compose. Chạy Runner 24/7.

=============================================================================================
👨‍💻 GIAI ĐOẠN 1: KÍCH HOẠT (Khi gõ lệnh git push)
=============================================================================================
  [ 👨‍💻 DEV ] --(push code)--> [ 🐙 GITHUB ] --(gọi điện)--> ⚡ Đánh thức RUNNER trên VPS

╭───────────────────────────────────────────────────────────────────────────────────────────╮
│ 🖥️ BÊN TRONG MÁY CHỦ VPS (Mọi thứ diễn ra xuyên suốt tại 1 điểm)                          │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  ╭─────────────────────────────────────────────────────────────────────────────────────╮  │
│  │ 🤖 PHẦN MỀM GITHUB RUNNER (actions-runner)                                          │  │
│  │ 📍 Vị trí làm việc: /root/actions-runner/_work/RoyolaChat/RoyolaChat/               │  │
│  │                                                                                     │  │
│  │  🟡 BƯỚC CI: TẠO MÔI TRƯỜNG, ĐÚC IMAGE & ĐẨY LÊN MÂY                                │  │
│  │   ├─ 1️⃣ 📥 Kéo Code    : Khôi phục mã nguồn (Dockerfile, docker-compose.yml...).    │  │
│  │   ├─ 2️⃣ 📝 Tạo .env    : Tự động trích xuất secret PORT để sinh ra file .env.       │  │
│  │   ├─ 3️⃣ 🔐 Đăng Nhập   : Tự động xác thực với Docker Hub bằng Username & Password.  │  │
│  │   ├─ 4️⃣ 🛠️ Đúc Image   : Build mã nguồn thành một khối Docker Image hoàn chỉnh.     │  │
│  │   └─ 5️⃣ 🚀 Push Image  : Đẩy khối Image vừa đúc lên kho lưu trữ Docker Hub.         │  │
│  │                                                                                     │  │
│  │  🟢 BƯỚC CD: TRIỂN KHAI NGAY TẠI CHỖ (Không cần lệnh copy)                          │  │
│  │   ├─ 6️⃣ ☁️ Tải Image   : Chạy `docker compose pull` (Lấy bản xịn nhất vừa push).    │  │
│  │   └─ 7️⃣ 🔄 Lên Sóng    : Chạy `docker compose up -d` (Dập bản cũ, dựng bản mới).    │  │
│  ╰───────┬─────────────────────────────────────────────────────────────────────────────╯  │
│          │                                                                                │
│          ▼ (Runner ra lệnh cho hệ thống lõi)                                              │
│  ╭─────────────────────────────────────────────────────────────────────────────────────╮  │
│  │ 🐳 DOCKER ENGINE & DOCKER COMPOSE                                                   │  │
│  │ - Compose tự động tìm thấy file docker-compose.yml đang nằm sẵn ở thư mục _work.    │  │
│  │ - Động cơ thực hiện thay thế Container API cũ bằng Container mới tinh.              │  │
│  │ - Zero Downtime: Container PostgreSQL Database không bị ảnh hưởng.                  │  │
│  ╰─────────────────────────────────────────────────────────────────────────────────────╯  │
│                                                                                           │
╰───────────────────────────────────────────────────────────────────────────────────────────╯
```

<h1 align="center">🚀 Nodejs CI/CD Architecture (PM2)</h1>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white" alt="PM2" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="Actions" />
  <img src="https://img.shields.io/badge/Self--Hosted_Runner-4EAA25?style=for-the-badge&logo=github&logoColor=white" alt="Runner" />
</p>

<p align="center">
  <i>Tài liệu mô tả kiến trúc Triển khai liên tục (CI/CD) của dự án Nodejs, chạy trực tiếp trên máy chủ vật lý (Bare-metal) sử dụng Self-hosted Runner và PM2.</i>
</p>

---

## 👾 Bản Đồ Vận Hành Tổng Thể

Dưới đây là sơ đồ luồng tự động hóa (Single-Job Workflow) được thực thi mỗi khi có sự kiện `git push` lên nhánh `main`:

```text
=============================================================================================
🛠️ GIAI ĐOẠN 0: THIẾT LẬP HẠ TẦNG
=============================================================================================
  [ 🐙 GITHUB ]     : Lưu các biến môi trường (PORT, DATABASE_URL) vào Settings > Secrets.
  [ 🖥️ VPS ]        : Cài đặt Runner, Node.js, PM2. Chạy Runner 24/7.

=============================================================================================
👨‍💻 GIAI ĐOẠN 1: KÍCH HOẠT (Khi gõ lệnh git push)
=============================================================================================
  [ 👨‍💻 DEV ] --(push code)--> [ 🐙 GITHUB ] --(gọi điện)--> ⚡ Đánh thức RUNNER trên VPS

╭───────────────────────────────────────────────────────────────────────────────────────────╮
│ 🖥️ BÊN TRONG MÁY CHỦ VPS (Mọi thao tác can thiệp trực tiếp vào ổ cứng vật lý)             │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  ╭─────────────────────────────────────────────────────────────────────────────────────╮  │
│  │ 🤖 PHẦN MỀM GITHUB RUNNER (actions-runner)                                          │  │
│  │ 📍 Vị trí làm việc tạm thời: /root/actions-runner/_work/RoyolaChat/RoyolaChat/      │  │
│  │                                                                                     │  │
│  │  🟡 BƯỚC CI: XƯỞNG BUILD & ĐÓNG GÓI MÃ NGUỒN                                        │  │
│  │   ├─ 1️⃣ 📥 Kéo Code    : Khôi phục mã nguồn từ nhánh main (uses: checkout@v4).       │  │
│  │   ├─ 2️⃣ 📦 Cài Đặt    : Chạy `npm install` để tải các thư viện cần thiết.           │  │
│  │   └─ 3️⃣ 🛠️ Đóng Gói   : Chạy `npm run build` sinh ra thư mục thành phẩm `dist/`.    │  │
│  │                                                                                     │  │
│  │  🟢 BƯỚC CD: ĐỒNG BỘ VÀ RA LỆNH TRIỂN KHAI                                          │  │
│  │   ├─ 4️⃣ 📝 Tạo .env    : Tự động trích xuất secret để sinh ra file cấu hình .env.    │  │
│  │   ├─ 5️⃣ 📂 Đồng Bộ    : Chạy `rsync` copy `dist` và `.env` sang thư mục chạy thật.  │  │
│  │   └─ 6️⃣ 🔄 Ra Lệnh    : Chạy `pm2 restart royolachat-api` để tải lại mã nguồn.      │  │
│  ╰───────┬─────────────────────────────────────────────────────────────────────────────╯  │
│          │                                                                                │
│          ▼ (Runner ném mã nguồn sang và đánh điện báo cho PM2 làm việc)                   │
│  ╭─────────────────────────────────────────────────────────────────────────────────────╮  │
│  │ 👾 PM2 PROCESS MANAGER (Người Quản Gia Máy Chủ)                                     │  │
│  │ 📍 Vị trí vận hành thật: /var/www/RoyolaChat/                                       │  │
│  │ - Nhận lệnh từ Runner để khởi động lại tiến trình ứng dụng API.                     │  │
│  │ - Tự động giữ nguyên tiến trình cũ chờ code mới khởi tạo xong (Zero Downtime).      │  │
│  ╰─────────────────────────────────────────────────────────────────────────────────────╯  │
│                                                                                           │
╰───────────────────────────────────────────────────────────────────────────────────────────╯
```
