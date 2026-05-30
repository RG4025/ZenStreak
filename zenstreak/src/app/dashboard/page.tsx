"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { FaBolt, FaSignOutAlt, FaFire, FaCheck, FaPlus, FaCalendarAlt, FaAward, FaHeartbeat } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

// Mock Fetching API for TanStack Query
interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
  frequency: string;
  category: string;
}

const fetchHabits = async (): Promise<Habit[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [
    { id: "1", name: "Mindful Meditation", completed: true, streak: 12, frequency: "Daily", category: "Mindfulness" },
    { id: "2", name: "Read 10 Pages", completed: false, streak: 8, frequency: "Daily", category: "Learning" },
    { id: "3", name: "Hydrate 3L Water", completed: true, streak: 5, frequency: "Daily", category: "Health" },
    { id: "4", name: "Evening Reflection Walk", completed: false, streak: 19, frequency: "Daily", category: "Fitness" }
  ];
};

export default function DashboardPage() {
  const router = useRouter();
  const [localHabits, setLocalHabits] = React.useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = React.useState("");
  const [newHabitCategory, setNewHabitCategory] = React.useState("Mindfulness");

  // TanStack Query to load habits
  const { data, isLoading, isError } = useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: fetchHabits,
  });

  // Sync TanStack Query data with local state for interactive toggling
  React.useEffect(() => {
    if (data) {
      setLocalHabits(data);
    }
  }, [data]);

  // Handle Toggle Completion
  const toggleHabit = (id: string) => {
    setLocalHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completed;
          return {
            ...h,
            completed: nextCompleted,
            streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      })
    );
  };

  // Handle Add Habit
  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      completed: false,
      streak: 0,
      frequency: "Daily",
      category: newHabitCategory,
    };

    setLocalHabits((prev) => [newHabit, ...prev]);
    setNewHabitName("");
  };

  // Handle Logout
  const handleLogout = () => {
    router.push("/");
  };

  // Calculations for stats
  const totalHabits = localHabits.length;
  const completedToday = localHabits.filter((h) => h.completed).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const highestStreak = totalHabits > 0 ? Math.max(...localHabits.map((h) => h.streak)) : 0;

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-200">

      {/* Dashboard Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 shadow-md shadow-teal-500/10">
              <FaBolt className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              ZenStreak
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                U
              </div>
              <span className="text-sm font-medium hidden sm:inline text-zinc-700 dark:text-zinc-300">
                user@user.com
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 cursor-pointer flex gap-1.5"
            >
              <FaSignOutAlt className="size-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">

        {/* Top welcome banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <HiSparkles />
              <span>Flow state active</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Welcome back, User!
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Focus on one step at a time. Here is your mindfulness overview for today.
            </p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800/80 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 shrink-0 flex items-center gap-2 border border-zinc-200/50 dark:border-zinc-700/50">
            <FaCalendarAlt className="text-indigo-500" />
            <span>Today: {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Active Habits</span>
              <FaBolt className="text-teal-500 size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{isLoading ? "..." : totalHabits}</div>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">Currently tracked routines</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Completion Rate</span>
              <FaCheck className="text-emerald-550 dark:text-emerald-400 size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{isLoading ? "..." : `${completionRate}%`}</div>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">
                {isLoading ? "..." : `${completedToday} of ${totalHabits} completed`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Highest Streak</span>
              <FaFire className="text-orange-500 size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{isLoading ? "..." : `${highestStreak} days`}</div>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">Max consistency streak</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Zen Level</span>
              <FaHeartbeat className="text-indigo-500 size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">{isLoading ? "..." : "Master"}</div>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">Mindfulness index active</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Section: Add Habit & Habits List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left side: Add Habit form */}
          <div className="lg:col-span-1">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white">Create New Habit</CardTitle>
                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  Add custom routines to ZenStreak tracking logs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addHabit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-655 dark:text-zinc-400">Habit Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Read for 15 mins"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none text-zinc-900 dark:text-zinc-250 placeholder:text-zinc-400 focus:border-teal-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-655 dark:text-zinc-400">Category</label>
                    <select
                      value={newHabitCategory}
                      onChange={(e) => setNewHabitCategory(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none text-zinc-900 dark:text-zinc-250 focus:border-teal-500/50 cursor-pointer"
                    >
                      <option value="Mindfulness">Mindfulness</option>
                      <option value="Learning">Learning</option>
                      <option value="Health">Health</option>
                      <option value="Fitness">Fitness</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold h-9 shadow-md shadow-teal-500/10 cursor-pointer flex gap-2"
                  >
                    <FaPlus className="size-3" />
                    <span>Add Routine</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right side: Habits List display */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <span>Your Daily Routines</span>
              {isLoading && <span className="text-xs font-medium text-zinc-400 animate-pulse">(Loading...)</span>}
            </h3>

            {/* TanStack Query Loading Skeleton */}
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 w-full rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 animate-pulse flex items-center justify-between px-4">
                    <div className="space-y-2 flex-grow max-w-xs">
                      <div className="h-4 bg-zinc-250 dark:bg-zinc-850 rounded w-2/3" />
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-900 rounded w-1/3" />
                    </div>
                    <div className="h-7 w-20 bg-zinc-200 dark:bg-zinc-900 rounded-lg" />
                  </div>
                ))}
              </div>
            )}

            {/* Error display */}
            {isError && (
              <div className="p-4 border border-destructive/20 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
                Failed to load habits. Please try reloading the dashboard.
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && totalHabits === 0 && (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <p className="text-zinc-550 dark:text-zinc-450 text-sm">No habits created yet. Add one to get started!</p>
              </div>
            )}

            {/* Habits Cards grid */}
            <div className="space-y-3">
              {localHabits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`group relative rounded-xl border p-4 flex items-center justify-between cursor-pointer transition-all duration-200 hover:scale-[1.005] select-none ${habit.completed
                      ? "border-emerald-500/20 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]"
                      : "border-zinc-200 dark:border-zinc-850 bg-white hover:bg-zinc-100/50 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/30"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Toggle circle indicator */}
                    <div
                      className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${habit.completed
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-105"
                          : "border-zinc-300 dark:border-zinc-700 bg-transparent text-transparent group-hover:border-zinc-400 dark:group-hover:border-zinc-650"
                        }`}
                    >
                      <FaCheck className="size-2.5" />
                    </div>

                    <div className="space-y-1">
                      <p
                        className={`text-sm font-semibold transition-all ${habit.completed
                            ? "line-through text-zinc-450 dark:text-zinc-500"
                            : "text-zinc-850 dark:text-zinc-200"
                          }`}
                      >
                        {habit.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                          {habit.category}
                        </span>
                        <span className="text-[10px] text-zinc-450 dark:text-zinc-500">
                          {habit.frequency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Streak tag display */}
                  <div className="flex items-center gap-1.5 bg-zinc-100/70 dark:bg-zinc-800/50 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-750">
                    <FaFire className={`size-3.5 transition-colors ${habit.completed ? "text-orange-500" : "text-zinc-400"}`} />
                    <span>{habit.streak}d streak</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
