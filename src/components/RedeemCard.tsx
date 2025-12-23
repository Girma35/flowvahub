import React from 'react';
import { Redeemable } from '../types';
import Button from './ui/Button';

interface RedeemCardProps {
    reward: Redeemable;
    onRedeem?: (id: string) => void;
}

const RedeemCard: React.FC<RedeemCardProps> = ({ reward, onRedeem }) => {
    const isUnlocked = reward.status === 'unlocked';
    const isComingSoon = reward.status === 'coming';
    const isLocked = reward.status === 'locked';

    return (
        <div className={`bg-white dark:bg-black/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl group hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 ${isComingSoon ? 'opacity-70' : ''}`}>
            <div className={`w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative`}>
                <i className={`${reward.img} ${reward.color} text-3xl`}></i>
                {isLocked && (
                    <div className="absolute -top-2 -right-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                        <i className="fa-solid fa-lock text-[10px] text-zinc-400 dark:text-zinc-500"></i>
                    </div>
                )}
            </div>

            <h4 className="font-bold text-xl mb-2 text-zinc-900 dark:text-white">{reward.title}</h4>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">{reward.description}</p>

            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-500 mb-6 font-bold text-sm">
                <i className="fa-solid fa-coins text-yellow-500 text-xs"></i>
                {isComingSoon ? '???' : reward.cost.toLocaleString()} Points
            </div>

            <Button
                disabled={!isUnlocked}
                onClick={() => onRedeem?.(reward.id)}
                className="w-full"
                variant={isUnlocked ? 'primary' : 'secondary'}
            >
                {isComingSoon ? 'Coming Soon' : (isUnlocked ? 'Redeem Now' : 'Locked')}
            </Button>
        </div>
    );
};

export default RedeemCard;
