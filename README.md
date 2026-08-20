# 🚀 CodeAlpha Internship Projects

Welcome to my **CodeAlpha Web Development Internship** repository! This repository showcases full-stack web applications developed during the internship, highlighting modern UI/UX design, responsive layouts, client and server-side state management, and interactive user experiences.

---

## 📌 Table of Contents
- [Overview](#overview)
- [Task 1: E-Commerce Store](#task-1-e-commerce-store)
- [Task 2: Pulse — Mini Social Media Platform](#task-2-pulse--mini-social-media-platform)
- [Repository Structure](#repository-structure)
- [Getting Started & Installation](#getting-started--installation)
- [Technologies & Tools](#technologies--tools)
- [Author & Acknowledgments](#author--acknowledgments)

---

## 📖 Overview

| Task | Project Name | Description | Tech Stack |
| :--- | :--- | :--- | :--- |
| **Task 1** | **E-Commerce Store** | Online shopping platform with product catalog, cart, and checkout system | React, TypeScript, Tailwind CSS, Lucide Icons |
| **Task 2** | **Pulse — Social Media Platform** | Full-stack social networking app with posts, polls, comments, and real-time feeds | React 19, TypeScript, Express.js, Tailwind CSS, REST API |

---

## 🛍️ Task 1: E-Commerce Store

A modern and responsive **E-Commerce Web Application** designed for a smooth online shopping experience with product discovery, category filters, cart management, and checkout workflow.

### ✨ Key Features
- **Product Catalog & Showcase**: Interactive product cards displaying high-quality images, pricing, ratings, discounts, and inventory status.
- **Dynamic Search & Filtering**:
  - Live keyword search across product titles and descriptions.
  - Category filters (e.g., Electronics, Fashion, Accessories, Home).
  - Price range and rating filter controls.
  - Sorting options (*Price: Low to High / High to Low, Highest Rated, Newest*).
- **Product Details View**: Comprehensive modal/view with item descriptions, specifications, quantity selector, and related items.
- **Interactive Shopping Cart**:
  - Add to cart, increment/decrement quantities, and remove items.
  - Real-time subtotal, tax, discount calculation, and free shipping tracker.
- **Wishlist / Favorites**: Save desired items with one click for quick future access.
- **Seamless Checkout Flow**: Clean multi-step checkout with mock payment methods and order confirmation summary.
- **Responsive & Mobile-First**: Optimized for mobile, tablet, and desktop viewports.

### 🛠️ Tech Stack (Task 1)
- **Frontend**: React, TypeScript, Tailwind CSS
- **Icons & UI**: Lucide React
- **State Management**: React Context / Hooks & Local Persistence

---

## 📱 Task 2: Pulse — Mini Social Media Platform

A full-stack social media application featuring rich multimedia posting, interactive polls, real-time engagement mechanics, customizable profiles, and instant notifications.

### ✨ Key Features
- **Rich Post Creation**:
  - Compose text updates with automated `#hashtag` styling.
  - Attach images and multimedia links.
  - Create interactive polls with real-time percentage updates and vote tallies.
- **Dual-Feed System**:
  - **For You**: Discovery feed showcasing engaging posts from across the platform.
  - **Following**: Dedicated chronological feed from accounts the user follows.
- **Social Graph & Interactions**:
  - Instant **Follow / Unfollow** mechanism.
  - Post likes, bookmarks (saved posts), and reposts.
  - Threaded comment system with nested replies.
- **User Profiles & Activity**:
  - Customizable profile banner, avatar, bio, location, and website link.
  - Tabbed views for *Posts, Media, Likes, and Saved Bookmarks*.
- **Notification Center**:
  - Real-time notifications for new followers, post likes, and comment replies.
- **Demo Profile Switcher**:
  - Quickly switch between different test user profiles to test peer-to-peer interactions without logging out.
- **Full-Stack REST Architecture**:
  - Express.js backend for serving feeds, user data, and handling interactions.

### 🛠️ Tech Stack (Task 2)
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion
- **Backend**: Node.js, Express.js (REST API)
- **State & Storage**: React Context API, JSON Data Persistence

---

## 📂 Repository Structure

```text
CodeAlpha_Tasks/
├── README.md
├── Task-1-Ecommerce-Store/
│   ├── src/
│   │   ├── components/
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── Task-2-Social-Media-Platform/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── types.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── server.ts
    ├── package.json
    └── vite.config.ts
