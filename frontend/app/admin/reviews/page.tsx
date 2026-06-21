import Link from "next/link";
import { Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DeleteReviewButton from "./DeleteReviewButton";

type Review = {
  id: number;
  profile_id: number;
  reviewer_name: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
  profiles: {
    id: number;
    account_type: string | null;
    slug: string | null;
    company_name: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
};

function getProfileName(review: Review) {
  const profile = review.profiles;
  if (!profile) return "-";

  if (profile.account_type === "company") {
    return profile.company_name || "-";
  }

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  return fullName || "-";
}

function getProfileType(review: Review) {
  const type = review.profiles?.account_type;

  if (type === "company") {
    return (
      <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
        Kompani
      </span>
    );
  }

  if (type === "professional") {
    return (
      <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600">
        Profesionist
      </span>
    );
  }

  return (
    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
      -
    </span>
  );
}

function getProfileLink(review: Review) {
  const profile = review.profiles;

  if (!profile?.slug) return "#";

  if (profile.account_type === "professional") {
    return `/professional/${profile.slug}`;
  }

  return `/company/${profile.slug}`;
}

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("sq-AL", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default async function AdminReviewsPage() {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      profile_id,
      reviewer_name,
      rating,
      comment,
      created_at,
      profiles(
        id,
        account_type,
        slug,
        company_name,
        first_name,
        last_name
      )
    `)
    .order("created_at", { ascending: false });

  const reviews = (data as unknown as Review[] | null) || [];

  if (error) {
    return (
      <div className="px-4 py-5 lg:px-8 lg:py-7">
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error.message}
        </p>
      </div>
    );
  }

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          totalReviews
        ).toFixed(1)
      : "0.0";

  const lowReviews = reviews.filter((review) => (review.rating || 0) <= 2).length;

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7">
      <h1 className="text-2xl font-black">Reviews / Vlerësimet</h1>

      <p className="mt-1 text-sm text-slate-500">
        Këtu menaxhohen të gjitha vlerësimet e përdoruesve.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Gjithsej vlerësime
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {totalReviews}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Mesatarja</p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            ⭐ {averageRating}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Review negative
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {lowReviews}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Lista e vlerësimeve
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Shiko dhe menaxho komentet e lëna në profile.
            </p>
          </div>

          <input
            type="text"
            placeholder="Kërko autor ose profil..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500 md:w-72"
          />
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 pr-4 font-bold">Autori</th>
                <th className="py-3 pr-4 font-bold">Profili</th>
                <th className="py-3 pr-4 font-bold">Lloji</th>
                <th className="py-3 pr-4 font-bold">Rating</th>
                <th className="w-[35%] py-3 pr-4 font-bold">Komenti</th>
                <th className="py-3 pr-4 font-bold">Data</th>
                <th className="py-3 font-bold">Veprimet</th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="py-4 pr-4 font-bold text-slate-900">
                    {review.reviewer_name || "-"}
                  </td>

                  <td className="py-4 pr-4">
                    <Link
                      href={getProfileLink(review)}
                      target="_blank"
                      className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {getProfileName(review)}
                    </Link>
                  </td>

                  <td className="py-4 pr-4">{getProfileType(review)}</td>

                  <td className="py-4 pr-4 text-slate-600">
                    ⭐ {review.rating || 0}/5
                  </td>

                  <td className="w-[35%] py-4 pr-4 text-slate-600">
                    <p className="line-clamp-3">
                      {review.comment || "-"}
                    </p>
                  </td>

                  <td className="py-4 pr-4 text-slate-600">
                    {formatDate(review.created_at)}
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={getProfileLink(review)}
                        target="_blank"
                        className="inline-flex rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                        title="Shiko profilin"
                      >
                        <Eye size={15} />
                      </Link>

                      <DeleteReviewButton reviewId={review.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {reviews.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Nuk ka vlerësime për momentin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}