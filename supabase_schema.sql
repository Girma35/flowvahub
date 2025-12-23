CREATE TABLE IF NOT EXISTS public.rewards (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  reward_amount integer NOT NULL,
  icon text,
  category text CHECK (category IN ('Social', 'Activity', 'Special')),
  status text DEFAULT 'AVAILABLE',
  action_label text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_quests (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id uuid REFERENCES public.rewards(id) ON DELETE CASCADE,
  status text DEFAULT 'IN_PROGRESS',
  completed_at timestamp with time zone,
  UNIQUE(user_id, quest_id)
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  avatar_url text,
  total_points bigint DEFAULT 0,
  referrals integer DEFAULT 0,
  streak integer DEFAULT 0,
  rank integer DEFAULT 0,
  last_check_in timestamp with time zone,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rewards" ON public.rewards FOR SELECT USING (true);

CREATE POLICY "Users can view own quest progress" ON public.user_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own quest progress" ON public.user_quests FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. Daily Check-in Logic
CREATE OR REPLACE FUNCTION handle_daily_check_in(user_id_param uuid)
RETURNS json AS $$
DECLARE
  profile_record RECORD;
  points_to_add integer;
  new_streak integer;
  last_check_date date;
  today date := current_date;
BEGIN
  -- 1. Get user profile
  SELECT * INTO profile_record FROM public.profiles WHERE id = user_id_param;
  
  -- If profile doesn't exist
  IF profile_record.id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Profile not found');
  END IF;

  -- Handle first time check-in
  IF profile_record.last_check_in IS NULL THEN
    last_check_date := '1970-01-01'::date;
  ELSE
    last_check_date := profile_record.last_check_in::date;
  END IF;

  -- 2. Check if already checked in today
  IF last_check_date = today THEN
    RETURN json_build_object('success', false, 'message', 'Already checked in today', 'streak', profile_record.streak);
  END IF;

  -- 3. Calculate new streak
  IF last_check_date = (today - 1) THEN
    -- Consecutive day
    new_streak := profile_record.streak + 1;
    -- Reset to 1 if they completed the full 7-day cycle (optional, based on fix_streak_feature.sql)
    IF new_streak > 7 THEN new_streak := 1; END IF;
  ELSE
    -- Streak broken (missed a day) or first time
    new_streak := 1;
  END IF;

  -- 4. Calculate Reward (100 * current streak day)
  points_to_add := 100 * new_streak;

  -- 5. Update Database
  UPDATE public.profiles
  SET 
    streak = new_streak,
    last_check_in = now(),
    total_points = total_points + points_to_add,
    updated_at = now()
  WHERE id = user_id_param;

  RETURN json_build_object(
    'success', true, 
    'points_earned', points_to_add, 
    'new_streak', new_streak,
    'total_points', profile_record.total_points + points_to_add
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Triggers for Profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

INSERT INTO public.rewards (title, description, reward_amount, icon, category, action_label)
VALUES 
('Follow us on X', 'Follow our official X (Twitter) account for the latest updates.', 500, 'fa-brands fa-x-twitter', 'Social', 'Follow @FlowvaHub'),
('Join Discord Community', 'Become part of our growing community and unlock secret channels.', 1000, 'fa-brands fa-discord', 'Social', 'Join Server'),
('Daily Check-in', 'Launch the hub every day to keep your streak alive.', 250, 'fa-solid fa-calendar-check', 'Activity', 'Check-in Now');
