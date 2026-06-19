"use client";

import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DeleteCityButton({
  cityId,
}: {
  cityId: number;
}) {
  async function deleteCity() {
    const confirmed = confirm("A je i sigurt që dëshiron ta fshish këtë qytet?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("cities")
      .delete()
      .eq("id", cityId);

    if (error) {
      alert("Gabim: " + error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={deleteCity}
      className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
      title="Fshi qytetin"
    >
      <Trash2 size={14} />
    </button>
  );
}