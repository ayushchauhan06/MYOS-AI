"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, GitFork } from "lucide-react";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(_data: SignupForm) {
    await new Promise((r) => setTimeout(r, 800));
    router.push("/");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-200 opacity-20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-violet-200 opacity-20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="gradient-border relative z-10 w-full max-w-md p-8"
        style={{ boxShadow: "0 24px 80px rgba(37, 99, 235, 0.12), 0 8px 32px rgba(0,0,0,0.08)" }}
      >
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Start for free</h1>
          <p className="text-sm text-[var(--text-muted)]">Join 2,400+ freelancers using MYOS AI</p>
        </div>

        <div className="mb-6 space-y-3">
          <button onClick={() => router.push("/")} className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition-all hover:bg-[var(--surface)] hover:shadow-md">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </button>
          <button onClick={() => router.push("/")} className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[#0D1117] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1a2232] hover:shadow-md">
            <GitFork className="h-5 w-5" />
            Sign up with GitHub
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[var(--text-muted)]">or with email</span></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { field: "name", label: "Full Name", placeholder: "Alex Chen", type: "text" },
            { field: "email", label: "Email", placeholder: "alex@example.com", type: "email" },
            { field: "password", label: "Password", placeholder: "••••••••", type: "password" },
          ].map(({ field, label, placeholder, type }) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">{label}</label>
              <input
                {...register(field as keyof SignupForm)}
                type={type}
                placeholder={placeholder}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all placeholder:text-[var(--text-muted)]"
              />
              {errors[field as keyof SignupForm] && (
                <p className="text-xs text-red-500">{errors[field as keyof SignupForm]?.message}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create Free Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--accent-blue)] hover:underline">Sign in</Link>
        </p>
        <p className="mt-3 text-center text-[11px] text-[var(--text-muted)]">
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
