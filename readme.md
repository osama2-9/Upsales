# Media Catalog Admin Dashboard

A full-stack media catalog web app with admin functionality. Built using Express.js, Prisma, MySQL, Vite, React, Tailwind CSS, TypeScript, shadcn/ui, and Cloudinary.

**NOTE: I didnt implement a full authentication system, I just used JWT cookies for authentication.**

## 🌐 Live Demo
[Live Demo](https://upsales.vercel.app)

## 📁 Folder Structure

```bash
server/      # Express backend (API, controllers, Prisma)
client/      # Vite + React frontend
```


## ✅ Features
### Admin Features
- Add, update, and delete media entries
- Upload poster images via Cloudinary
- Infinite scroll for media listings
- Filter/search media

### User Features
- View media catalog
- Read basic information about movies and TV shows

## 👤 Authentication
- JWT-based auth with cookies
- Admin and user roles

**Admin credentials:**
- Email: `admin@gmail.com`
- Password: `adminpassword`

**User credentials:**
- Email: `user@gmail.com`
- Password: `userpassword`

## 🧪 Backend API Endpoints
### Auth Routes (`/api/auth`)

| Method | Endpoint   | Body / Query                  | Description               |
|--------|------------|-------------------------------|---------------------------|
| POST   | `/signup`  | `{ name, email, password }`   | Register a new user       |
| POST   | `/login`   | `{ email, password }`         | Log in a user/admin       |
| POST   | `/logout`  | -                             | Log out and clear cookie  |

### Media Routes (`/api/media`)
*All POST/PUT/DELETE routes require `verifyCookie` (JWT in cookies) and `verifyAdmin`.*

| Method | Endpoint          | Payload / Query                     | Description                  |
|--------|-------------------|-------------------------------------|------------------------------|
| GET    | `/get-media`      | `?page=1&limit=10`                 | Get paginated media list     |
| GET    | `/media`          | `?mediaId=1`                       | Get single media by ID       |
| POST   | `/add-media`      | FormData with media fields + poster | Add new media entry          |
| PUT    | `/update-media`   | FormData or JSON with updated fields| Update media                 |
| DELETE | `/delete-media`   | `?mediaId=1`                       | Delete media entry by ID     |

## 🎨 Frontend Tech Stack
- **React (Vite)**: Lightning-fast UI
- **Tailwind CSS**: Utility-first CSS
- **shadcn/ui**: Component library
- **React Query**: API state management
- **Zod + react-hook-form**: Validations
- **Recoil**: Global user state

## 🧠 State Management
- Recoil used for authentication context
- Local storage holds JWT user snapshot

## 📸 Image Upload
- Cloudinary API used for poster uploads
- Upload preset and cloud name configured in `UpdateModal.tsx`

## 🛠 Setup Instructions
### Backend
```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev

```

## Validation & Middleware

- Zod schemas for auth and media inputs
- validate() middleware ensures data structure
- verifyAdmin protects admin-only endpoints

## 📦 Media Object Structure

```typescript
interface Media {
  mediaId: number;
  title: string;
  director: string;
  duration: string;
  budget: string;
  location: string;
  year: string;
  type: "Movie" | "TVshow";
  posterUrl: string | null;
  user: { name: string };
  createdAt: string;
  updatedAt: string;
}
```

## 📝 Notes

- Infinite scroll adapts to screen size (mobile = 1 item)
- Zod schemas validate request bodies and query params
- Image uploads bypass next-cloudinary and use raw API calls