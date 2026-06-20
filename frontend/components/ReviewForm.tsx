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
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <div className="mb-4">
        <h3 className="text-lg font-black">Lër një vlerësim</h3>
        <p className="mt-1 text-sm text-slate-500">
          Ndihmo përdoruesit e tjerë me përvojën tënde.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-slate-700">Emri</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Emri yt"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">Vlerësimi</label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
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
      </div>

      <div className="mt-4">
        <label className="text-sm font-bold text-slate-700">Komenti</label>
        <textarea
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Shkruaj një koment të shkurtër..."
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
          Dërgo vlerësimin
        </button>

        {message && (
          <p className="text-sm font-semibold text-slate-600">{message}</p>
        )}
      </div>
    </form>
  );
}