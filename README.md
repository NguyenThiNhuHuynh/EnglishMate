EnglishMate — README
Nền tảng “Ask & Fix” cho tiếng Anh: đăng bài nhờ sửa, thảo luận theo bình luận, và sửa tự động bằng AI (Gemini). Dự án xây trên Next.js App Router, MongoDB, Cloudinary, JWT Auth; UI tối/ sáng và sidebar responsive.

Giới thiệu
EnglishMate cho phép người học:
   - Đăng bài cần sửa (kèm ảnh/ video/ audio, tags).
   - Bình luận, upvote/ downvote, đính kèm media.
   - Nhờ AI (Gemini) sửa tự động: “AI FIX”.
   - Quản lý hồ sơ cá nhân (avatar, bio), đăng nhập/ đăng xuất.
   - Trải nghiệm mượt với infinite scroll & skeleton.
     
🚀 Tính năng chính
 * Ask Fix feed
   - Tạo bài viết (FormData, upload nhiều ảnh/ video qua Cloudinary).
   - Xóa bài (chỉ chủ bài viết).
   - Media layout giống Facebook (MediaGrid), đồng nhất chiều cao.
   - Vô hạn trang (IntersectionObserver).
 * Bình luận
   - Tạo/ xóa comment, up/ down vote (tối ưu hóa lạc quan).
   - Đính kèm media, hiển thị lưới ảnh giống feed.

 * AI Fix (Gemini)
   - Gọi API /api/ai/fix?id=... để nhận bản sửa tự động.

 * Hồ sơ người dùng
   - Upload avatar, cập nhật bio.
   - Gắn nhãn vai trò (student/…).

 * Giao diện
   - Dark/ Light mode.

   - Sidebar responsive:
      + lg (desktop/laptop): ≥1024px
      + md (tablet): ≥768px
      + mobile: < 768px

 * Bảo mật
   - JWT token (lưu localStorage), middleware xác thực trên API.
   - CORS/ Formidable cho upload.

🧩 Công nghệ
   - Frontend: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide/ Iconify
   - Backend (API Routes): Next.js API, Mongoose/ MongoDB, Formidable, Cloudinary SDK, Google Generative AI (Gemini)
   - Triển khai: Vercel

🗂️ Cấu trúc thư mục (rút gọn)
├── app/                                   # App Router: route + layout + API routes
│   ├── (root)/                            # Layout chính cho user đã đăng nhập
│   │   ├── page.tsx                       # Trang Profile (welcome, bio, avatar…)
│   │   └── layout.tsx                     # Layout bọc (Navbar/Sidebar responsive)
│   ├── ask-fix/                           # Module Ask Fix
│   │   ├── page.tsx                       # Danh sách Ask Posts (infinite scroll)
│   │   └── [id]/                          # Chi tiết 1 post + comments
│   │       └── page.tsx
│   ├── (auth)/                            # Nhóm route Auth (nếu tách)
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── sign-up/
│   │       └── page.tsx
│   ├── api/                               # Route handlers (Next.js API)
│   │   ├── ask/
│   │   │   ├── all/route.ts               # GET: phân trang tất cả post
│   │   │   ├── create/route.ts            # POST: tạo post (FormData + Cloudinary)
│   │   │   └── delete/route.ts            # DELETE: xóa post
│   │   ├── comment/
│   │   │   ├── by-post/route.ts           # GET: comment theo post (paging)
│   │   │   ├── create/route.ts            # POST: tạo comment (FormData)
│   │   │   ├── delete/route.ts            # DELETE: xóa comment
│   │   │   └── up-down-vote/route.ts      # POST: upvote/downvote
│   │   ├── ai/
│   │   │   └── fix/route.ts               # POST: aiFixAskPost?id=...
│   │   └── user/
│   │       └── update-bio/route.ts        # PATCH: cập nhật bio
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx                         # Root layout: <html>, Theme Provider…
│
├── components/
│   ├── card/
│   │   ├── AskPostCard.tsx                # Card post (list)
│   │   ├── DetailAskPostCard.tsx          # Card post (detail + AI Fix)
│   │   └── CommentCard.tsx                # Card comment (vote/delete)
│   ├── container/
│   │   ├── pageContainer.tsx              # Khung trang
│   │   ├── cardContainer.tsx              # Khung card
│   │   └── modalContainer.tsx             # Khung modal
│   ├── form/
│   │   ├── CreateAskPost.tsx              # Form tạo post (tags, media)
│   │   ├── CommentForm.tsx                # Form tạo comment (files)
│   │   ├── UpdateBio.tsx                  # Modal update bio
│   │   └── UploadAvatar.tsx               # Upload avatar (nếu có)
│   ├── shared/
│   │   ├── other/
│   │   │   └── MediaGrid.tsx              # Lưới ảnh/video kiểu Facebook
│   │   ├── sidebar/
│   │   │   └── Sidebar.tsx                # Sidebar responsive (lg/md/mobile)
│   │   └── theme/
│   │       └── Theme.tsx                  # Nút đổi theme
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       └── tag.tsx
│
├── database/
│   ├── ask.model.ts                       # IAskPost schema
│   ├── comment.model.ts                   # IComment schema
│   ├── user.model.ts                      # IUser schema
│   └── ai-history.model.ts                # IAIHistory schema (lưu input/output AI)
│
├── dtos/                                  # Data Transfer Objects (typed)
│   ├── ask.dto.ts
│   ├── comment.dto.ts
│   ├── user.dto.ts
│   └── ai-history.dto.ts
│
├── lib/
│   ├── actions/                           # Server-side actions (DB logic)
│   │   ├── ask.action.ts                  # createAskPost, getAll, getById, deleteAskPost
│   │   ├── comment.action.ts              # create, getByPost, vote, delete
│   │   ├── user.action.ts                 # fetch/update user
│   │   └── ai-history.action.ts           # aiFixAskPost + ghi history
│   ├── services/                          # Client services (fetch đến /api)
│   │   ├── ask.service.ts
│   │   ├── comment.service.ts
│   │   ├── user.service.ts
│   │   └── ai-history.service.ts
│   ├── middleware/
│   │   └── auth-middleware.ts             # CORS + authenticateToken (dùng cho API routes)
│   ├── cloudinary.ts                      # Cloudinary SDK config
│   ├── mongoose.ts                        # Kết nối Mongo
│   └── utils.ts                           # Helper chung (nếu cần)
│
├── public/
│   ├── default-avatar.png
│   └── ...                                # logo, images tĩnh
│
├── styles/
│   └── theme.css                          # CSS bổ sung (nếu có)
│
├── types/
│   └── env.d.ts                           # Kiểu biến môi trường (optional)
│
├── .env.example                           # Placeholder ENV (không chứa secret thật)
├── .gitignore
├── middleware.ts                          # Next middleware (nếu dùng)
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── README.md

⚙️ Yêu cầu hệ thống
   - Node.js ≥ 18
   - MongoDB (Atlas hoặc self-host)
   - Tài khoản Cloudinary (upload media)
   - API key Gemini (Google Generative AI)

⚙️ Biến môi trường
Tạo env.local (hoặc dùng VERCEL_* env trên Vercel). Khuyến nghị thêm .env.example để mọi người dễ setup.
# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

# Auth
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# Google Gemini
GEMINI_API_KEY=xxxx

# (tùy chọn)
CORS_ORIGIN=https://your-domain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

🔧 Cài đặt & chạy
   # 1) Cài deps
   - npm install

   # 2) Tạo env.local (xem mẫu trên)

   # 3) Chạy dev
   npm run dev
   # Mở http://localhost:3000

   # Build & start production
   npm run build
   npm start 

🔌 API (tóm tắt)
 * Ask
   - POST /api/ask/create (auth, FormData: content, tags[], media[])
   - GET /api/ask/all?page=&limit=
   - GET /api/ask/detail?id=
   - DELETE /api/ask/delete (auth, JSON { postId })

 * Comment
   - POST /api/comment/create (auth, FormData: post, text, media[])
   - GET /api/comment/by-post?postId=&page=&limit=
   - DELETE /api/comment/delete (auth, JSON { commentId })
   - POST /api/comment/up-down-vote (auth, JSON { commentId, action })

 * AI Fix
   - POST /api/ai/fix?id=<askPostId> (auth) → trả về { fixedPost, aiHistory }
   Lưu ý: Các API upload dùng Formidable, không set Content-Type thủ công khi gửi FormData.

🌐 Triển khai trên Vercel
   Dự án đã được deploy và có thể truy cập tại: https://english-mate-kappa.vercel.app/

🔮 Định hướng mở rộng
   - Phân quyền nâng cao (moderator/ admin).
   - Thông báo real-time (new comment/ AI fix xong).
   - Điểm thưởng/ huy hiệu, bảng xếp hạng contributors.
   - Tìm kiếm toàn văn (posts/ comments).
   - NextAuth/ OAuth2; rate limit; audit logs.

📜 License
   Dự án này được phát triển bởi Nguyễn Thị Như Huỳnh.

📞 Liên hệ
Developer: Nguyễn Thị Như Huỳnh
Email: huynh04137@gmail.com
GitHub: https://github.com/NguyenThiNhuHuynh
