import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Welcome</h1>
      <p className="text-slate-600">
        This app tracks sponsors, meetings, and project ideas with Supabase.
      </p>
      <div className="flex gap-3">
        <Link className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700" href="/login">
          Login
        </Link>
        <Link className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" href="/sponsors">
          Go to Sponsors
        </Link>
      </div>
    </div>
  );
}
