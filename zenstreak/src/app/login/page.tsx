"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaBolt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import Request from "@/service/request";
import { USER_ROUTES } from "@/lib/config";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      return Request.post<any>(`${USER_ROUTES}/login`, payload);
    },
    onSuccess: (response: any) => {
      const { user, accessToken } = response.data;
      login(user, accessToken);
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || "Invalid credentials.";
      setError(errMsg);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const email = (e.currentTarget.querySelector("#email") as HTMLInputElement).value;
    const password = (e.currentTarget.querySelector("#password") as HTMLInputElement).value;

    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-teal-500/30 selection:text-teal-900 dark:selection:text-teal-200 transition-colors duration-200">

      {/* Left Pane: Aesthetic Branding Area */}
      <div className="relative hidden md:flex md:w-1/2 flex-col justify-between p-12 overflow-hidden border-r border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-900 dark:bg-zinc-950">

        {/* Glows */}
        <div className="absolute top-[-10%] left-[-15%] h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

        {/* Small Dot Grid Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Header Branding */}
        <Link href="/" className="relative z-10 flex items-center gap-2 group cursor-pointer w-fit">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 shadow-md shadow-teal-500/10 transition-transform group-hover:scale-105">
            <FaBolt className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
            ZenStreak
          </span>
        </Link>

        {/* Center Inspiration Display */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/5 px-3.5 py-1 text-xs font-medium text-teal-400 backdrop-blur-sm">
            <HiSparkles className="size-3.5" />
            <span>Consistency flows from within</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-tight">
            Elevate your daily habits. <br />
            Maintain your mental peace.
          </h2>

          <p className="text-zinc-400 leading-relaxed text-base">
            Join thousands of active users logging their daily streaks and building long-term routines with our modern, non-stressful habit mapping dashboard.
          </p>

          {/* User Testimonial Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 backdrop-blur-md relative overflow-hidden group shadow-inner">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl" />
            <p className="text-sm italic text-zinc-300 relative z-10 leading-relaxed">
              "The ability to take a 'mindful pause' without losing my entire month's streak visual progress is an absolute game changer. It feels supportive rather than demanding."
            </p>
            <div className="mt-4 flex items-center gap-3 relative z-10">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                EL
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">Elena Rostova</p>
                <p className="text-[10px] text-zinc-500">UX Architect & Mindfulness Practitioner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-zinc-500">
          <span>&copy; {new Date().getFullYear()} ZenStreak Inc. All rights reserved.</span>
        </div>
      </div>

      {/* Right Pane: Auth Forms */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:w-1/2 bg-zinc-50 dark:bg-zinc-950 relative transition-colors duration-200">

        {/* Floating Theme Toggle in Right Panel */}
        <div className="absolute top-8 right-8 z-20">
          <ThemeToggle />
        </div>

        {/* Responsive top bar logo for mobile */}
        <div className="md:hidden absolute top-8 left-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600">
              <FaBolt className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">ZenStreak</span>
          </Link>
        </div>

        {/* Glow behind Form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-indigo-500/5 blur-[90px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/20 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/40">
            <CardHeader className="space-y-1.5 pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome back</CardTitle>
              <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                Enter your details below to sign in to your ZenStreak dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-xs rounded-lg border border-destructive/20 bg-destructive/10 text-destructive font-medium">
                  {error}
                </div>
              )}

              {/* Form Input fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="bg-white dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:border-teal-500/50 focus-visible:ring-teal-500/20 h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">Password</Label>
                    <a href="#" className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="bg-white dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:border-teal-500/50 focus-visible:ring-teal-500/20 pr-10 h-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-350 transition-colors"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="size-4" />
                      ) : (
                        <FaEye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-9 bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-400 hover:to-emerald-400 transition-all font-semibold shadow-md shadow-teal-500/10 cursor-pointer"
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In with Email"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>

              {/* Social Login buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => { }}
                  className="bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 h-9 flex gap-2 cursor-pointer"
                >
                  <FaGoogle className="size-4" />
                  <span>Google</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { }}
                  className="bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 h-9 flex gap-2 cursor-pointer"
                >
                  <FaGithub className="size-4" />
                  <span>GitHub</span>
                </Button>
              </div>

              {/* Sign up toggle footer */}
              <p className="text-center text-xs text-zinc-500 pt-4">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-350 font-semibold hover:underline">
                  Sign up for free
                </Link>
              </p>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
