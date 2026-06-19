"use client";

import { supabase } from "@/lib/supabase";

export default function VerificationLevelButton({
  profileId,
  level,
}: {
  profileId: number;
  level: number;
}) {
  async function updateLevel() {
    const { error } = await supabase
      .from("profiles")
      .update({ verified_level: level })
      .eq("id", profileId);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={updateLevel}
      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-600 hover:text-white"
    >
      L{level}
    </button>
  );
}