import React, { useState } from 'react';
import Button from './Button';

interface ReferralSectionProps {
    referralLink?: string;
    title?: string;
    description?: string;
    referrals?: number;
    pointsEarned?: number;
}

const ReferralSection: React.FC<ReferralSectionProps> = ({
    referralLink = 'flowvahub.com/r/alex42',
    title = 'Invite Friends & Get 10%',
    description = 'Earn 10% of all points your friends earn. Unlimited rewards!',
    referrals = 0,
    pointsEarned = 0
}) => {
    const [isCopying, setIsCopying] = useState(false);

    const handleCopyLink = () => {
        setIsCopying(true);
        navigator.clipboard.writeText(referralLink);
        setTimeout(() => setIsCopying(false), 2000);
    };

    return (
        <div className="space-y-4">
            <section className="bg-white dark:bg-blue-600/10 border border-zinc-200 dark:border-blue-500/20 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 backdrop-blur-sm transition-colors duration-300">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-gift text-blue-400 text-3xl"></i>
                </div>

                <div className="flex-1 space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">{title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{description}</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Stats Badges */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="flex-1 md:flex-none bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl text-center min-w-[100px] transition-colors duration-300">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Referrals</p>
                            <p className="text-lg font-black text-zinc-900 dark:text-white">{referrals}</p>
                        </div>
                        <div className="flex-1 md:flex-none bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl text-center min-w-[100px] transition-colors duration-300">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Pts Earned</p>
                            <div className="flex items-center justify-center gap-1">
                                <i className="fa-solid fa-coins text-yellow-500 text-[10px]"></i>
                                <p className="text-lg font-black text-zinc-900 dark:text-white">{pointsEarned.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Copy Link Area */}
                    <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950/50 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full md:w-auto transition-colors duration-300">
                        <code className="px-3 text-blue-600 dark:text-blue-400 font-mono text-sm truncate max-w-[150px]">{referralLink}</code>
                        <Button
                            onClick={handleCopyLink}
                            className="px-6 py-2 rounded-xl text-sm whitespace-nowrap"
                            variant={isCopying ? 'success' : 'primary'}
                        >
                            {isCopying ? <i className="fa-solid fa-check"></i> : 'Copy Link'}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ReferralSection;
