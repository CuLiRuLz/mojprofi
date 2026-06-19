"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RoleActions({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole?: string | null;
}) {
  const [role, setRole] = useState(currentRole || "user");
  const [loading, setLoading] = useState(false);

  const isSuperAdmin = currentRole === "super_admin";

  async function saveRole() {
    if (isSuperAdmin && role !== "super_admin") {
      alert("Nuk lejohet të ulet roli i Super Admin kryesor.");
      setRole("super_admin");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("user_roles")
      .upsert(
        {
          user_id: userId,
          role,
        },
        {
          onConflict: "user_id",
        }
      );

    setLoading(false);

    if (error) {
      alert("Gabim: " + error.message);
      return;
    }

    alert("Roli u ruajt me sukses.");
    window.location.reload();
  }

  async function removeRole() {
    if (isSuperAdmin) {
      alert("Nuk lejohet të hiqet roli i Super Admin kryesor.");
      return;
    }

    const confirmed = confirm("A je i sigurt që dëshiron ta heqësh këtë rol?");

    if (!confirmed) return;

    setLoading(true);

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    setLoading(false);

    if (error) {
      alert("Gabim: " + error.message);
      return;
    }

    alert("Roli u hoq me sukses.");
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="rounded-xl border px-3 py-2 text-sm"
      >
        <option value="user">User</option>
        <option value="operator">Operator</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
        <option value="super_admin">Super Admin</option>
      </select>

      <button
        onClick={saveRole}
        disabled={loading}
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Duke ruajtur..." : "Ruaj"}
      </button>

      <button
        onClick={removeRole}
        disabled={loading || isSuperAdmin}
        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Hiq
      </button>
    </div>
  );
}