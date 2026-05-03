# SocialX- A Fullstack Social Media Application*[Live Demo](https://socialx.tech)* | 💻 **[Source Code](https://github.com/meetmishra134/socialx)**

---

## 📸 Preview


## ✨ Key Engineering Features

- *Zero-Latency Interactions (Optimistic UI):* Implemented React Query cache manipulation to instantly reflect "Likes" and "Follows" on the frontend before the server responds, completely bypassing network latency.
- *Real-Time Event Engine:* Utilized Socket.io to create targeted WebSocket rooms based on MongoDB ObjectIds. This ensures immediate delivery of feed updates and notifications without broadcasting to the entire server or relying on inefficient HTTP polling.
- *Enterprise-Grade Authentication:* - Integrated standard JWT authentication using strict, HTTP-only, SameSite=lax, secure cookies to prevent XSS attacks.
  - Implemented seamless Google OAuth integration.
  - Engineered an automated account verification and password reset flow using Amazon SES and Nodemailer.
- *Secure Production Deployment:* Manually provisioned and deployed on an AWS EC2 Linux instance. Configured an Nginx reverse proxy to route HTTP and WebSocket traffic to a PM2-managed Node.js cluster, all secured behind Cloudflare's Full (Strict) SSL.

## 🛠️ Tech Stack

*Frontend Architecture:*
- React.js (Vite)
- Tailwind CSS
- Cloudinary (Image Upload)
- React Query (Server State & Optimistic Updates)
- Zustand / Redux Toolkit (Client State)
- @react-oauth/google

*Backend Architecture:*
- Node.js & Express.js
- Socket.io (Real-time WebSockets)
- MongoDB (Mongoose)
- Amazon SES (Simple Email Service)

*DevOps & Infrastructure:*
- AWS EC2
- Nginx (Reverse Proxy)
- PM2 (Process Manager)
- Cloudflare (DNS & SSL)

---

## 🚀 Local Development Setup

Follow these steps to run the SocialX environment on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/meetmishra134/socialx.git
cd socialx