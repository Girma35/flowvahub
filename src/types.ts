
export enum QuestStatus {
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CLAIMED = 'CLAIMED'
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
  category: 'Social' | 'Activity' | 'Special';
  status: QuestStatus;
  actionLabel: string;
}

export interface UserStats {
  totalPoints: number;
  rank: number;
  referrals: number;
  streak: number;
}
