# Project Requirement Document (PRD)

## SocialX- Social Media Application

### 1. Product Overview

**Product Name:** SocialX  
**Version:** 1.0.0  
**Product Type:** A Fullstack Social Media Application

SocialX is a fullstack social media application intended for peoples who loves social media it is a blend of other apps present here a person can upload post in foem of text and images there is much more in this application which makes user to use this application

## **Features of SocialX**

1. Authentication (Login/Register)
2. Posts (Images/Text)
3. Like & Comment on Posts
4. Feed (All/Following)
5. Follow & Unfollow Peoples
6. Edit Profile
7. See Others Profile
8. Light & Dark Mode
9. Make friends
10. Chat with Followers(Optional now - Learn Socket.io first)

**Database Collections**

- users
- posts
- comments
- followRequest

### 2. Core Features

#### 2.1 Authentication & Authorization

- **User Registration:** Account creation with email verification

- **User Login:** Secure authentication with JWT tokens

- **Password Management:** Change password, forgot/reset password functionality

- **Email Verification:** Account verification via email tokens

- **Token Management:** Access token refresh mechanism

#### 2.2 User Profile Management

- **View User Profile:** Public profile view displaying user details

- **Edit Profile:** Update profile information such as name, bio, and avatar

- **Profile Ownership Control:** Only users can edit their own profiles

- **Profile Visibility:** Profiles accessible to authenticated users

#### 2.3 Feed & Content Discovery

- **Global Feed:** Display posts from all users

- **Following Feed:** Display posts only from followed users

- **Feed Toggle:** Switch between global and following feeds

- **Feed Pagination:** Load content efficiently using pagination or infinite scroll

- **Real-Time Feed Updates:** Automatically update feed after post creation

#### 2.4 Post Creation & Management

- **Create Post:** Create posts with text, images, or both

- **Image Upload:** Upload and attach images to posts

- **Post Validation:** Prevent submission of empty posts

- **Delete Post:** Allow users to delete their own posts

- **Post Ownership Control:** Restrict post modifications to post creators

#### 2.5 Post Interactions

- **Like Posts:** Like or unlike posts

- **Like Count:** Display total likes per post

- **Comment on Posts:** Add comments to posts

- **View Comments:** Display comments associated with a post

- **Comment Ownership:** Allow users to delete their own comments

#### 2.6 Theme & UI Preferences

- **Light Mode:** Default light theme for the application

- **Dark Mode:** Optional dark theme for improved accessibility

- **Theme Persistence:** Save user theme preference across sessions

- **Responsive Design:** Optimized UI for mobile, tablet, and desktop devices

#### 2.7 Social Connections & Profile Content

- **Follow Users:** Users can follow other users from their profile page

- **Unfollow Users:** Users can unfollow users they already follow

- **Accept or Reject Users** -Users can accept or reject the incoming requests

- **Dynamic Follow Action:** Display a Follow or Unfollow button on a user profile based on the current follow relationship

- **Followers Count:** Display the total number of followers on a user profile

- **Following Count:** Display the total number of users a user is following

- **Post Count:** Display the total number of posts created by a user

- **View User Posts:** Display all posts created by a selected user on their profile page

#### 2.8 User Discovery & Exploration

- **User List View:** Display a list of users registered on the platform

- **Basic User Information:** Show user name and profile picture in the user list

- **Profile Navigation:** Allow users to click on a user to view their profile

- **Follow Action:** Allow users to follow other users directly from the user list

- **Unfollow Action:** Allow users to unfollow users they already follow from the user list

- **Exclude Self:** Logged-in user should not appear in their own user list

#### 2.9 System Health

- **Health Check:** API endpoint for system status monitoring

### 3. Technical Specifications

#### 3.1 API Endpoints Structure

**Authentication Routes** (`/api/v1/auth/`)

- `POST /register` - User registration

- `POST /login` - User authentication

- `POST /logout` - User logout (secured)

- `GET /current-user` - Get current user info

- `POST /change-password` - Change user password (secured)

- `POST /refresh-token` - Refresh access token

- `GET /verify-email/:verificationToken` - Email verification

- `POST /forgot-password` - Request password reset

- `POST /reset-password/:resetToken` - Reset forgotten password

- `POST /resend-email-verification` - Resend verification email (secured)

**User Routes** (`/api/v1/users/`)

- `GET/:userId` - Any logged-in user can view any user’s profile (secured)

- `PATCH/me` - User can update only their own profile

- `DELETE/me`- User can delete their own profile

- `GET /api/users/:userId/posts` - View User Posts (Profile Page)

- `POST /api/v1/users/follow/:userId`- Create follow request (pending) DO NOT update followers/following

- `GET /api/v1/users/me/follow-requests`- View Incoming Follow Requests

- `POST /api/v1/users/review/:status/:requestId`- Accept or Reject Follow Request

- `POST /api/v1/users/unfollow/:userId`- Unfollow a user(The user whose req status is accepted is unfollowed )

- `GET/api/v1/users/:userId/followers`- logged in user can see others followers(if they both follow each other) and their followers

- `GET/api/v1/users/:userId/following`- logged in user can see others following(if they both follow each other) and their following

- `GET/users` - List all users Show only their name / username ,profile picture (avatar) , bio
  remember Logged-in user should not appear and Authenticated users only

**User Feed Routes** (`/api/v1/posts/`)

- `GET/feed/global` - Show posts from all users Sorted by latest first & Paginated

- `GET/feed/following` - Show posts only from users I follow and Exclude non-followed users Pagination logic is same

- `GET /api/posts/feed/global?limit=10&cursor=2026-01-16T10:30:00Z`- Cursor-based pagination is stable

**Post Management Routes** (`/api/v1/posts`)

- `POST/upload-post` - Post can contain: text only , image(s) only , text + image(s) & it must not be empty

- `POST/uploads` - Upload image Get image URL & Save URL in post

- `DELETE/:postId` - Only the post creator can delete posts for Others → 403 Forbidden

- `POST/:postId/like` - Use ONE toggle endpoint (like/unlike).

- `POST/:postId/comments` - Seperate schema for comments bcoz it can can grow large , Easier pagination & Ownership control

- `GET /api/posts/:postId/comments` - View Comments for a Post

- `DELETE /api/comments/:commentId` - Delete Comment (OWNER ONLY)

**Health Check** (`/api/v1/healthcheck/`)

- `GET /` - System health status

**3.2 Tech Stack**

**_3.2.1 Frontend (Client)_**

1. Language & lib -> React , Typescript & Vite
2. UI & Styling -> TailwindCss & ShadcnUi
3. State & Data -> Zustand & React Query
4. Routing & Forms -> React hook form , React router , Zod (for validation )

**_3.2.2 Backend (Server) + Database_**

1. Core -> Node , Express , Mongodb & Mongoose
2. Auth -> Jwt & bcrypt (flexible- can be changed)
3. Upload & utils -> Multer & Cloudinary
4. Validatior -> Zod
