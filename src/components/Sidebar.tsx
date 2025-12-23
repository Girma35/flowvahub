import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../context/ThemeContext';


const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', icon: 'fa-house', path: '/' },
    { label: 'Discovery', icon: 'fa-compass', path: '/discovery' },
    { label: 'Library', icon: 'fa-book-bookmark', path: '/library' },
    { label: 'Techstack', icon: 'fa-microchip', path: '/techstack' },
    { label: 'Subscription', icon: 'fa-gem', path: '/subscription' },
    { label: 'Settings', icon: 'fa-gear', path: '/settings' },
  ];

  return (
    <>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black/90 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 z-50 flex justify-around p-3 transition-colors duration-300">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 ${location.pathname === item.path ? 'text-blue-400' : 'text-zinc-500'
              }`}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>


      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-black/40 backdrop-blur-xl border-r border-zinc-200 dark:border-zinc-800 h-screen sticky top-0 transition-colors duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3">

            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Flowva<span className="text-blue-500">Hub</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === item.path
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
            >
              <i className={`fa-solid ${item.icon} ${location.pathname === item.path ? 'text-blue-400' : 'group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
                }`}></i>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-4">


          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300">

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/20 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 transition-all duration-200"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                <span className="text-xs font-bold">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
