import { UserStats } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  stats: UserStats;
}

const Header: React.FC<HeaderProps> = ({ stats }) => {
  const { user } = useAuth();
  const displayName = stats.fullName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = stats.avatarUrl || user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`;

  return (
    <header className="sticky top-0 z-40 w-full glass bg-white/80 dark:bg-black/50 border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-8 py-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold md:text-xl">Rewards Hub</h2>
        <p className="text-xs text-zinc-500">Earn points, unlock rewards, and celebrate your progress!</p>
      </div>

      <div className="flex items-center gap-4">

        <div className="hidden sm:flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-2xl transition-colors duration-300">
          <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <i className="fa-solid fa-coins text-yellow-500 text-xs"></i>
          </div>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{stats.totalPoints.toLocaleString()}</span>
        </div>


        <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{displayName}</p>
          </div>
          <div className="relative group">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5 cursor-pointer overflow-hidden bg-zinc-800">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full rounded-full object-cover shadow-inner"
              />
            </div>
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-950 rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
