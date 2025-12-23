import React, { useState, useEffect } from 'react';
import RewardCard from '../components/RewardCard';
import RedeemCard from '../components/RedeemCard';
import ReferralSection from '../components/ui/ReferralSection';
import StatsGrid from '../components/ui/StatsGrid';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { UserStats, Quest, QuestStatus, Redeemable } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { fetchQuestsWithStatus, completeQuest, performDailyCheckIn, fetchRedeemableRewards, fetchUserStats, redeemReward } from '../services/rewardsService';

interface DashboardProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}


const Dashboard: React.FC<DashboardProps> = ({ stats, setStats }) => {
  const { user } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [redeemables, setRedeemables] = useState<Redeemable[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'quests' | 'rewards'>('quests');
  const [activeQuestCategory, setActiveQuestCategory] = useState<'All' | 'Social' | 'On-chain'>('All');
  const [rewardFilter, setRewardFilter] = useState<'all' | 'unlocked' | 'locked' | 'coming'>('all');
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'confirm' | 'alert' | 'success' | 'error';
    onConfirm?: () => void;
    confirmLabel?: string;
    icon?: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'confirm'
  });

  useEffect(() => {

    async function loadData() {
      if (user) {
        try {
          const [questData, rewardData, userStats] = await Promise.all([
            fetchQuestsWithStatus(user.id),
            fetchRedeemableRewards(),
            fetchUserStats(user.id)
          ]);

          setQuests(questData);
          setRedeemables(rewardData);
          setStats(userStats);


          if (userStats?.lastCheckIn) {
            const lastDate = new Date(userStats.lastCheckIn).toDateString();
            const today = new Date().toDateString();
            if (lastDate === today) {
              setHasClaimedToday(true);
            }
          }
        } catch (error: any) {
          console.error("Error fetching dashboard data:", error);
          setModalConfig({
            isOpen: true,
            title: 'Data Load Error',
            description: `Could not load your profile data.\nDetailed Error: ${error.message || JSON.stringify(error)}`,
            type: 'error',
            confirmLabel: 'Retry',
            onConfirm: () => { window.location.reload(); }
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleQuestAction = async (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (!quest || !user) return;

    try {

      setQuests(prev => prev.map(q => q.id === id ? { ...q, status: QuestStatus.COMPLETED } : q));

      const result = await completeQuest(user.id, id, quest.reward);

      setStats(prev => ({
        ...prev,
        totalPoints: result.newPoints
      }));
    } catch (error) {
      console.error("Failed to complete quest:", error);

      setQuests(prev => prev.map(q => q.id === id ? { ...q, status: QuestStatus.AVAILABLE } : q));
    }
  };


  const handleClaimStreak = async () => {
    if (!hasClaimedToday && user) {
      const claimBtn = document.activeElement as HTMLButtonElement;
      if (claimBtn) claimBtn.disabled = true;

      try {
        const result = await performDailyCheckIn(user.id);
        if (result.success) {
          setStats(prev => ({
            ...prev,
            streak: result.new_streak,
            totalPoints: result.total_points
          }));
          setHasClaimedToday(true);

          setModalConfig({
            isOpen: true,
            title: 'Streak Claimed!',
            description: `You've kept your streak alive for ${result.new_streak} days and claimed ${result.points_earned} points!`,
            type: 'success',
            confirmLabel: 'Awesome',
            icon: 'fa-fire'
          });
        } else {
          setModalConfig({
            isOpen: true,
            title: 'Claim Failed',
            description: result.message || "Could not claim daily reward.",
            type: 'error',
            confirmLabel: 'Close'
          });
          if (result.message.includes('Already')) setHasClaimedToday(true);
        }
      } catch (error: any) {
        console.error("Error claiming streak:", error);
        setModalConfig({
          isOpen: true,
          title: 'Error',
          description: error.message || "An unexpected error occurred while claiming your reward.",
          type: 'error',
          confirmLabel: 'Close'
        });
      } finally {
        if (claimBtn) claimBtn.disabled = false;
      }
    }
  };

  const handleRedeem = async (rewardId: string) => {
    const reward = redeemables.find(r => r.id === rewardId);
    if (!reward || !user) return;

    if (stats.totalPoints < reward.cost) {
      setModalConfig({
        isOpen: true,
        title: 'Insufficient Points',
        description: `You need ${reward.cost.toLocaleString()} points to redeem this reward. Keep completing quests to earn more!`,
        type: 'alert',
        confirmLabel: 'Got it'
      });
      return;
    }

    setModalConfig({
      isOpen: true,
      title: 'Confirm Redemption',
      description: `Are you sure you want to redeem ${reward.title} for ${reward.cost.toLocaleString()} points?`,
      type: 'confirm',
      confirmLabel: 'Redeem Now',
      icon: reward.img,
      onConfirm: async () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        try {
          const result = await redeemReward(user.id, rewardId, reward.cost);
          if (result.success) {
            setStats(prev => ({
              ...prev,
              totalPoints: result.newPoints
            }));
            setModalConfig({
              isOpen: true,
              title: 'Success!',
              description: `You have successfully redeemed ${reward.title}. The reward details have been sent to your email.`,
              type: 'success',
              confirmLabel: 'Great!',
              icon: 'fa-gift'
            });
          }
        } catch (error: any) {
          console.error("Redemption error:", error);
          setModalConfig({
            isOpen: true,
            title: 'Redemption Failed',
            description: error.message || "Something went wrong during the transaction. Please try again later.",
            type: 'error',
            confirmLabel: 'Close'
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">


      <section className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 glass bg-white dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] -z-10"></div>

        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Earn Points <br />
            <span className="text-gradient">Redeem Glory</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md text-sm md:text-base leading-relaxed">
            Participate in daily quests, engage with our ecosystem, and invite friends to climb the leaderboard and unlock exclusive rewards.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <Button
              onClick={() => setActiveTab('quests')}
              isActive={activeTab === 'quests'}
            >
              Available Quests
            </Button>
            <Button
              onClick={() => setActiveTab('rewards')}
              isActive={activeTab === 'rewards'}
            >
              Redeem Rewards
            </Button>
          </div>



        </div>
        <StatsGrid stats={stats} />
      </section>



      {activeTab === 'quests' ? (
        <section className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black">Available Quests</h3>
            <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              {['All', 'Social', 'On-chain'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveQuestCategory(cat as any)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeQuestCategory === cat
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests
              .filter(q => activeQuestCategory === 'All' || q.category === activeQuestCategory)
              .map(quest => (
                <RewardCard
                  key={quest.id}
                  quest={quest}
                  onAction={handleQuestAction}
                />
              ))}
          </div>
        </section>
      ) : (
        <section className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black">Redeem Rewards</h3>
              <p className="text-sm text-zinc-500">Use your hard-earned points to unlock exclusive perks</p>
            </div>
            <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 self-start">
              {[
                { id: 'all', label: 'All Rewards' },
                { id: 'unlocked', label: 'Unlocked' },
                { id: 'locked', label: 'Locked' },
                { id: 'coming', label: 'Coming Soon' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRewardFilter(tab.id as any)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${rewardFilter === tab.id
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {redeemables
              .map(r => ({
                ...r,
                status: r.status === 'coming' ? 'coming' as const : (stats.totalPoints >= r.cost ? 'unlocked' as const : 'locked' as const)
              }))
              .filter(reward => {
                if (rewardFilter === 'all') return reward.status !== 'coming' || rewardFilter === 'all';
                if (rewardFilter === 'coming') return reward.status === 'coming';
                return reward.status === rewardFilter;
              })
              .map((reward) => (
                <RedeemCard
                  key={reward.id}
                  reward={reward}
                  onRedeem={handleRedeem}
                />
              ))}
          </div>
        </section>
      )}


      <section className="bg-white dark:bg-black/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 transition-colors duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Daily Streak Reward</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-500">Come back daily to increase your multiplier</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-zinc-500 block">CURRENT MULTIPLIER</span>
            <span className="text-2xl font-black text-blue-400">1.5x</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 sm:gap-4">
          {Array.from({ length: 7 }, (_, i) => {
            const windowStart = Math.max(1, stats.streak - 5);
            return windowStart + i;
          }).map((day) => (
            <div key={day} className="flex flex-col items-center gap-3">
              <div className={`w-full aspect-square rounded-2xl flex items-center justify-center border transition-all duration-300 ${day <= stats.streak
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-600 dark:text-blue-400 shadow-inner'
                : day === stats.streak + 1
                  ? 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 animate-pulse'
                  : 'bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-700'
                }`}>
                {day <= stats.streak ? (
                  <i className="fa-solid fa-check text-xl"></i>
                ) : (
                  <i className="fa-solid fa-lock text-sm"></i>
                )}
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-bold ${day <= stats.streak ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-600'}`}>DAY {day}</p>
                <p className={`text-[10px] font-bold ${day <= stats.streak ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-600'}`}>+{100 * day} pts</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleClaimStreak}
            disabled={hasClaimedToday}
            variant={hasClaimedToday ? 'secondary' : 'primary'}
            className="w-full md:w-auto min-w-[200px]"
          >
            {hasClaimedToday ? (
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check"></i>
                Today's Reward Claimed
              </span>
            ) : (
              `Claim Day ${stats.streak + 1} Reward`
            )}
          </Button>
        </div>
      </section>


      <section className="bg-white dark:bg-black/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-zinc-900 dark:text-white">Recent Activity</h4>
          <button className="text-xs font-bold text-blue-500 dark:text-blue-400 hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { action: 'Follow on X', date: '2 mins ago', points: '+500', icon: 'fa-brands fa-x-twitter' },
            { action: 'Daily Check-in', date: '4 hours ago', points: '+250', icon: 'fa-solid fa-calendar-day' },
            { action: 'Referral Bonus (user_99)', date: '1 day ago', points: '+1,200', icon: 'fa-solid fa-users' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  <i className={`fa-solid ${activity.icon} text-zinc-500 dark:text-zinc-400`}></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{activity.action}</p>
                  <p className="text-[10px] text-zinc-500">{activity.date}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-500">{activity.points}</span>
            </div>
          ))}
        </div>
      </section >

      <ReferralSection
        referralLink="flowvahub.com/r/alex42"
        title="Share Your Link"
        description="Invite friends and earn 25 points when they join!"
        referrals={stats.referrals}
        pointsEarned={stats.referrals * 25}
      />

      <Modal
        {...modalConfig}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      />

    </div >
  );
};

export default Dashboard;
