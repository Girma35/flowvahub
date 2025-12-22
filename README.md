# Rewards Dashboard Starter

A modern SaaS-style rewards dashboard built with Vite, React, Tailwind CSS, and Supabase.

## Features
- Vite + React + Tailwind CSS setup
- Supabase client integration
- Modular services for rewards and user points
- High-fidelity RewardCard component (loading, empty, error states)
- Simple authentication context
- Modern, clean UI (Inter font, indigo/purple accents, rounded corners)

## Setup Instructions

### 1. Install dependencies
```sh
npm install
```

### 2. Environment Variables
Create a `.env` file in the project root with:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Start the development server
```sh
npm run dev
```

### 4. SQL Schema
Use the following SQL to create the required tables in your Supabase project:

```sql
-- Rewards table
create table rewards (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  points integer not null
);

-- Profiles table
create table profiles (
  id uuid primary key references auth.users(id),
  points integer not null default 0
);

-- (Optional) RPC for atomic point decrement
create or replace function decrement_points(user_id uuid, cost integer)
returns void as $$
begin
  update profiles set points = points - cost where id = user_id and points >= cost;
end;
$$ language plpgsql;
```

### 5. Assumptions
- 1:1 relationship between users and profiles (each user has one profile row).
- Rewards are static and fetched from the `rewards` table.
- User points are tracked in the `profiles` table.

---

**Jessie:** For Supabase dashboard setup, create the tables above and ensure your environment variables are set. The app will not function without a valid Supabase project.
"# flowvahub" 
