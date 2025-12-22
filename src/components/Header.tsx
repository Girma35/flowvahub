
import React from 'react';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
}

const Header: React.FC<HeaderProps> = ({ stats }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-zinc-800 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold md:text-xl">Rewards Hub</h2>
        <p className="text-xs text-zinc-500">Earn points, unlock rewards, and celebrate your progress!</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Points Display */}
        <div className="hidden sm:flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl">
          <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <i className="fa-solid fa-coins text-yellow-500 text-xs"></i>
          </div>
          <span className="font-bold">{stats.totalPoints.toLocaleString()}</span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold">Alex Rivera</p>
            <p className="text-[10px] text-zinc-500">Rank #42</p>
          </div>
          <div className="relative group">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5 cursor-pointer">
              <img
                src="https://picsum.photos/seed/alex/100/100"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-950 rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
