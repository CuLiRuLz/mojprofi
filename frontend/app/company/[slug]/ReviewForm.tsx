"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type ReviewFormProps = {
  profileId: string;
};

export default function ReviewForm({ profileId }: ReviewFormProps) {
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!reviewerName.trim()) {
      setMessage("Shkruaje emrin.");
      return;
    }

    if (!comment.trim()) {
      setMessage("Shkruaje komentin.");
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      profile_id: profileId,
      reviewer_name: reviewerName,
      rating,
      comment,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setReviewerName("");
    setRating(5);
    setComment("");
    setMessage("Vlerësimi u dërgua me sukses.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 rounded-2xl border p-6">
      <h3 className="text-xl font-bold">Lër një Vlerësim</h3>

      <div className="mt-6">
        <label className="text-sm font-semibold">Emri</label>
        <input
          className="mt-2 w-full rounded-xl border px-4 py-3"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold">Vlerësimi</label>
        <select
          className="mt-2 w-full rounded-xl border px-4 py-3"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>⭐⭐⭐⭐⭐ 5</option>
          <option value={4}>⭐⭐⭐⭐ 4</option>
          <option value={3}>⭐⭐⭐ 3</option>
          <option value={2}>⭐⭐ 2</option>
          <option value={1}>⭐ 1</option>
        </select>
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold">Komenti</label>
        <textarea
          className="mt-2 w-full rounded-xl border px-4 py-3"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white">
        Dërgo Vlerësimin
      </button>

      {message && <p className="mt-4 font-semibold">{message}</p>}
    </form>
  );
}