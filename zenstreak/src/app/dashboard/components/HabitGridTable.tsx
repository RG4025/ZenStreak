import * as React from "react";
import { HabitRow, Habit } from "./HabitRow";
import { FaCalendarAlt } from "react-icons/fa";

interface HabitGridTableProps {
  habits: Habit[];
}

export function HabitGridTable({ habits }: HabitGridTableProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = today.toLocaleString("default", { month: "long" });

  const todayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const monthDays = React.useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      return {
        dayNum,
        dateKey,
        isFuture: dateKey > todayStr,
        isToday: dateKey === todayStr,
      };
    });
  }, [year, month, daysInMonth, todayStr]);

  // Abbreviations for day of week under each column number
  const dayOfWeekAbbr = React.useMemo(() => {
    const abbrs = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return monthDays.map((d) => abbrs[new Date(d.dateKey).getDay()]);
  }, [monthDays]);

  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-700/40 bg-white/60 dark:bg-zinc-900/30 shadow-lg shadow-black/5 dark:shadow-black/30 backdrop-blur-xl overflow-hidden">
      {/* Grid header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
          <FaCalendarAlt className="text-teal-500 size-4" />
          <span>{monthName} {year}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-gradient-to-br from-teal-400 to-emerald-500" />
            Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950" />
            Pending
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded border border-teal-400 bg-teal-50 dark:bg-teal-950/20" />
            Today
          </span>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            {/* Sticky habit name column */}
            <col style={{ width: "220px", minWidth: "220px" }} />
            {/* Day columns */}
            {monthDays.map((d) => (
              <col key={d.dateKey} style={{ width: "36px", minWidth: "36px" }} />
            ))}
          </colgroup>

          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              {/* Sticky header for habit name column */}
              <th className="sticky left-0 z-20 border-r border-white/20 dark:border-white/10 px-4 py-3 text-left bg-white/70 dark:bg-zinc-950/55 backdrop-blur-2xl">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Habit</span>
                </div>
              </th>
              {/* Day number headers */}
              {monthDays.map((d, i) => (
                <th
                  key={d.dateKey}
                  className={`px-0.5 py-2 text-center ${d.isToday
                    ? "bg-teal-50/80 dark:bg-teal-950/30"
                    : d.isFuture
                      ? "bg-transparent"
                      : ""
                    }`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={`text-[10px] font-medium leading-none ${d.isToday
                        ? "text-teal-600 dark:text-teal-400"
                        : d.isFuture
                          ? "text-zinc-300 dark:text-zinc-700"
                          : "text-zinc-400 dark:text-zinc-500"
                        }`}
                    >
                      {dayOfWeekAbbr[i]}
                    </span>
                    <span
                      className={`text-xs font-bold leading-none ${d.isToday
                        ? "text-teal-600 dark:text-teal-400"
                        : d.isFuture
                          ? "text-zinc-300 dark:text-zinc-700"
                          : "text-zinc-700 dark:text-zinc-300"
                        }`}
                    >
                      {d.dayNum}
                    </span>
                    {d.isToday && (
                      <span className="block h-1 w-1 rounded-full bg-teal-500 mt-0.5" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {habits.map((habit) => (
              <HabitRow key={habit._id} habit={habit} monthDays={monthDays} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
