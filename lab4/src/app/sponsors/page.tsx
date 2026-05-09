"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Sponsor = {
  id: string;
  user_id: string;
  company_name: string;
  industry: string | null;
  contact_name: string | null;
  contact_email: string | null;
  notes: string | null;
  created_at: string;
};

type SponsorForm = {
  company_name: string;
  industry: string;
  contact_name: string;
  contact_email: string;
  notes: string;
};

const INITIAL_FORM: SponsorForm = {
  company_name: "",
  industry: "",
  contact_name: "",
  contact_email: "",
  notes: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toFriendlyMessage(message: string) {
  if (message.toLowerCase().includes("row-level security")) {
    return "You do not have permission to perform this action.";
  }
  return "Something went wrong. Please try again.";
}

function sanitizeForm(input: SponsorForm): SponsorForm {
  return {
    company_name: input.company_name.trim(),
    industry: input.industry.trim(),
    contact_name: input.contact_name.trim(),
    contact_email: input.contact_email.trim(),
    notes: input.notes.trim().replace(/<[^>]*>/g, ""),
  };
}

function validateForm(input: SponsorForm) {
  if (!input.company_name) return "Company name cannot be empty.";
  if (input.company_name.length > 200) return "Company name must be 200 characters or fewer.";
  if (input.notes.length > 2000) return "Notes must be 2000 characters or fewer.";
  if (input.contact_email && !EMAIL_PATTERN.test(input.contact_email)) {
    return "Please enter a valid email.";
  }
  return "";
}

export default function SponsorsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Sponsor[]>([]);
  const [form, setForm] = useState<SponsorForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const loadSponsors = async () => {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("sponsors")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Fetch sponsors error:", fetchError);
        setError(toFriendlyMessage(fetchError.message));
      } else {
        setItems((data ?? []) as Sponsor[]);
      }

      setLoading(false);
    };

    void loadSponsors();
  }, [supabase]);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const clean = sanitizeForm(form);
      const validationError = validateForm(clean);
      if (validationError) {
        setError(validationError);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        if (userError) console.error("Get user error:", userError);
        setError("Please sign in again.");
        return;
      }

      if (editingId) {
        const { data, error: updateError } = await supabase
          .from("sponsors")
          .update({
            company_name: clean.company_name,
            industry: clean.industry || null,
            contact_name: clean.contact_name || null,
            contact_email: clean.contact_email || null,
            notes: clean.notes || null,
          })
          .eq("id", editingId)
          .select("*")
          .single();

        if (updateError) {
          console.error("Update sponsor error:", updateError);
          setError(toFriendlyMessage(updateError.message));
          return;
        }

        if (data) {
          setItems((prev) => prev.map((item) => (item.id === editingId ? (data as Sponsor) : item)));
          resetForm();
        }
        return;
      }

      const { data, error: insertError } = await supabase
        .from("sponsors")
        .insert({
          user_id: user.id,
          company_name: clean.company_name,
          industry: clean.industry || null,
          contact_name: clean.contact_name || null,
          contact_email: clean.contact_email || null,
          notes: clean.notes || null,
        })
        .select("*")
        .single();

      if (insertError) {
        console.error("Create sponsor error:", insertError);
        setError(toFriendlyMessage(insertError.message));
        return;
      }

      if (data) {
        setItems((prev) => [data as Sponsor, ...prev]);
        resetForm();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id);
    setForm({
      company_name: sponsor.company_name ?? "",
      industry: sponsor.industry ?? "",
      contact_name: sponsor.contact_name ?? "",
      contact_email: sponsor.contact_email ?? "",
      notes: sponsor.notes ?? "",
    });
    setError("");
  };

  const removeSponsor = async (id: string) => {
    if (!confirm("Delete this sponsor?")) return;

    setError("");
    const { error: deleteError } = await supabase.from("sponsors").delete().eq("id", id);

    if (deleteError) {
      console.error("Delete sponsor error:", deleteError);
      setError(toFriendlyMessage(deleteError.message));
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <section className="w-full space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Sponsors</h1>

      <form className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4" onSubmit={submit}>
        <input
          placeholder="Company Name (required)"
          value={form.company_name}
          onChange={(e) => setForm((prev) => ({ ...prev, company_name: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Industry"
          value={form.industry}
          onChange={(e) => setForm((prev) => ({ ...prev, industry: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Contact Name"
          value={form.contact_name}
          onChange={(e) => setForm((prev) => ({ ...prev, contact_name: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Contact Email"
          value={form.contact_email}
          onChange={(e) => setForm((prev) => ({ ...prev, contact_email: e.target.value }))}
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

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {submitting ? "Saving..." : editingId ? "Update Sponsor" : "Create Sponsor"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {loading ? (
          <p className="p-4 text-sm text-slate-600">Loading sponsors...</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2">Company</th>
                <th className="px-3 py-2">Industry</th>
                <th className="px-3 py-2">Contact Email</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{item.company_name}</td>
                  <td className="px-3 py-2">{item.industry ?? "-"}</td>
                  <td className="px-3 py-2">{item.contact_email ?? "-"}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSponsor(item.id)}
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-slate-500">
                    No sponsors yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
