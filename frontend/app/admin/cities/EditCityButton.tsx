"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EditCityButton({
  cityId,
  currentName,
}: {
  cityId: number;
  currentName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function editCity() {
    const newName = prompt("Shkruaj emrin e ri të qytetit:", currentName);

    if (!newName || !newName.trim()) return;

    setLoading(true);

    const { error } = await supabase
      .from("cities")
      .update({ name: newName.trim() })
      .eq("id", cityId);

    setLoading(false);

    if (error) {
      alert("Gabim: " + error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={editCity}
      disabled={loading}
      className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 disabled:opacity-50"
    >
      Edit
    </button>
  );
}