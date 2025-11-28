# 🚀 ResumeCraft AI

> **Build ATS-Optimized Resumes in Minutes with the Power of AI.**

ResumeCraft AI is a modern, full-stack resume builder designed to help job seekers create professional, applicant-tracking-system (ATS) friendly resumes effortlessly. With intelligent AI writing assistance, real-time preview, and multiple premium templates, crafting the perfect resume has never been easier.

<div align="center">
  <img src="/public/favicon.png" alt="ResumeCraft AI Logo" width="100" />
</div>

## ✨ Features

-   **🤖 AI-Powered Writing:** Generate professional summaries, experience bullets, and skills using advanced AI models.
-   **🎨 Premium Templates:** Choose from a variety of professionally designed templates (Modern, Classic, Creative, Minimal).
-   **📄 Real-Time Preview:** See your changes instantly as you edit.
-   **🖨️ PDF Export:** Download high-quality, print-ready PDFs with perfect margins.
-   **🎯 ATS Optimization:** Built-in best practices to ensure your resume gets past automated filters.
-   **🔐 Secure Authentication:** User accounts to save and manage multiple resumes.
-   **📱 Responsive Design:** Works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

-   **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion
-   **Backend:** Node.js, Express
-   **Database:** PostgreSQL, Prisma ORM
-   **AI Integration:** GitHub Models
-   **PDF Generation:** React-to-Print, PDF-Parse

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   PostgreSQL

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/resume-craft-ai.git
    cd resume-craft-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    cd server && npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory with the following:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/resumecraft"
    GITHUB_TOKEN="your_github_token_for_ai"
    JWT_SECRET="your_jwt_secret"
    ```

4.  **Database Setup:**
    ```bash
    cd server
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the Application:**
    ```bash
    # Run both frontend and backend concurrently
    npm run dev
    ```

## 📸 Screenshots

*(Add screenshots of the editor, dashboard, and templates here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by ResumeCraft Team
