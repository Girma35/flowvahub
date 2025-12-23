import React from 'react';
import { UserStats } from '../../types';

interface StatsGridProps {
    stats: UserStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
    return (
        <div className="flex-shrink-0 grid grid-cols-1 gap-4">
            <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center space-y-2 backdrop-blur-sm transition-colors duration-300">
                <p className="text-[10px] text-zinc-600 dark:text-zinc-500 uppercase tracking-widest font-bold">STREAK</p>
                <p className="text-3xl font-black text-blue-500 dark:text-blue-400">{stats.streak}d</p>
                <p className="text-[10px] text-zinc-500">Don't break it!</p>
            </div>
        </div>
    );
};

export default StatsGrid;
