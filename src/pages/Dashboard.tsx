
import React, { useState } from 'react';
import RewardCard from '../components/RewardCard';
import { UserStats, Quest, QuestStatus } from '../types';

interface DashboardProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

const INITIAL_QUESTS: Quest[] = [
  {
    id: '1',
    title: 'Follow us on X',
    description: 'Follow our official X (Twitter) account for the latest updates.',
    reward: 500,
    icon: 'fa-brands fa-x-twitter',
    category: 'Social',
    status: QuestStatus.AVAILABLE,
    actionLabel: 'Follow @FlowvaHub'
  },
  {
    id: '2',
    title: 'Join Discord Community',
    description: 'Become part of our growing community and unlock secret channels.',
    reward: 1000,
    icon: 'fa-brands fa-discord',
    category: 'Social',
    status: QuestStatus.AVAILABLE,
    actionLabel: 'Join Server'
  },
  {
    id: '3',
    title: 'Daily Check-in',
    description: 'Launch the hub every day to keep your streak alive.',
    reward: 250,
    icon: 'fa-solid fa-calendar-check',
    category: 'Activity',
    status: QuestStatus.AVAILABLE,
    actionLabel: 'Check-in Now'
  },
  {
    id: '4',
    title: 'Complete 10 Swaps',
    description: 'Execute at least 10 token swaps using the Flowva Exchange.',
    reward: 5000,
    icon: 'fa-solid fa-rotate',
    category: 'Activity',
    status: QuestStatus.IN_PROGRESS,
    actionLabel: 'Go to Exchange'
  },
  {
    id: '5',
    title: 'Refer 3 Friends',
    description: 'Invite 3 people using your unique referral link.',
    reward: 7500,
    icon: 'fa-solid fa-user-plus',
    category: 'Special',
    status: QuestStatus.AVAILABLE,
    actionLabel: 'Copy Link'
  },
  {
    id: '6',
    title: 'Stake for 30 Days',
    description: 'Stake a minimum of 100 tokens for one month.',
    reward: 15000,
    icon: 'fa-solid fa-vault',
    category: 'Activity',
    status: QuestStatus.AVAILABLE,
    actionLabel: 'Start Staking'
  }
];

const Dashboard: React.FC<DashboardProps> = ({ stats, setStats }) => {
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [isCopying, setIsCopying] = useState(false);

  const handleQuestAction = (id: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id) {
        // Mock completion
        setStats(s => ({ ...s, totalPoints: s.totalPoints + q.reward }));
        return { ...q, status: QuestStatus.COMPLETED };
      }
      return q;
    }));
  };

  const handleCopyLink = () => {
    setIsCopying(true);
    navigator.clipboard.writeText('https://flowvahub.com/r/alex42');
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Banner / Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 glass border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] -z-10"></div>
        
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Earn Points <br />
            <span className="text-gradient">Redeem Glory</span>
          </h1>
          <p className="text-zinc-400 max-w-md text-sm md:text-base leading-relaxed">
            Participate in daily quests, engage with our ecosystem, and invite friends to climb the leaderboard and unlock exclusive rewards.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <button className="accent-gradient px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
              Explore Quests
            </button>
            <button className="bg-zinc-800/50 hover:bg-zinc-800 px-8 py-3 rounded-2xl font-bold border border-zinc-700 transition-all">
              View Leaderboard
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 text-center space-y-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">STREAK</p>
            <p className="text-3xl font-black text-blue-400">{stats.streak}d</p>
            <p className="text-[10px] text-zinc-500">Don't break it!</p>
          </div>
          <div className="bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 text-center space-y-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">RANK</p>
            <p className="text-3xl font-black text-purple-400">#{stats.rank}</p>
            <p className="text-[10px] text-zinc-500">Top 5%</p>
          </div>
          <div className="col-span-2 bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">TOTAL EARNED</p>
            <div className="flex items-center justify-center gap-2">
               <i className="fa-solid fa-coins text-yellow-500"></i>
               <p className="text-2xl font-black">{stats.totalPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-gift text-blue-400 text-3xl"></i>
        </div>
        <div className="flex-1 space-y-1 text-center md:text-left">
          <h3 className="text-xl font-bold">Invite Friends & Get 10%</h3>
          <p className="text-zinc-400 text-sm">Earn 10% of all points your friends earn. Unlimited rewards!</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2 bg-zinc-950/50 p-2 rounded-2xl border border-zinc-800">
          <code className="px-3 text-blue-400 font-mono text-sm">flowvahub.com/r/alex42</code>
          <button 
            onClick={handleCopyLink}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
              isCopying ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            {isCopying ? <i className="fa-solid fa-check"></i> : 'Copy Link'}
          </button>
        </div>
      </section>

      {/* Quests Tabs & Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black">Available Quests</h3>
          <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
             <button className="px-4 py-1.5 rounded-lg text-sm font-bold bg-zinc-800 text-white">All</button>
             <button className="px-4 py-1.5 rounded-lg text-sm font-bold text-zinc-500 hover:text-white transition-colors">Social</button>
             <button className="px-4 py-1.5 rounded-lg text-sm font-bold text-zinc-500 hover:text-white transition-colors">On-chain</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map(quest => (
            <RewardCard 
              key={quest.id} 
              quest={quest} 
              onAction={handleQuestAction} 
            />
          ))}
        </div>
      </section>

      {/* Daily Reward Tracker */}
      <section className="glass rounded-[2rem] p-8 border border-zinc-800">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold">Daily Streak Reward</h3>
            <p className="text-sm text-zinc-500">Come back daily to increase your multiplier</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-zinc-500 block">CURRENT MULTIPLIER</span>
            <span className="text-2xl font-black text-blue-400">1.5x</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div key={day} className="flex flex-col items-center gap-3">
              <div className={`w-full aspect-square rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                day <= stats.streak 
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 shadow-inner' 
                  : day === stats.streak + 1 
                    ? 'bg-zinc-800 border-zinc-700 animate-pulse' 
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-700'
              }`}>
                {day <= stats.streak ? (
                  <i className="fa-solid fa-check text-xl"></i>
                ) : (
                  <i className="fa-solid fa-lock text-sm"></i>
                )}
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-bold ${day <= stats.streak ? 'text-zinc-100' : 'text-zinc-600'}`}>DAY {day}</p>
                <p className={`text-[10px] font-bold ${day <= stats.streak ? 'text-blue-400' : 'text-zinc-600'}`}>+{100 * day} pts</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity Footer */}
      <section className="glass border border-zinc-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold">Recent Activity</h4>
          <button className="text-xs font-bold text-blue-400 hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { action: 'Follow on X', date: '2 mins ago', points: '+500', icon: 'fa-brands fa-x-twitter' },
            { action: 'Daily Check-in', date: '4 hours ago', points: '+250', icon: 'fa-solid fa-calendar-day' },
            { action: 'Referral Bonus (user_99)', date: '1 day ago', points: '+1,200', icon: 'fa-solid fa-users' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <i className={`fa-solid ${activity.icon} text-zinc-400`}></i>
                </div>
                <div>
                  <p className="text-sm font-bold">{activity.action}</p>
                  <p className="text-[10px] text-zinc-500">{activity.date}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-500">{activity.points}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
