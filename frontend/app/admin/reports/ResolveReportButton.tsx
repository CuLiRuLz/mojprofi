"use client";

import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResolveReportButton({
  reportId,
}: {
  reportId: number;
}) {
  async function handleResolve() {
    const confirmed = confirm(
      "A dëshiron ta shënosh këtë raport si të zgjidhur?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("reports")
      .update({
        status: "resolved",
      })
      .eq("id", reportId);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={handleResolve}
      className="rounded-lg bg-emerald-500 px-3 py-2 text-white hover:bg-emerald-600"
      title="Zgjidh raportin"
    >
      <Check size={15} />
    </button>
  );
}