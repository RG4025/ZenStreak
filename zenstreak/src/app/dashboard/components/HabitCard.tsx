import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Request from "@/service/request";
import { toast } from "sonner";
import { FaFire, FaTrash, FaCheck, FaCalendarAlt, FaHourglassHalf } from "react-icons/fa";

interface Habit {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  isArchived: boolean;
  order: number;
}

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch logs for this habit
  const { data: logsResponse, isLoading, isError } = useQuery<any>({
    queryKey: ["habit-logs", habit._id],
    queryFn: () => Request.get<any>(`/api/v1/habit-log/habit/${habit._id}`),
  });

  const logs = logsResponse?.data || [];

  // Map completed logs for YYYY-MM-DD lookup
  const completedDaysMap = React.useMemo(() => {
    const map = new Map<string, boolean>();
    logs.forEach((log: any) => {
      map.set(log.dateKey, log.completed);
    });
    return map;
  }, [logs]);

  // Mutation to toggle habit log
  const toggleMutation = useMutation({
    mutationFn: async (payload: { dateKey: string; completed: boolean }) => {
      return Request.post<any>("/api/v1/habit-log", {
        habitId: habit._id,
        dateKey: payload.dateKey,
        completed: payload.completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habit._id] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || "Failed to log habit.";
      toast.error(message);
    },
  });

  // Mutation to delete habit
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return Request.delete<any>(`/api/v1/habit/${habit._id}`);
    },
    onSuccess: () => {
      toast.success("Habit deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || "Failed to delete habit.";
      toast.error(message);
    },
  });

  // Calculate days of the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week index (0-6)

  const monthDays = React.useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const isFuture = dateStr > todayStr;
      days.push({
        dayNum: i,
        dateKey: dateStr,
        isFuture,
      });
    }
    return days;
  }, [year, month, daysInMonth]);

  const handleDayClick = (dateKey: string, isFuture: boolean) => {
    if (isFuture) {
      toast.warning("Cannot log habits for future dates.");
      return;
    }
    const isCompleted = !!completedDaysMap.get(dateKey);
    toggleMutation.mutate({ dateKey, completed: !isCompleted });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${habit.title}"? This will erase all its streaks and logs.`)) {
      deleteMutation.mutate();
    }
  };

  // Calculate current month's completion count and streak
  const monthCompletedCount = React.useMemo(() => {
    let count = 0;
    monthDays.forEach((day) => {
      if (completedDaysMap.get(day.dateKey)) {
        count++;
      }
    });
    return count;
  }, [monthDays, completedDaysMap]);

  // Calculate current consecutive streak based on sequential completed logs
  const currentStreak = React.useMemo(() => {
    let streak = 0;
    const today = new Date();
    const checkDate = new Date(today);

    // Look backward day by day starting from today
    for (let i = 0; i < 365; i++) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
      if (completedDaysMap.get(dateStr)) {
        streak++;
      } else {
        // Allow a streak to continue if today is not completed yet, check yesterday
        if (i === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  }, [completedDaysMap]);

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const weekDaysHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 shadow-sm transition-all hover:shadow-md backdrop-blur-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-4">
        <div className="space-y-1">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight">
            {habit.title}
          </h3>
          {habit.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 max-w-lg">
              {habit.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5 bg-orange-500/10 dark:bg-orange-500/5 px-2.5 py-1 rounded-full text-xs font-semibold text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <FaFire className="size-3.5 text-orange-500 animate-pulse" />
            <span>{currentStreak}d streak</span>
          </div>

          {/* Delete Action */}
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50"
            title="Delete Habit"
          >
            <FaTrash className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Month Selector / Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-xs text-zinc-650 dark:text-zinc-400">
          <FaCalendarAlt className="text-teal-500" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {monthName} {year}
          </span>
        </div>
        <div className="text-xs text-zinc-500">
          Completed: <span className="font-semibold text-teal-600 dark:text-teal-400">{monthCompletedCount}</span> / {daysInMonth} days
        </div>
      </div>

      {/* Calendar Grid Header */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
        {weekDaysHeaders.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid Days */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Placeholder cells for offset */}
        {Array.from({ length: firstDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square bg-transparent" />
        ))}

        {/* Days of month cells */}
        {monthDays.map((day) => {
          const isCompleted = !!completedDaysMap.get(day.dateKey);
          const isPending = toggleMutation.isPending && toggleMutation.variables?.dateKey === day.dateKey;

          return (
            <button
              key={day.dateKey}
              onClick={() => handleDayClick(day.dateKey, day.isFuture)}
              disabled={day.isFuture || toggleMutation.isPending}
              className={`aspect-square relative flex items-center justify-center rounded-lg text-xs font-semibold transition-all border outline-none select-none cursor-pointer ${
                day.isFuture
                  ? "bg-zinc-100/50 dark:bg-zinc-950/20 border-zinc-100 dark:border-zinc-900 text-zinc-350 dark:text-zinc-650 cursor-not-allowed"
                  : isCompleted
                  ? "bg-gradient-to-br from-teal-400 to-emerald-500 border-teal-500 text-white shadow-sm shadow-teal-500/25 scale-[1.02] hover:scale-[1.05]"
                  : "bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-450 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
              title={`${day.dateKey} - ${isCompleted ? "Completed" : "Uncompleted"}`}
            >
              {isPending ? (
                <FaHourglassHalf className="size-2.5 animate-spin text-teal-500" />
              ) : isCompleted ? (
                <span className="flex flex-col items-center">
                  <span className="text-[8px] opacity-75">{day.dayNum}</span>
                  <FaCheck className="size-2 text-white" />
                </span>
              ) : (
                <span>{day.dayNum}</span>
              )}
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
          <div className="h-5 w-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
