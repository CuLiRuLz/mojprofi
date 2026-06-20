import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export const runtime = "edge";

type SearchPageProps = {
  searchParams: Promise<{
    city?: string;
    category?: string;
    type?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const selectedCity = params.city;
  const selectedCategory = params.category;
  const selectedType = params.type;

  const {
  data: { session },
} = await supabase.auth.getSession();

  let profileIdsFromCategory: number[] | null = null;

  if (selectedCategory) {
    const { data: profileCategories } = await supabase
      .from("profile_categories")
      .select("profile_id")
      .eq("category_id", selectedCategory);

    profileIdsFromCategory =
      profileCategories?.map((item) => item.profile_id) || [];
  }

  let profilesQuery = supabase
    .from("profiles")
    .select(`
      *,
      cities(name),
      reviews(rating),
      profile_categories(
        is_main,
        categories(name)
      )
    `)
    .eq("is_approved", true)
    .order("id", { ascending: false });

  if (selectedCity) {
    profilesQuery = profilesQuery.eq("city_id", selectedCity);
  }

  if (profileIdsFromCategory) {
    profilesQuery = profilesQuery.in("id", profileIdsFromCategory);
  }

  if (selectedType === "company") {
  profilesQuery = profilesQuery.eq("account_type", "company");
}

if (selectedType === "professional") {
  profilesQuery = profilesQuery.eq("account_type", "professional");
}

  const { data: profiles } = await profilesQuery;

  const { data: cities } = await supabase
    .from("cities")
    .select("*")
    .order("name", { ascending: true });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
<Navbar />

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-slate-900 px-8 py-12 text-white">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-lg font-bold text-blue-100">
            Rezultatet e kërkimit
          </p>

          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Gjej kompani dhe mjeshtër të verifikuar
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-blue-100">
            Filtro sipas kategorisë dhe qytetit. Shiko profile, vlerësime,
            projekte dhe kontakto direkt.
          </p>

          <form
            action="/search"
            className="mt-8 grid gap-4 rounded-2xl bg-white p-5 text-slate-900 shadow-2xl md:grid-cols-[1fr_1fr_180px]"
          >
            <select
              name="category"
              defaultValue={selectedCategory || ""}
              className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-lg font-bold outline-none"
            >
              <option value="">Të gjitha kategoritë</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              name="city"
              defaultValue={selectedCity || ""}
              className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-lg font-bold outline-none"
            >
              <option value="">Të gjitha qytetet</option>
              {cities?.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-4 text-lg font-extrabold text-white hover:bg-blue-700"
            >
              🔍 Kërko
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-8 py-8">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold">
              {profiles?.length || 0} rezultate u gjetën
            </h2>
            <p className="mt-2 text-slate-600">
              Kompani dhe profesionistë të aprovuar në MojProfi.
            </p>
          </div>

          <Link href="/" className="font-bold text-blue-600">
            ← Kthehu në ballinë
          </Link>
        </div>

        {!profiles || profiles.length === 0 ? (
          <div className="rounded-3xl border bg-white p-12 text-center shadow-sm">
            <div className="text-6xl">🔎</div>
            <h3 className="mt-5 text-3xl font-extrabold">
              Nuk u gjet asnjë rezultat
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Provo një kategori tjetër ose zgjidh një qytet tjetër.
            </p>

            <Link
              href="/search"
              className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700"
            >
              Pastro filtrat
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {profiles.map((profile: any) => {
              const reviewCount = profile.reviews?.length || 0;

              const averageRating =
                reviewCount > 0
                  ? (
                      profile.reviews.reduce(
                        (sum: number, review: any) => sum + review.rating,
                        0
                      ) / reviewCount
                    ).toFixed(1)
                  : "0.0";

              const mainCategory =
                profile.profile_categories?.find((c: any) => c.is_main)
                  ?.categories?.name || "Pa kategori";

              const profileName =
                profile.account_type === "professional"
                  ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
                    "Mjeshtër"
                  : profile.company_name || "Kompani";

              const firstLetter = profileName.charAt(0).toUpperCase();

              const phoneDigits = profile.phone?.replace(/\D/g, "");

              return (
                <article
                  key={profile.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-[155px] bg-slate-200">
                    {profile.cover_url ? (
                      <img
                        src={profile.cover_url}
                        alt={profileName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-slate-300 to-slate-500" />
                    )}

                    {profile.verified_level === 3 && (
                      <div className="absolute right-4 top-3 rounded-md bg-green-500 px-4 py-2 text-xs font-extrabold text-white">
                        VERIFIKUAR
                      </div>
                    )}

                    {profile.account_type === "professional" && (
                      <div className="absolute left-4 top-3 rounded-md bg-blue-600 px-4 py-2 text-xs font-extrabold text-white">
                        MJESHTËR
                      </div>
                    )}
                  </div>

                  <div className="relative px-5 pb-5">
                    <div className="-mt-9 flex items-end gap-4">
                      <div className="flex h-[78px] w-[78px] shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white text-center text-xl font-black shadow-md">
                        {profile.logo_url ? (
                          <img
                            src={profile.logo_url}
                            alt={profileName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          firstLetter
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pb-0 pt-10">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="truncate text-2xl font-extrabold">
                            {profileName}
                          </h3>
                          <span className="shrink-0 text-sm font-extrabold">
                            ⭐ {averageRating}
                          </span>
                        </div>

                        <p className="mt-1 font-semibold text-slate-600">
                          📍 {profile.cities?.name || "Pa qytet"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                        {mainCategory}
                      </span>

                      {profile.experience_years && (
                        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                          {profile.experience_years} vite eksperiencë
                        </span>
                      )}
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                      {profile.about ||
                        "Profil i aprovuar në MojProfi. Shiko projektet, vlerësimet dhe kontakto direkt."}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-sm font-bold">
                      <span>⭐ {averageRating}</span>
                      <span className="text-slate-500">
                        {reviewCount} vlerësime
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
                      {profile.phone ? (
                        <a
                          href={`tel:${profile.phone}`}
                          className="rounded-xl bg-blue-600 py-3 text-center text-sm font-extrabold text-white hover:bg-blue-700"
                        >
                          Telefon
                        </a>
                      ) : (
                        <button className="rounded-xl bg-slate-200 py-3 text-sm font-extrabold text-slate-500">
                          Telefon
                        </button>
                      )}

                      {phoneDigits ? (
                        <a
                          href={`https://wa.me/${phoneDigits}`}
                          className="rounded-xl border border-green-500 py-3 text-center text-sm font-extrabold text-green-600 hover:bg-green-50"
                        >
                          WhatsApp
                        </a>
                      ) : (
                        <button className="rounded-xl border py-3 text-sm font-extrabold text-slate-500">
                          WhatsApp
                        </button>
                      )}
                    </div>

                    <Link
  href={
    profile.account_type === "professional"
      ? `/professional/${profile.slug}`
      : `/company/${profile.slug}`
  }
  className="mt-3 block rounded-xl border border-slate-200 py-3 text-center text-sm font-extrabold hover:bg-slate-50"
>
  Shiko profilin
</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}