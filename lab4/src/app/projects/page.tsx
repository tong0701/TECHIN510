"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SponsorOption = { id: string; company_name: string };
type Project = {
  id: string;
  sponsor_id: string | null;
  title: string;
  description: string | null;
  status: string;
  sponsors: { company_name: string } | null;
};

type ProjectForm = { sponsor_id: string; title: string; description: string; status: string };

const INITIAL_FORM: ProjectForm = { sponsor_id: "", title: "", description: "", status: "New" };

export default function ProjectsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [sponsors, setSponsors] = useState<SponsorOption[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: sponsorsData, error: sponsorError }, { data: projectsData, error: projectsError }] =
        await Promise.all([
          supabase.from("sponsors").select("id, company_name").order("company_name"),
          supabase
            .from("project_ideas")
            .select("id, sponsor_id, title, description, status, sponsors(company_name)")
            .order("created_at", { ascending: false }),
        ]);

      if (sponsorError || projectsError) {
        console.error("Load projects page error:", sponsorError ?? projectsError);
        setError("Unable to load project ideas data.");
      } else {
        setSponsors((sponsorsData ?? []) as SponsorOption[]);
        setProjects((projectsData ?? []) as Project[]);
      }
      setLoading(false);
    };
    void load();
  }, [supabase]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const title = form.title.trim();
    const description = form.description.trim().replace(/<[^>]*>/g, "");

    if (!title) return setError("Title is required.");
    if (title.length > 200) return setError("Title must be 200 characters or fewer.");
    if (description.length > 2000) return setError("Description must be 2000 characters or fewer.");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      if (userError) console.error("Get user error:", userError);
      return setError("Please sign in again.");
    }

    const { data, error: insertError } = await supabase
      .from("project_ideas")
      .insert({
        user_id: user.id,
        sponsor_id: form.sponsor_id || null,
        title,
        description: description || null,
        status: form.status,
      })
      .select("id, sponsor_id, title, description, status, sponsors(company_name)")
      .single();

    if (insertError) {
      console.error("Create project idea error:", insertError);
      return setError("Unable to create project idea.");
    }

    if (data) {
      setProjects((prev) => [data as Project, ...prev]);
      setForm(INITIAL_FORM);
    }
  };

  return (
    <section className="w-full space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Project Ideas</h1>

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
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          className="min-h-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={form.status}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="New">New</option>
          <option value="Scoping">Scoping</option>
          <option value="Ready">Ready</option>
        </select>
        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}
        <button className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700" type="submit">
          Create Project Idea
        </button>
      </form>

      <div className="space-y-2">
        {loading ? (
          <p className="text-sm text-slate-600">Loading projects...</p>
        ) : (
          projects.map((project) => (
            <article key={project.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="font-medium text-slate-900">{project.title}</h2>
              <p className="text-sm text-slate-600">
                Sponsor: {project.sponsors?.company_name ?? "N/A"} | Status: {project.status}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
