EnglishMate
Nền tảng Ask & Fix cho tiếng Anh: đăng bài nhờ sửa, thảo luận theo bình luận, và sửa tự động bằng AI (Gemini).
Xây dựng với Next.js App Router, MongoDB, Cloudinary, JWT Auth – giao diện Dark/Light + sidebar responsive.

<p align="left"> <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" /> <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" /> <img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss&logoColor=white" /> <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" /> <img alt="Vercel" src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel" /> </p>

✨ Tính năng nổi bật
```
📝 Ask Fix feed
Tạo bài viết (FormData), upload nhiều ảnh/video qua Cloudinary.
Xóa bài (chỉ chủ bài viết).
Lưới media giống Facebook (MediaGrid), chiều cao đồng nhất.
Infinite scroll (IntersectionObserver).

💬 Bình luận
Tạo / xóa comment, up/down vote (tối ưu hóa lạc quan).
Đính kèm media, hiển thị lưới ảnh như feed.

🤖 AI Fix (Gemini)
Gọi POST /api/ai/fix?id=... để nhận bản sửa tự động (AI FIX).

👤 Hồ sơ người dùng
Upload avatar, cập nhật bio, gắn nhãn vai trò (student/…).
Đăng nhập/đăng xuất bằng JWT.
```

🌓 Giao diện & Responsive
```
Dark/Light mode.
Sidebar responsive:
lg (desktop/laptop): ≥ 1024px
md (tablet): ≥ 768px
mobile: < 768px
```

🧩 Công nghệ
```
Frontend: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide, Iconify
Backend (API Routes): Next.js API, Mongoose/MongoDB, Formidable, Cloudinary SDK, Google Generative AI (Gemini)
Triển khai: Vercel
```

📂 Cấu trúc thư mục (rút gọn, có nhóm)
```├── app/                                    # App Router: routes + layouts + API
│   ├── (root)/
│   │   ├── page.tsx                        # Trang Profile (bio, avatar…)
│   │   └── layout.tsx                      # Layout chung (Sidebar/Theme)
│   ├── ask-fix/
│   │   ├── page.tsx                        # Danh sách Ask Posts (infinite)
│   │   └── [id]/page.tsx                   # Chi tiết post + comments + AI FIX
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── api/
│   │   ├── ask/
│   │   │   ├── all/route.ts                # GET: phân trang posts
│   │   │   ├── create/route.ts             # POST: tạo post (FormData)
│   │   │   └── delete/route.ts             # DELETE: xóa post
│   │   ├── comment/
│   │   │   ├── by-post/route.ts            # GET: comments theo post
│   │   │   ├── create/route.ts             # POST: tạo comment (FormData)
│   │   │   ├── delete/route.ts             # DELETE: xóa comment
│   │   │   └── up-down-vote/route.ts       # POST: vote
│   │   ├── ai/fix/route.ts                 # POST: aiFixAskPost?id=...
│   │   └── user/update-bio/route.ts        # PATCH: cập nhật bio
│   └── layout.tsx                          # Root layout
│
├── components/
│   ├── card/
│   │   ├── AskPostCard.tsx
│   │   ├── DetailAskPostCard.tsx
│   │   └── CommentCard.tsx
│   ├── container/
│   │   ├── pageContainer.tsx
│   │   ├── cardContainer.tsx
│   │   └── modalContainer.tsx
│   ├── form/
│   │   ├── CreateAskPost.tsx
│   │   ├── CommentForm.tsx
│   │   ├── UpdateBio.tsx
│   │   └── UploadAvatar.tsx
│   ├── shared/
│   │   ├── other/MediaGrid.tsx
│   │   ├── sidebar/Sidebar.tsx
│   │   └── theme/Theme.tsx
│   └── ui/ (button, input, textarea, tag…)
│
├── database/                               # Mongoose models
│   ├── ask.model.ts
│   ├── comment.model.ts
│   ├── user.model.ts
│   └── ai-history.model.ts
│
├── dtos/                                   # Data Transfer Objects
│   ├── ask.dto.ts
│   ├── comment.dto.ts
│   ├── user.dto.ts
│   └── ai-history.dto.ts
│
├── lib/
│   ├── actions/                            # Server actions (DB logic)
│   │   ├── ask.action.ts
│   │   ├── comment.action.ts
│   │   ├── user.action.ts
│   │   └── ai-history.action.ts
│   ├── services/                           # Client services (fetch /api)
│   │   ├── ask.service.ts
│   │   ├── comment.service.ts
│   │   ├── user.service.ts
│   │   └── ai-history.service.ts
│   ├── middleware/auth-middleware.ts       # CORS + authenticateToken
│   ├── cloudinary.ts
│   ├── mongoose.ts
│   └── utils.ts
│
├── public/ (default-avatar.png, logos…)
├── styles/ (theme.css)
├── .env.example                            # Mẫu ENV (không chứa secret)
├── tailwind.config.js / postcss.config.mjs / tsconfig.json / …
└── README.md 
```

🧠 Responsive (Tailwind)
```
Thiết bị	Breakpoint	Ghi chú
Mobile	< md (<768px)	Không prefix
Tablet	md (≥768px)	md:*
Desktop	lg (≥1024px)	lg:*
```

🔐 Biến môi trường
```
Tạo .env.local (và commit .env.example để team dễ setup):
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

# Optional
CORS_ORIGIN=https://your-domain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚙️ Cài đặt & Chạy
```
# 1) Cài deps
npm install

# 2) Tạo .env.local (dựa trên .env.example)

# 3) Chạy dev
npm run dev      # http://localhost:3000

# Production
npm run build
npm start
```

🔌 API (tóm tắt)
```
Ask
POST /api/ask/create — (auth, FormData: content, tags[], media[])
GET /api/ask/all?page=&limit=
GET /api/ask/detail?id=
DELETE /api/ask/delete — (auth, JSON { postId })

Comment
POST /api/comment/create — (auth, FormData: post, text, media[])
GET /api/comment/by-post?postId=&page=&limit=
DELETE /api/comment/delete — (auth, JSON { commentId })
POST /api/comment/up-down-vote — (auth, JSON { commentId, action })

AI Fix
POST /api/ai/fix?id=<askPostId> — (auth) → { fixedPost, aiHistory }
Lưu ý: API upload dùng Formidable → khi gửi FormData không tự set Content-Type.
```

🌐 Deploy
```
Vercel: https://english-mate-kappa.vercel.app/
```

🔮 Định hướng mở rộng
```
Phân quyền nâng cao (moderator/admin).
Thông báo real-time (new comment / AI-fix xong).
Gamification: điểm thưởng, huy hiệu, bảng xếp hạng contributors.
Tìm kiếm toàn văn (posts/comments).
NextAuth/OAuth2; rate limit; audit logs.
```

📄 License
```
Dự án phát triển bởi Nguyễn Thị Như Huỳnh.
```

📬 Liên hệ
```
👩‍💻 Developer: Nguyễn Thị Như Huỳnh
✉️ Email: huynh04137@gmail.com
🐙 GitHub: https://github.com/NguyenThiNhuHuynh
```
