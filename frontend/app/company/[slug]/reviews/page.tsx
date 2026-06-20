import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default async function CompanyReviewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(`
      id,
      slug,
      company_name,
      cities(name)
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (profileError || !profile) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-3xl font-black">Profili nuk u gjet.</h1>
        </div>
      </main>
    );
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  const reviewCount = reviews?.length || 0;

  const averageRating =
    reviewCount > 0
      ? (
          reviews!.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
          ) / reviewCount
        ).toFixed(1)
      : "0.0";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href={`/company/${profile.slug}`}
          className="text-sm font-bold text-blue-600"
        >
          ← Kthehu te profili
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-black">
            Vlerësimet për {profile.company_name}
          </h1>

          <p className="mt-2 font-semibold text-slate-500">
            {(profile.cities as any)?.name || "Qyteti"}
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-6">
            <div className="text-5xl font-black">{averageRating}</div>
            <div className="mt-2 text-yellow-400">★★★★★</div>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Nga {reviewCount} vlerësime
            </p>
          </div>

          <div className="mt-8 grid gap-4">
            {reviewCount === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-5 font-semibold text-slate-500">
                Ky profil ende nuk ka vlerësime.
              </p>
            ) : (
              reviews?.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-black text-slate-600">
                      {review.reviewer_name?.charAt(0)?.toUpperCase() || "K"}
                    </div>

                    <div>
                      <h3 className="font-black">{review.reviewer_name}</h3>
                      <div className="text-sm text-yellow-400">
                        {"★".repeat(Number(review.rating || 0))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 leading-7 text-slate-600">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}