import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link className="text-sm font-medium text-slate-700 hover:text-slate-950" href="/sponsors">
            Sponsors
          </Link>
          <Link className="text-sm font-medium text-slate-700 hover:text-slate-950" href="/meetings">
            Meetings
          </Link>
          <Link className="text-sm font-medium text-slate-700 hover:text-slate-950" href="/projects">
            Projects
          </Link>
        </div>
        <SignOutButton />
      </nav>
    </header>
  );
}
