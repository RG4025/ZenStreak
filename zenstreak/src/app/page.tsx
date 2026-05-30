import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { FaBolt, FaCheck, FaFire } from "react-icons/fa";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-teal-500/30 selection:text-teal-900 dark:selection:text-teal-200 transition-colors duration-200">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-teal-500/5 dark:bg-teal-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] pointer-events-none" />
      
      {/* Decorative Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-zinc-400, rgb(161 161 170 / 0.3)) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header / Navigation */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 py-6 flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-transparent backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* ZenStreak Logo Symbol */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 shadow-lg shadow-teal-500/20">
            <FaBolt className="h-5 w-5 text-white" />
            <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-tr from-teal-400 to-indigo-500 opacity-30 blur-sm" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
            ZenStreak
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" passHref>
            <Button variant="ghost" size="sm" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
              Sign In
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button size="sm" className="bg-zinc-900 dark:bg-white text-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md shadow-zinc-900/10 dark:shadow-white/10 cursor-pointer">
              Get Started
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-32 flex flex-col items-center justify-center text-center">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 dark:border-teal-500/30 bg-teal-500/5 px-4 py-1.5 text-xs font-medium text-teal-700 dark:text-teal-400 backdrop-blur-md mb-8 animate-fade-in shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <span className="flex h-2 w-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse" />
          <span>Introducing ZenStreak 1.0</span>
        </div>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-b from-zinc-900 via-zinc-850 to-zinc-500 dark:from-white dark:via-zinc-100 dark:to-zinc-500 bg-clip-text text-transparent leading-[1.1] mb-6">
          Master Consistency. <br />
          <span className="bg-gradient-to-r from-teal-500 via-emerald-400 to-indigo-500 dark:from-teal-400 dark:via-emerald-300 dark:to-indigo-400 bg-clip-text text-transparent">
            Find Your Flow State.
          </span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-12">
          ZenStreak helps you build habits with mindfulness. Log your daily routines, track your streaks visually, and cultivate mental balance with elegant charts and analytics.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mb-20">
          <Link href="/signup" className="flex-1">
            <Button size="lg" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-450 hover:to-emerald-450 transition-all hover:scale-[1.02] shadow-lg shadow-teal-500/20 border-0 cursor-pointer">
              Start Free Trial
            </Button>
          </Link>
          <Link href="/login" className="flex-1">
            <Button size="lg" variant="outline" className="w-full h-12 text-base font-semibold border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all hover:scale-[1.02] cursor-pointer">
              Watch Demo
            </Button>
          </Link>
        </div>

        {/* Feature Preview Showcase Card */}
        <div className="relative w-full max-w-5xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-1 backdrop-blur-xl shadow-2xl">
          <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-b from-zinc-200 dark:from-zinc-700/50 to-zinc-100 dark:to-zinc-900/20 opacity-40" />
          <div className="overflow-hidden rounded-[14px] bg-white dark:bg-zinc-950 p-6 sm:p-12 text-left flex flex-col md:flex-row items-center gap-12">
            
            {/* Mockup Left */}
            <div className="flex-1 space-y-6">
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                Track habits without the pressure.
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Most habit trackers induce anxiety when you break a streak. ZenStreak features "Flowing Streaks" - rewarding mindful efforts and offering customizable recovery days to support real-life fluctuations.
              </p>
              
              <ul className="space-y-3.5 text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-3">
                  <FaCheck className="h-4 w-4 text-teal-500 dark:text-teal-400 shrink-0" />
                  <span>Interactive beautiful heatmaps and logs</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheck className="h-4 w-4 text-teal-500 dark:text-teal-400 shrink-0" />
                  <span>Mindful check-ins and reflection logs</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaCheck className="h-4 w-4 text-teal-500 dark:text-teal-400 shrink-0" />
                  <span>Seamless dark mode & custom dashboards</span>
                </li>
              </ul>
            </div>

            {/* Mockup Right - Visual illustration representing a premium UI layout */}
            <div className="flex-1 w-full max-w-sm bg-zinc-50 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800/80 p-6 shadow-md dark:shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">Mindful Meditation</h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">Daily • 20 mins</p>
                </div>
                <span className="inline-flex items-center gap-1.5 justify-center px-2 py-1 text-xs font-bold leading-none text-teal-700 dark:text-teal-100 bg-teal-500/10 rounded-full dark:text-teal-400 border border-teal-500/20">
                  <FaFire className="text-orange-500 animate-pulse" /> 12 Day Streak
                </span>
              </div>

              {/* Fake Habit Grid Mock */}
              <div className="grid grid-cols-7 gap-2.5 mb-6">
                {Array.from({ length: 28 }).map((_, i) => {
                  let bgClass = "bg-zinc-200/70 dark:bg-zinc-800/50 hover:bg-zinc-300 dark:hover:bg-zinc-800";
                  if ([2, 3, 4, 8, 9, 10, 11, 15, 16, 17, 18, 22, 23, 24, 25, 26].includes(i)) {
                    bgClass = "bg-teal-500 text-white shadow-md shadow-teal-500/10 hover:bg-teal-400";
                  } else if ([5, 12, 19].includes(i)) {
                    bgClass = "bg-indigo-500 text-white shadow-md shadow-indigo-500/10 hover:bg-indigo-400";
                  }
                  return (
                    <div
                      key={i}
                      className={`aspect-square w-full rounded-md transition-all cursor-pointer ${bgClass}`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-900 pt-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-teal-500" /> Perfect Day
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" /> Mindful Pause
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md py-8 text-center text-sm text-zinc-500 dark:text-zinc-500 transition-colors duration-200">
        <p>&copy; {new Date().getFullYear()} ZenStreak. Designed for modern mindfulness.</p>
      </footer>
    </div>
  );
}
