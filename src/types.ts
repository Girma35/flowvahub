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
  category: 'Social' | 'Activity' | 'Special' | 'On-chain';
  status: QuestStatus;
  actionLabel: string;
}

export interface UserStats {
  totalPoints: number;
  rank: number;
  referrals: number;
  streak: number;
  lastCheckIn?: string;
  fullName?: string;
  avatarUrl?: string;
}

export type RewardStatus = 'available' | 'unlocked' | 'locked' | 'coming';

export interface Redeemable {
  id: string;
  title: string;
  description: string;
  cost: number;
  img: string;
  color: string;
  status: RewardStatus;
}


export type AuthMode = 'signup' | 'signin';

export interface UserData {
  name?: string;
  email: string;
  password?: string;
}

export interface GeminiResponse {
  greeting: string;
  tip: string;
}
