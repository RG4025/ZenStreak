import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import Request from "@/service/request";
import { USER_ROUTES } from "@/lib/config";
import { ThemeToggle } from "@/components/theme-toggle";
import { HabitCard } from "./HabitCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { FaBolt, FaSignOutAlt, FaPlus, FaCalendarAlt, FaChartPie, FaAward, FaSlidersH, FaHeartbeat } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { HabitGridTable } from "./HabitGridTable";

interface Habit {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  isArchived: boolean;
  order: number;
}

export function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useUserStore();

  const [newTitle, setNewTitle] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");

  // Route Guard
  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Fetch Habits
  const { data: habitsResponse, isLoading, isError, error } = useQuery<any>({
    queryKey: ["habits"],
    queryFn: () => Request.get<any>("/api/v1/habit"),
  });

  const habitsList: Habit[] = habitsResponse?.data || [];

  // Create Habit Mutation
  const createHabitMutation = useMutation({
    mutationFn: async (payload: { title: string; description: string }) => {
      return Request.post<any>("/api/v1/habit", payload);
    },
    onSuccess: () => {
      toast.success("New habit created successfully!");
      setNewTitle("");
      setNewDescription("");
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || "Failed to create habit.";
      toast.error(message);
    },
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Habit title is required");
      return;
    }
    createHabitMutation.mutate({
      title: newTitle.trim(),
      description: newDescription.trim(),
    });
  };

  const handleLogout = async () => {
    try {
      await Request.post(`${USER_ROUTES}/logout`);
    } catch (e) {
      console.error("Logout API request failed", e);
    }
    logout();
    router.push("/login");
  };

  const totalHabits = habitsList.length;

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-6 w-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-200">
      {/* Header */}
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
                {user.fullName ? user.fullName[0].toUpperCase() : "U"}
              </div>
              <span className="text-sm font-medium hidden sm:inline text-zinc-700 dark:text-zinc-300">
                {user.email}
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

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">

        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <HiSparkles />
              <span>Mindful Flow Active</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Welcome back, {user.fullName}!
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Build tiny habits. Protect your mental peace. Track your monthly grids below.
            </p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-850 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-650 dark:text-zinc-300 shrink-0 flex items-center gap-2 border border-zinc-200/50 dark:border-zinc-800">
            <FaCalendarAlt className="text-indigo-500" />
            <span>Today: {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 shadow-sm backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Active Habits</span>
              <FaBolt className="text-teal-500 size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {isLoading ? "..." : totalHabits}
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Currently being logged daily</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 shadow-sm backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Grid Visualizer</span>
              <FaChartPie className="text-emerald-500 size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">Monthly</div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Interactive month-based day squares</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 shadow-sm backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Mental Level</span>
              <FaHeartbeat className="text-indigo-500 size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">Zen Master</div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Focused, consistent, and balanced</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Create Habit card form (better UI) */}
          <div className="lg:col-span-1">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 shadow-sm sticky top-28 backdrop-blur-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-white">Create New Habit</CardTitle>
                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  Build habits that fit into your daily mindfulness routing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateHabit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Habit Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Evening walk, Meditate 10m"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      disabled={createHabitMutation.isPending}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-850 bg-white/60 dark:bg-zinc-950/60 px-3 py-2 text-sm outline-none text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-650 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
                    <textarea
                      placeholder="e.g. Keep a relaxed state and reflect on my day"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      disabled={createHabitMutation.isPending}
                      rows={3}
                      maxLength={300}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-855 bg-white/60 dark:bg-zinc-950/60 px-3 py-2 text-sm outline-none text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-655 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 transition-all resize-none"
                    />
                    <p className="text-[10px] text-zinc-450 dark:text-zinc-500 text-right">
                      {newDescription.length}/300 chars
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={createHabitMutation.isPending}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold h-9 shadow-md shadow-teal-500/10 cursor-pointer flex gap-2 transition-all justify-center items-center"
                  >
                    {createHabitMutation.isPending ? (
                      <div className="h-4.5 w-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FaPlus className="size-3" />
                        <span>Add Habit</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Grid Layout structure for Habits (Monthly display) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <span>Routines & Calendar Log</span>
              {isLoading && <span className="text-xs font-normal text-zinc-400 animate-pulse">(Loading habits...)</span>}
            </h2>

            {/* Error fallback */}
            {isError && (
              <div className="p-4 border border-destructive/20 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
                Error loading habits: {error?.message || "Please refresh the page."}
              </div>
            )}

            {/* Loading skeletons */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-72 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 animate-pulse p-5 space-y-4">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-900 rounded w-1/3" />
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-1/2" />
                    <div className="grid grid-cols-7 gap-2 pt-4">
                      {Array.from({ length: 28 }).map((_, d) => (
                        <div key={d} className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && totalHabits === 0 && (
              <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/30 dark:bg-zinc-950/10">
                <p className="text-zinc-500 dark:text-zinc-450 text-sm">No active habits. Create one on the left to start logging!</p>
              </div>
            )}

            {/* Habits Grid Display */}
            <div className="grid grid-cols-1 gap-6">
              {/* {habitsList.map((habit) => (
                <HabitCard key={habit._id} habit={habit} />
              ))} */}
              <HabitGridTable habits={habitsList} />
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
