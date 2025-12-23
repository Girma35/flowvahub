# Rewards Dashboard Implementation

This repository contains the solution for the React Full-Stack Developer technical assessment. It recreates the Rewards page functionality of the platform using **React** and **Supabase**.

## 🚀 Live Demo
https://flowvah.netlify.app/#/


## 🛠 Tech Stack

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS
*   **Backend**: Supabase (PostgreSQL, Auth, RLS)
*   **State Management**: React Context API (for Auth & Theme) + Local State
*   **Icons**: FontAwesome

## ✨ Key Features

1.  **Authentication System**:
    *   Full Email and Password Sign Up & Login flows. using Supabase Auth
    *   Protected Routes implementation. using Supabase Auth
    *   Persistent session management using Supabase Auth.
2.  **Rewards Dashboard**:
    *   **User Stats**: Real-time tracking of points, streaks, and referrals.
    *   **Quests System**: List of available tasks with category filtering (Social/On-chain).
    *   **Redemption System**: Rewards catalog with status states (Available, Locked, Coming Soon).
    *   **Daily Check-in**: Interactive streak logic to encourage retention.
3.  **UI/UX**:
    *   **Dark/Light Mode**: Fully responsive theme switching with persisted preference.
    *   **Glassmorphism**: Premium UI aesthetic matching the brand identity.
    *   **Responsive**: Mobile-first design architecture.
    *   **Optimistic UI**: Instant feedback on user actions (like claiming quests) for perceived performance.

## 📦 Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd <repo-name>
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup (Supabase)**
    Run the SQL scripts provided in `supabase_schema.sql` (and `redeemables_schema.sql`) in your Supabase SQL Editor to set up:
    *   `profiles` table with triggers for new user creation.
    *   `rewards` (Quests) table.
    *   `redeemables` table.
    *   `user_quests` for tracking history.
    *   Row Level Security (RLS) policies for data protection.

5.  **Run Locally**
    ```bash
    npm run dev
    ```

## 🧠 Architecture & Trade-offs

*   **Supabase Direct vs API**: I chose to use the Supabase JS client directly in the frontend services layer. This reduces the need for a middleware backend layer for this scope, making the app faster and simpler while maintaining security via PostgreSQL RLS policies.
*   **State Management**: For an app of this size, I opted for React Context (`AuthContext`, `ThemeContext`) over Redux. It provides sufficient global state handling without unnecessary boilerplate.
*   **Styling**: Tailwind CSS was used to enforce consistency (padding, colors, typography) and handle Dark Mode complexity efficiently.
*   **Type Safety**: TypeScript interfaces are strictly defined in `types.ts` to ensure data integrity across the frontend-to-database boundary.

## 🧪 Submission Notes

*   **Mock Data**: The app is designed to handle "empty states" gracefully, but I have seeded the database with initial Quests and Rewards for demonstration purposes.
*   **Edge Cases**: Basic error handling (Modals) is implemented for network failures or insufficient points.

---
Completed by Girma Wakeyo
