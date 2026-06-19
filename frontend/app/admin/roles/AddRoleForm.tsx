"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ProfileResult = {
  user_id: string;
  email: string | null;
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  account_type: string | null;
};

export default function AddRoleForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("moderator");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProfileResult[]>([]);

  useEffect(() => {
    async function searchUsers() {
      if (email.trim().length < 2) {
        setResults([]);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("user_id, email, company_name, first_name, last_name, account_type")
        .ilike("email", `%${email.trim()}%`)
        .limit(5);

      setResults((data as ProfileResult[]) || []);
    }

    searchUsers();
  }, [email]);

  function getName(profile: ProfileResult) {
    if (profile.company_name) return profile.company_name;

    return `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Pa emër";
  }

  async function addRole() {
    if (!email.trim()) {
      alert("Shkruaj emailin e përdoruesit.");
      return;
    }

    setLoading(true);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", email.trim())
      .single();

    if (profileError || !profile?.user_id) {
      setLoading(false);
      alert("Nuk u gjet përdorues me këtë email.");
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .upsert(
        {
          user_id: profile.user_id,
          role,
        },
        { onConflict: "user_id" }
      );

    setLoading(false);

    if (error) {
      alert("Gabim: " + error.message);
      return;
    }

    alert("Roli u shtua me sukses.");
    window.location.reload();
  }

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black">Shto / Përditëso rol</h2>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_140px]">
        <div className="relative">
          <input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Kërko me email..."
  autoComplete="new-password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          {results.length > 0 && (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              {results.map((profile) => (
                <button
                  key={profile.user_id}
                  type="button"
                  onClick={() => {
                    setEmail(profile.email || "");
                    setResults([]);
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <div>
                    <p className="font-bold">{getName(profile)}</p>
                    <p className="text-xs text-slate-500">{profile.email}</p>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
                    {profile.account_type === "company" ? "Kompani" : "Profesionist"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="operator">Operator</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>

        <button
          onClick={addRole}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Duke shtuar..." : "Shto rol"}
        </button>
      </div>
    </div>
  );
}