"use client";

import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RejectReportButton({
  reportId,
}: {
  reportId: number;
}) {
  async function handleReject() {
    const confirmed = confirm(
      "A dëshiron ta refuzosh këtë raport?"
    );

    if (!confirmed) return;

    await supabase
      .from("reports")
      .update({
        status: "rejected",
      })
      .eq("id", reportId);

    window.location.reload();
  }

  return (
    <button
      onClick={handleReject}
      className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"
      title="Refuzo raportin"
    >
      <X size={15} />
    </button>
  );
}