"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SponsorOption = { id: string; company_name: string };
type Meeting = {
  id: string;
  sponsor_id: string | null;
  title: string;
  meeting_date: string | null;
  notes: string | null;
  sponsors: { company_name: string } | null;
};

type MeetingForm = { sponsor_id: string; title: string; meeting_date: string; notes: string };

const INITIAL_FORM: MeetingForm = { sponsor_id: "", title: "", meeting_date: "", notes: "" };

export default function MeetingsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [sponsors, setSponsors] = useState<SponsorOption[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [form, setForm] = useState<MeetingForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: sponsorsData, error: sponsorError }, { data: meetingsData, error: meetingsError }] =
        await Promise.all([
          supabase.from("sponsors").select("id, company_name").order("company_name"),
          supabase
            .from("meetings")
            .select("id, sponsor_id, title, meeting_date, notes, sponsors(company_name)")
            .order("created_at", { ascending: false }),
        ]);

      if (sponsorError || meetingsError) {
        console.error("Load meetings page error:", sponsorError ?? meetingsError);
        setError("Unable to load meetings data.");
      } else {
        setSponsors((sponsorsData ?? []) as SponsorOption[]);
        setMeetings((meetingsData ?? []) as Meeting[]);
      }
      setLoading(false);
    };
    void load();
  }, [supabase]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const title = form.title.trim();
    const notes = form.notes.trim().replace(/<[^>]*>/g, "");

    if (!title) return setError("Title is required.");
    if (title.length > 200) return setError("Title must be 200 characters or fewer.");
    if (notes.length > 2000) return setError("Notes must be 2000 characters or fewer.");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      if (userError) console.error("Get user error:", userError);
      return setError("Please sign in again.");
    }

    const { data, error: insertError } = await supabase
      .from("meetings")
      .insert({
        user_id: user.id,
        sponsor_id: form.sponsor_id || null,
        title,
        meeting_date: form.meeting_date || null,
        notes: notes || null,
      })
      .select("id, sponsor_id, title, meeting_date, notes, sponsors(company_name)")
      .single();

    if (insertError) {
      console.error("Create meeting error:", insertError);
      return setError("Unable to create meeting.");
    }

    if (data) {
      setMeetings((prev) => [data as Meeting, ...prev]);
      setForm(INITIAL_FORM);
    }
  };

  return (
    <section className="w-full space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Meetings</h1>

      <form className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4" onSubmit={submit}>
        <select
          value={form.sponsor_id}
          onChange={(e) => setForm((prev) => ({ ...prev, sponsor_id: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Select sponsor (optional)</option>
          {sponsors.map((sponsor) => (
            <option key={sponsor.id} value={sponsor.id}>
              {sponsor.company_name}
            </option>
          ))}
        </select>
        <input
          placeholder="Title (required)"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={form.meeting_date}
          onChange={(e) => setForm((prev) => ({ ...prev, meeting_date: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          className="min-h-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}
        <button className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700" type="submit">
          Create Meeting
        </button>
      </form>

      <div className="space-y-2">
        {loading ? (
          <p className="text-sm text-slate-600">Loading meetings...</p>
        ) : (
          meetings.map((meeting) => (
            <article key={meeting.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="font-medium text-slate-900">{meeting.title}</h2>
              <p className="text-sm text-slate-600">
                Sponsor: {meeting.sponsors?.company_name ?? "N/A"} | Date: {meeting.meeting_date ?? "N/A"}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
