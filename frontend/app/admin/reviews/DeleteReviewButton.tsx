"use client";

import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props = {
  reviewId: number;
};

export default function DeleteReviewButton({ reviewId }: Props) {
  async function deleteReview() {
    const confirmed = confirm(
      "A dëshironi ta fshini këtë vlerësim?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={deleteReview}
      title="Fshij vlerësimin"
      className="inline-flex rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
    >
      <Trash2 size={15} />
    </button>
  );
}