
import React from 'react';
import { Quest, QuestStatus } from '../types';

interface RewardCardProps {
  quest: Quest;
  onAction: (id: string) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ quest, onAction }) => {
  const isCompleted = quest.status === QuestStatus.COMPLETED || quest.status === QuestStatus.CLAIMED;

  return (
    <div className={`group relative p-5 rounded-3xl transition-all duration-300 ${
      isCompleted ? 'bg-zinc-900/40 border border-zinc-800/50 grayscale opacity-60' : 'glass border border-zinc-800 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5'
    }`}>
      <div className="flex gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
          isCompleted ? 'bg-zinc-800 text-zinc-500' : 'bg-blue-500/10 text-blue-400'
        }`}>
          <i className={`fa-solid ${quest.icon} text-2xl`}></i>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
              quest.category === 'Social' ? 'bg-blue-500/10 text-blue-400' : 
              quest.category === 'Activity' ? 'bg-purple-500/10 text-purple-400' : 'bg-pink-500/10 text-pink-400'
            }`}>
              {quest.category}
            </span>
            <div className="flex items-center gap-1.5 font-bold text-sm text-yellow-500">
              <i className="fa-solid fa-coins text-xs"></i>
              +{quest.reward}
            </div>
          </div>
          
          <h3 className="font-bold text-lg mb-1 truncate">{quest.title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">{quest.description}</p>

          <button
            onClick={() => onAction(quest.id)}
            disabled={isCompleted}
            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              isCompleted 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'accent-gradient text-white shadow-lg shadow-blue-500/20 active:scale-95'
            }`}
          >
            {isCompleted ? 'Completed' : quest.actionLabel}
          </button>
        </div>
      </div>

      {isCompleted && (
        <div className="absolute top-4 right-4 text-green-500">
          <i className="fa-solid fa-circle-check text-xl"></i>
        </div>
      )}
    </div>
  );
};

export default RewardCard;
