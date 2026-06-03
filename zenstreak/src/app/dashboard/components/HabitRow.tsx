import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Request from "@/service/request";
import { toast } from "sonner";
import { FaFire, FaTrash } from "react-icons/fa";
import { HiCheckCircle } from "react-icons/hi";

export interface Habit {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  isArchived: boolean;
  order: number;
}

interface HabitRowProps {
  habit: Habit;
  monthDays: { dayNum: number; dateKey: string; isFuture: boolean; isToday: boolean }[];
}

export function HabitRow({ habit, monthDays }: HabitRowProps) {
  const queryClient = useQueryClient();

  // Fetch logs for this habit for the current month
  const firstDay = monthDays[0]?.dateKey;
  const lastDay = monthDays[monthDays.length - 1]?.dateKey;

  const { data: logsResponse, isLoading } = useQuery<any>({
    queryKey: ["habit-logs", habit._id],
    queryFn: () =>
      Request.get<any>(
        `/api/v1/habit-log/habit/${habit._id}?startDateKey=${firstDay}&endDateKey=${lastDay}`
      ),
    enabled: !!firstDay && !!lastDay,
  });

  const logs = logsResponse?.data || [];

  // Build a map of dateKey -> completed
  const completedMap = React.useMemo(() => {
    const m = new Map<string, boolean>();
    logs.forEach((log: any) => m.set(log.dateKey, Boolean(log.completed)));
    return m;
  }, [logs]);

  // Toggle mutation
  const toggleMutation = useMutation({
    mutationFn: (payload: { dateKey: string; completed: boolean }) =>
      Request.post<any>("/api/v1/habit-log", {
        habitId: habit._id,
        dateKey: payload.dateKey,
        completed: payload.completed,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habit._id] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update log.");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => Request.delete<any>(`/api/v1/habit/${habit._id}`),
    onSuccess: () => {
      toast.success(`"${habit.title}" deleted.`);
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete habit.");
    },
  });

  const handleDayClick = (dateKey: string, isFuture: boolean) => {
    if (isFuture) return;
    if (toggleMutation.isPending) return;
    const current = completedMap.get(dateKey) ?? false;
    toggleMutation.mutate({ dateKey, completed: !current });
  };

  // Calculate streak
  const streak = React.useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (completedMap.get(key)) {
        count++;
      } else if (i === 0) {
        // today might not be logged yet — skip and check yesterday
        continue;
      } else {
        break;
      }
    }
    return count;
  }, [completedMap]);

  const pendingKey = toggleMutation.isPending
    ? (toggleMutation.variables as any)?.dateKey
    : null;

  return (
    <tr className="group border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/60 dark:hover:bg-zinc-900/20 transition-colors">
      {/* Sticky habit info cell */}
      <td className="sticky left-0 z-10 bg-white dark:bg-zinc-950 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/90 transition-colors border-r border-zinc-200 dark:border-zinc-800 px-4 py-3 min-w-[220px] max-w-[220px] backdrop-blur-3xl">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate leading-tight">
              {habit.title}
            </p>
            {habit.description && (
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5 leading-tight">
                {habit.description}
              </p>
            )}
            {/* Streak badge */}
            <div className="flex items-center gap-1 mt-1.5">
              <FaFire className="size-2.5 text-orange-400 shrink-0" />
              <span className="text-[10px] font-bold text-orange-500 dark:text-orange-400">
                {streak}d streak
              </span>
            </div>
          </div>
          {/* Delete button */}
          <button
            onClick={() => {
              if (confirm(`Delete "${habit.title}" and all its logs?`)) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="shrink-0 p-1.5 rounded-lg text-zinc-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-40"
            title="Delete habit"
          >
            <FaTrash className="size-3" />
          </button>
        </div>
      </td>

      {/* Per-day toggle cells */}
      {monthDays.map((day) => {
        const isCompleted = completedMap.get(day.dateKey) ?? false;
        const isPending = pendingKey === day.dateKey;

        return (
          <td
            key={day.dateKey}
            className={`p-0.5 text-center align-middle ${day.isFuture ? "cursor-not-allowed" : "cursor-pointer"}`}
            title={`${day.dateKey}${isCompleted ? " ✔ Completed" : ""}`}
            onClick={() => handleDayClick(day.dateKey, day.isFuture)}
          >
            {isLoading ? (
              <div className="mx-auto h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            ) : (
              <div
                className={`mx-auto h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-150 border ${day.isFuture
                  ? "bg-transparent border-zinc-100 dark:border-zinc-900"
                  : isPending
                    ? "bg-teal-200 dark:bg-teal-900/50 border-teal-300 dark:border-teal-700 animate-pulse"
                    : isCompleted
                      ? "bg-gradient-to-br from-teal-400 to-emerald-500 border-transparent shadow-sm shadow-teal-500/20"
                      : day.isToday
                        ? "border-teal-400 dark:border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 hover:bg-teal-100 dark:hover:bg-teal-900/30"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/30"
                  }`}
              >
                {isCompleted && !isPending && (
                  <HiCheckCircle className="size-4 text-white" />
                )}
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
}
