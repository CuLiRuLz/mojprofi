"use client";

import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DeleteCategoryButton({
  categoryId,
}: {
  categoryId: number;
}) {
  async function deleteCategory() {
    const confirmed = confirm("A je i sigurt që dëshiron ta fshish këtë kategori?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      alert("Gabim: " + error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={deleteCategory}
      className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
      title="Fshi kategorinë"
    >
      <Trash2 size={14} />
    </button>
  );
}