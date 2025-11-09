# Affiliate System

## 1. Mô tả dự án

Hệ thống **Affiliate theo mã giới thiệu** cho phép người dùng chia sẻ mã hoặc link giới thiệu để mời người khác đăng ký và sử dụng dịch vụ. Khi người được giới thiệu phát sinh giao dịch (như nạp tiền, sạc điện), hệ thống sẽ **ghi nhận và tính hoa hồng** cho người giới thiệu.

Dự án được chia thành 2 phần:

| Thành phần             | Công nghệ         | Mô tả                                                                                                                           |
| ------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**        | NestJS              | Xử lý logic hệ thống, tính hoa hồng, quản lý affiliate, kết nối DB, API. Kiến trúc theo**Clean Architecture** . |
| **Frontend (CMS)** | React + Slash Admin | Giao diện Dashboard cho Affiliate và Admin, xem thống kê, quản lý hoa hồng, người được giới thiệu, chiến dịch,…  |

> Hệ thống được thiết kế có khả năng mở rộng theo nhiều cấp (multi-level affiliate), chống gian lận, và có thể phát triển thành hệ thống đại lý phân phối hàng trong tương lai.

---

## 2. Vai trò người dùng trong hệ thống

| Vai trò                                                      | Mô tả                                                                                                                                                   |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin (CPO / Nhà phân phối / Đại lý cấp cao)** | Quản trị hệ thống, cấu hình chiến dịch, duyệt/chi trả hoa hồng, xem báo cáo.                                                                 |
| **Người giới thiệu (Affiliate)**                    | Có mã & link giới thiệu, chia sẻ để nhận hoa hồng từ hoạt động của người được mời. Có thể có nhiều cấp dưới.                   |
| **Người được giới thiệu (User)**                 | Người dùng mới đăng ký app và sử dụng dịch vụ (như nạp tiền, sạc). Việc sử dụng của họ đem lại hoa hồng cho người giới thiệu. |

---

## 3. Luồng hoạt động

| Bước | Mô tả                                                               |
| ------ | --------------------------------------------------------------------- |
| 1      | Affiliate lấy mã/link từ dashboard                                 |
| 2      | Người mới click link hoặc nhập mã giới thiệu                  |
| 3      | Hệ thống ghi nhận tracking (cookie/IP/user-agent/referral-code)    |
| 4      | Người mới đăng ký app / thực hiện nạp tiền                  |
| 5      | Backend ghi nhận giao dịch → Tính hoa hồng (pending → approved) |
| 6      | Affiliate xem thống kê hoa hồng và có thể yêu cầu rút        |
| 7      | Admin xử lý thanh toán hoa hồng                                   |

---

## 4. Các tính năng chính

### Affiliate / Người giới thiệu

* Lấy mã & link giới thiệu
* Xem danh sách người được giới thiệu (Referrals)
* Xem thống kê click → đăng ký → giao dịch
* Xem số dư hoa hồng (pending / available / paid)
* Yêu cầu rút hoa hồng

### User được giới thiệu

* Đăng ký app qua link/mã giới thiệu
* Có thể nhận ưu đãi (voucher/giảm giá nạp tiền)

### Admin

* Quản lý danh sách affiliate
* Thiết lập chiến dịch & mức hoa hồng (phần trăm / cố định / theo cấp)
* Theo dõi giao dịch & hoa hồng
* Duyệt / hủy / thanh toán hoa hồng
* Báo cáo hiệu suất + chống gian lận

---

## 5. Các loại link giới thiệu

| Loại link                        | Mục đích                                  | Ví dụ                                                |
| --------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| **Link mời người dùng** | Dành cho user cài app → nhận thưởng    | `https://landing.domain.com/?ref=REF123&flow=signup` |
| **Link mời cấp dưới**   | Đăng ký trở thành Affiliate cấp dưới | `https://landing.domain.com/?ref=REF123&flow=join`   |

Cả hai hướng đều dùng  **chung trang landing** , chỉ khác xử lý flow.

---

## 6. Kiến trúc hệ thống

### Backend (NestJS Clean Architecture)

<pre class="overflow-visible!" data-start="3160" data-end="3255"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>src</span><span>/
  domain/
  application/
  infrastructure/
  presentation/ (controllers)
  </span><span>main</span><span>.ts</span><span>
</span></span></code></div></div></pre>

* Tách rõ  **Domain Logic** ,  **Use Cases** ,  **Adapters** .
* DB: PostgreSQL
* Có thể thêm Redis cho queue / tracking / performance.

### Frontend (React + Slash Admin)

<pre class="overflow-visible!" data-start="3423" data-end="3502"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>src</span><span>/
  pages/ (Dashboard & Admin screens)
  components/
  hooks/
  api/
</span></span></code></div></div></pre>

---

## 7. Mở rộng tương lai

| Tính năng mở rộng                          | Ghi chú                                    |
| ---------------------------------------------- | ------------------------------------------- |
| Quản lý đại lý bán hàng                 | Affiliate trở thành đại lý phân phối |
| Quản lý sản phẩm & tồn kho                | Dùng chung cơ chế hoa hồng              |
| Bán hàng đa cấp (MLM) có giới hạn tầng | Đã hỗ trợ base logic                    |
| Chiến dịch thưởng theo mục tiêu          | Gamification (huy hiệu / leaderboard)      |

---

## 8. Cài đặt & Chạy dự án

### Yêu cầu môi trường

* Node >= 18
* PostgreSQL
* pnpm hoặc npm

### Backend

<pre class="overflow-visible!" data-start="3957" data-end="4049"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>cd</span><span> backend
</span><span>cp</span><span> .env.example .</span><span>env</span><span>
pnpm install
pnpm run migrate
pnpm run start:dev
</span></span></code></div></div></pre>

### Frontend

<pre class="overflow-visible!" data-start="4064" data-end="4134"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>cd</span><span> frontend
</span><span>cp</span><span> .env.example .</span><span>env</span><span>
pnpm install
pnpm run dev
</span></span></code></div></div></pre>

---

## 9. Pre-commit / Lint / Format

Cả backend & frontend đều dùng:

* **Husky**
* **lint-staged**
* **ESLint**
* **Prettier**
* **Commitlint (conventional commits)**

<pre class="overflow-visible!" data-start="4306" data-end="4365"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>git commit -m </span><span>"feat: add referral tracking API"</span><span>
</span></span></code></div></div></pre>

---

## 10. License & Liên hệ

* Nội bộ / thương mại.
* Liên hệ phát triển: (điền thông tin nhóm / tổ chức).
