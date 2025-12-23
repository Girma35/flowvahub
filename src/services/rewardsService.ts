import { supabase } from '../lib/supabase';
import { UserStats, Quest, QuestStatus, Redeemable } from '../types';

export async function fetchQuestsWithStatus(userId: string): Promise<Quest[]> {
    try {
        console.log('Fetching quests for user:', userId);
        const { data: quests, error: qError } = await supabase
            .from('rewards')
            .select('*')
            .order('created_at', { ascending: true });

        if (qError) {
            console.error('Error fetching quests:', qError);
            throw qError;
        }

        const { data: userQuests, error: uqError } = await supabase
            .from('user_quests')
            .select('quest_id, status')
            .eq('user_id', userId);

        if (uqError) {
            console.error('Error fetching user_quests:', uqError);

        }

        const statusMap = new Map((userQuests || []).map(uq => [uq.quest_id, uq.status]));

        const mappedQuests: Quest[] = (quests || []).map(item => ({
            id: item.id,
            title: item.title ?? 'Untitled Quest',
            description: item.description ?? '',
            reward: Number(item.reward_amount ?? 0),
            icon: item.icon ?? 'fa-solid fa-star',
            category: (item.category as any) ?? 'Social',
            status: (statusMap.get(item.id) as QuestStatus) || QuestStatus.AVAILABLE,
            actionLabel: item.action_label ?? 'Complete'
        }));

        return mappedQuests;
    } catch (error) {
        console.error('Failed to fetch quests:', error);
        return [];
    }
}


export async function fetchUserStats(userId: string): Promise<UserStats> {
    try {
        console.log('Fetching user stats for:', userId);

        const { data, error } = await supabase
            .from('profiles')
            .select('streak, total_points, referrals, full_name, avatar_url, updated_at')
            .eq('id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                const { data: { user } } = await supabase.auth.getUser();
                return {
                    totalPoints: 0,
                    streak: 0,
                    referrals: 0,
                    rank: 1,
                    fullName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
                    lastCheckIn: undefined
                };
            }

            throw new Error(`Supabase Error: ${error.message} (Code: ${error.code})`);
        }

        console.log('Fetched profile data:', data);

        return {
            totalPoints: Number(data.total_points ?? 0),
            streak: Number(data.streak ?? 0),
            referrals: Number(data.referrals ?? 0),
            rank: 1,
            lastCheckIn: data.updated_at,
            fullName: data.full_name,
            avatarUrl: data.avatar_url
        };
    } catch (err: any) {
        console.error('CRITICAL: Error fetching user stats:', err);
        throw err;
    }
}


export async function performDailyCheckIn(userId: string) {
    try {

        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('streak, total_points, updated_at')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;


        const lastActivity = profile.updated_at ? new Date(profile.updated_at) : new Date(0);
        const today = new Date();

        const isSameDay = (d1: Date, d2: Date) =>
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();

        if (isSameDay(lastActivity, today)) {
            return {
                success: false,
                message: `Already checked in today. Your streak is ${profile.streak}.`,
                streak: profile.streak
            };
        }



        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = isSameDay(lastActivity, yesterday);

        const newStreak = isConsecutive ? (profile.streak || 0) + 1 : 1;

        const pointsToAdd = 100 * newStreak;
        const newTotal = (profile.total_points || 0) + pointsToAdd;


        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                streak: newStreak,
                total_points: newTotal,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (updateError) throw updateError;

        return {
            success: true,
            points_earned: pointsToAdd,
            new_streak: newStreak,
            total_points: newTotal
        };

    } catch (error: any) {
        console.error('Daily check-in failed:', error);
        return {
            success: false,
            message: error.message || "Failed to update daily streak."
        };
    }
}


export async function completeQuest(userId: string, questId: string, rewardAmount: number) {
    const { error: questError } = await supabase
        .from('user_quests')
        .upsert({
            user_id: userId,
            quest_id: questId,
            status: 'COMPLETED',
            completed_at: new Date().toISOString()
        });

    if (questError) throw questError;

    if (questError) throw questError;

    const { data: currentStats, error: statsError } = await supabase
        .from('profiles')
        .select('total_points')
        .eq('id', userId)
        .single();

    if (statsError) throw statsError;

    const newPoints = (Number(currentStats?.total_points) || 0) + rewardAmount;

    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            total_points: newPoints
        })
        .eq('id', userId);

    if (updateError) throw updateError;

    return { success: true, newPoints };
}

export async function redeemReward(userId: string, rewardId: string, cost: number) {
    try {
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('total_points')
            .eq('id', userId)
            .single();

        if (fetchError) {
            console.error('Error fetching profile for redemption:', fetchError);
            throw new Error('Could not verify points. Please try again.');
        }

        const currentPoints = Number(profile?.total_points || 0);
        if (currentPoints < cost) {
            throw new Error(`Insufficient points. You need ${cost} points, but only have ${currentPoints}.`);
        }


        const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({
                total_points: currentPoints - cost
            })
            .eq('id', userId)
            .select('total_points')
            .single();

        if (updateError) {
            console.error('Error updating points during redemption:', updateError);
            throw new Error('Transaction failed. Your points were not deducted.');
        }

        return {
            success: true,
            newPoints: Number(updatedProfile?.total_points ?? (currentPoints - cost))
        };
    } catch (error: any) {
        console.error('Detailed Error in redeemReward:', error);
        throw error;
    }
}

export async function fetchRedeemableRewards(): Promise<Redeemable[]> {
    try {
        const { data, error } = await supabase
            .from('redeemables')
            .select('*')
            .order('cost', { ascending: true });

        if (error) {
            console.error('Error fetching redeemables:', error);
            throw error;
        }

        const mappedRedeemables: Redeemable[] = (data || []).map(item => ({
            id: item.id,
            title: item.title ?? 'Reward',
            description: item.description ?? '',
            cost: Number(item.cost ?? 0),
            img: item.icon ?? 'fa-solid fa-gift',
            color: item.color_class ?? 'text-white',
            status: item.status ?? 'available'
        }));

        return mappedRedeemables;
    } catch (error) {
        console.error('Failed to fetch redeemables:', error);
        return [];
    }
}
