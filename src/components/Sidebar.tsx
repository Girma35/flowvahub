
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
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
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-zinc-800 z-50 flex justify-around p-3">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 ${
              location.pathname === item.path ? 'text-blue-400' : 'text-zinc-500'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-zinc-800 h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i className="fa-solid fa-layer-group text-white text-xl"></i>
            </div>
            <span className="text-xl font-extrabold tracking-tight">Flowva<span className="text-blue-500">Hub</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === item.path
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
            >
              <i className={`fa-solid ${item.icon} ${
                location.pathname === item.path ? 'text-blue-400' : 'group-hover:text-zinc-100'
              }`}></i>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
            <p className="text-xs text-zinc-500 mb-2 font-medium">TIER STATUS</p>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">Platinum Elite</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">PRO</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full accent-gradient" style={{ width: '75%' }}></div>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">2,500 pts until next tier</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
