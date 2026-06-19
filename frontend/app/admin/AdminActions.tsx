"use client";

import { supabase } from "@/lib/supabase";

type AdminActionsProps = {
  profileId: number;
};

export default function AdminActions({ profileId }: AdminActionsProps) {
  async function approveCompany() {
    await supabase
      .from("profiles")
      .update({ is_approved: true })
      .eq("id", profileId);

    window.location.reload();
  }

  async function rejectCompany() {
    await supabase
      .from("profiles")
      .update({ is_approved: false })
      .eq("id", profileId);

    window.location.reload();
  }

  async function setLevel(level: number) {
    await supabase
      .from("profiles")
      .update({ verified_level: level })
      .eq("id", profileId);

    window.location.reload();
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button onClick={approveCompany} className="rounded-lg bg-green-600 px-3 py-2 text-white">
        Approve
      </button>

      <button onClick={rejectCompany} className="rounded-lg bg-red-600 px-3 py-2 text-white">
        Reject
      </button>

      <button onClick={() => setLevel(1)} className="rounded-lg bg-yellow-500 px-3 py-2 text-white">
        Level 1
      </button>

      <button onClick={() => setLevel(2)} className="rounded-lg bg-orange-500 px-3 py-2 text-white">
        Level 2
      </button>

      <button onClick={() => setLevel(3)} className="rounded-lg bg-blue-600 px-3 py-2 text-white">
        Level 3
      </button>
    </div>
  );
}