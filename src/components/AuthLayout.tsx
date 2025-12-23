import React from 'react';


interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row relative overflow-hidden transition-colors duration-300">

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full filter blur-[120px] -z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full filter blur-[150px] -z-0"></div>


      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-12 flex items-center gap-3 group cursor-pointer">

            <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Flowva</span>
          </div>

          <div className="space-y-2 mb-10">
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white leading-tight">{title}</h1>
            <p className="text-zinc-600 dark:text-zinc-500 text-lg">{subtitle}</p>
          </div>

          <div className="bg-white dark:bg-black/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10"></div>
            {children}
          </div>

          <footer className="mt-12 text-center text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} Flowva Hub Inc. All rights reserved.
          </footer>
        </div>
      </div>


      <div className="hidden md:flex w-1/2 relative items-center justify-center p-12 overflow-hidden">
        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-white dark:bg-black/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 p-10 rounded-[3rem] shadow-2xl space-y-8 transition-colors duration-300">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Community Favorite
            </div>

            <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight">
              One link, <br />
              <span className="text-blue-600 dark:text-blue-500">Unlimited Rewards.</span>
            </h2>

            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
              Join a ecosystem designed for creators and explorers. Earn points, unlock exclusive badges, and climb the global leaderboards.
            </p>

            <div className="flex items-center gap-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-12 h-12 rounded-2xl border-4 border-white dark:border-zinc-950 object-cover"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 42}`}
                    alt="user"
                  />
                ))}
              </div>
              <div>
                <p className="text-zinc-900 dark:text-white font-bold">12,482 Users</p>
                <p className="text-zinc-500 text-sm">Joined this week</p>
              </div>
            </div>
          </div>
        </div>


        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default AuthLayout;
