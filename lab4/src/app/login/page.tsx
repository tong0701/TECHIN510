"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

function mapAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) return "Wrong email or password.";
  if (lower.includes("user already registered")) return "This email is already registered.";
  if (lower.includes("email rate limit exceeded")) {
    return "Too many auth emails sent. Please wait a few minutes before trying Sign Up again.";
  }
  if (lower.includes("email not confirmed")) {
    return "Email not confirmed. Confirm the email first, or disable email confirmation in Supabase Auth settings for this lab.";
  }
  if (lower.includes("password")) return "Password must meet Supabase requirements.";
  return "Authentication failed. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      const result =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password: cleanPassword,
            })
          : await supabase.auth.signUp({
              email: cleanEmail,
              password: cleanPassword,
            });

      if (result.error) {
        console.error("Supabase auth error:", result.error);
        setErrorMessage(mapAuthError(result.error.message));
        return;
      }

      if (!result.data.session) {
        if (mode === "signup") {
          setErrorMessage(
            "Sign-up succeeded but no session was created. If email confirmation is enabled, confirm your email first or disable email confirmation in Supabase Auth settings."
          );
        } else {
          setErrorMessage("Login succeeded but no session was found. Please sign in again.");
        }
        return;
      }

      router.push("/sponsors");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
      <p className="mt-1 text-sm text-slate-600">
        Use email and password to access your workspace.
      </p>

      <div className="mt-4 flex rounded-md border border-slate-200 p-1">
        <button
          type="button"
          className={`flex-1 rounded px-3 py-2 text-sm ${
            mode === "signin"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          onClick={() => setMode("signin")}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`flex-1 rounded px-3 py-2 text-sm ${
            mode === "signup"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          onClick={() => setMode("signup")}
        >
          Sign Up
        </button>
      </div>

      <form className="mt-4 space-y-3" onSubmit={submit}>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </label>

        {errorMessage ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </section>
  );
}
