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
    -- Consecutive day, just add 1. No cap.
    new_streak := profile_record.streak + 1;
  ELSE
    -- Streak broken (missed a day) or first time
    new_streak := 1;
  END IF;

  -- 4. Calculate Reward (Base 100 * streak, maybe capped at some point if needed, otherwise linear scaling)
  -- For now, linear scaling: Day 45 = 4500 points.
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
