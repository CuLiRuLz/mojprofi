"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setMessage("Nuk je i kyçur.");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (!profile) {
        setMessage("Profili nuk u gjet.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setReviews(data || []);
      setLoading(false);
    }

    loadReviews();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-black">Vlerësimet</h1>

          <p className="mt-2 text-slate-600">
            Këtu shfaqen vlerësimet dhe komentet që klientët kanë lënë në
            profilin tuaj publik.
          </p>

          {loading && (
            <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
              Duke ngarkuar vlerësimet...
            </div>
          )}

          {message && (
            <div className="mt-8 rounded-3xl bg-white p-8 font-bold shadow-sm">
              {message}
            </div>
          )}

          {!loading && !message && reviews.length === 0 && (
            <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black">Ende nuk ka vlerësime</h2>
              <p className="mt-3 text-slate-600">
                Kur klientët të lënë vlerësime, ato do të shfaqen këtu.
              </p>
            </div>
          )}

          {!loading && !message && reviews.length > 0 && (
            <div className="mt-8 grid gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-3xl bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black">
                        {review.reviewer_name || "Klient"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : ""}
                      </p>
                    </div>

                    <div className="rounded-full bg-amber-100 px-4 py-2 font-black text-amber-700">
                      ⭐ {review.rating}/5
                    </div>
                  </div>

                  <p className="mt-4 leading-relaxed text-slate-700">
                    {review.comment || "Pa koment."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}