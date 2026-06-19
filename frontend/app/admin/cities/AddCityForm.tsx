"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddCityForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function addCity() {
    if (!name.trim()) {
      alert("Shkruaj emrin e qytetit.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("cities").insert({
      name: name.trim(),
    });

    setLoading(false);

    if (error) {
      alert("Gabim: " + error.message);
      return;
    }

    setName("");
    window.location.reload();
  }

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black">Shto qytet</h2>

      <div className="mt-4 flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Emri i qytetit..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <button
          onClick={addCity}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Duke shtuar..." : "Shto"}
        </button>
      </div>
    </div>
  );
}