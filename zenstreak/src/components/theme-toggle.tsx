"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by rendering nothing until mounted
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className="w-8 h-8 rounded-lg border border-zinc-800 text-zinc-500 opacity-0"
        aria-label="Toggle Theme"
      />
    );
  }

  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <FaSun className="size-4 text-amber-400 transition-all" />
      ) : (
        <FaMoon className="size-4 text-indigo-500 transition-all" />
      )}
    </Button>
  );
}
