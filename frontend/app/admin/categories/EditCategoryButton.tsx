"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EditCategoryButton({
  categoryId,
  currentName,
}: {
  categoryId: number;
  currentName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function editCategory() {
    const newName = prompt("Shkruaj emrin e ri të kategorisë:", currentName);

    if (!newName || !newName.trim()) return;

    setLoading(true);

    const { error } = await supabase
      .from("categories")
      .update({ name: newName.trim() })
      .eq("id", categoryId);

    setLoading(false);

    if (error) {
      alert("Gabim: " + error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={editCategory}
      disabled={loading}
      className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 disabled:opacity-50"
    >
      Edit
    </button>
  );
}