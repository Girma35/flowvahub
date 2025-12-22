import { supabase } from '../supabaseClient';

export async function fetchRewards() {
  const { data, error } = await supabase.from('rewards').select('*');
  if (error) throw error;
  return data;
}

export async function fetchUserPoints(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data?.points ?? 0;
}

export async function redeemReward(userId, rewardCost) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ points: supabase.rpc('decrement_points', { user_id: userId, cost: rewardCost }) })
    .eq('id', userId);
  if (error) throw error;
  return data;
}
