import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import HomeCTA from "@/components/HomeCTA";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";



const categoryIcons: Record<string, string> = {
  Fasada: "🏠",
  Renovime: "🔨",
  Banja: "🚿",
  Trockenbau: "🚪",
  Pllaka: "▦",
  Laminat: "🪵",
  Hidraulikë: "🚰",
  Elektrikë: "⚡",
  Çati: "🏘️",
  Kopshtari: "🌿",
};

export default async function Home() {
  const { data: settings } = await supabase
    .from("platform_settings")
    .select("*")
    .limit(1)
    .single();

  if (settings?.maintenance_mode) {
    return (
      <main className="min-h-screen bg-slate-950 px-8 py-20 text-center text-white">
        <h1 className="text-4xl font-black">MojProfi</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
          {settings.maintenance_message ||
            "Platforma është për momentin në mirëmbajtje. Ju lutemi provoni më vonë."}
        </p>
      </main>
    );
  }

  const companyLimit = settings?.homepage_verified_limit || 4;
  const projectLimit = settings?.homepage_projects_limit || 6;

  const { data: cities } = await supabase.from("cities").select("*");
  const { data: categories } = await supabase.from("categories").select("*");

  const { data: featuredCompanies } = await supabase
    .from("profiles")
    .select(`
      *,
      cities(name),
      profile_categories(
  categories(name)
),
reviews(rating)
    `)
    .eq("account_type", "company")
    .eq("is_approved", true)
    .limit(companyLimit);

  const { data: latestProjects } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      description,
      created_at,
      project_photos(photo_url),
      profiles(
        id,
        slug,
        account_type,
        company_name,
        first_name,
        last_name,
        cities(name)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(projectLimit);

    const { data: featuredProfessionals } = await supabase
  .from("profiles")
  .select(`
    *,
    cities(name),
    profile_categories(
  categories(name)
),
reviews(rating)
  `)
  .eq("account_type", "professional")
  .eq("is_approved", true)
  .limit(4);

function getRating(reviews: any[] | null | undefined) {
  if (!reviews || reviews.length === 0) {
    return "⭐ --";
  }

  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  const average = total / reviews.length;

  return `⭐ ${average.toFixed(1)}`;
}

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <section
        className="relative bg-cover bg-center pb-8"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(8,18,35,0.88), rgba(8,18,35,0.55), rgba(8,18,35,0.35)), url('${
            settings?.homepage_hero_url ||
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80"
          }')`,
        }}
      >
        <div className="mx-auto max-w-[1160px] px-8 pt-14 text-white">
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {settings?.homepage_hero_title ||
              "Gjeni profesionistin e duhur për punën tuaj"}
          </h1>

          <p className="mt-5 text-2xl font-bold text-white/95">
            {settings?.homepage_hero_subtitle ||
              "Kërkoni kompani të besueshme sipas shërbimit dhe qytetit."}
          </p>

          <form
            action="/search"
            className="mt-7 grid max-w-[1040px] gap-5 rounded-2xl bg-white p-7 text-slate-900 shadow-2xl md:grid-cols-[1fr_1fr_180px]"
          >
            <div>
              <label className="mb-3 block text-lg font-extrabold">
                Çfarë shërbimi kërkoni?
              </label>

              <select
                name="category"
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-lg font-bold outline-none"
                defaultValue=""
              >
                <option value="">Zgjidh kategorinë</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-lg font-extrabold">
                Në cilin qytet?
              </label>

              <select
                name="city"
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-lg font-bold outline-none"
                defaultValue=""
              >
                <option value="">Zgjidh qytetin</option>
                {cities?.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <button className="mt-9 rounded-xl bg-blue-600 px-8 py-4 text-xl font-extrabold text-white hover:bg-blue-700">
              🔍 {settings?.homepage_cta_text || "Kërko"}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-black/30 backdrop-blur-sm">
          <div className="mx-auto grid max-w-[1160px] grid-cols-2 gap-4 px-8 py-5 text-white md:grid-cols-4">
            <div className="text-lg font-extrabold">🛡️ Kompanitë e verifikuara</div>
            <div className="text-lg font-extrabold">⭐ Vlerësime reale</div>
            <div className="text-lg font-extrabold">👥 Klientë të kënaqur</div>
            <div className="text-lg font-extrabold">🔒 Të sigurta & të besueshme</div>
          </div>
        </div>
      </section>

    {settings?.show_companies !== false && (
  <section id="companies" className="mx-auto max-w-[1500px] px-8 pb-7">
  <div className="grid gap-8 lg:grid-cols-2">
    {/* Kompanitë */}
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-3xl font-extrabold">Kompanitë e verifikuara</h2>
        <a href="/search?type=company" className="text-lg font-extrabold text-blue-600">
          Shiko të gjitha ›
        </a>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {featuredCompanies?.slice(0, 4).map((company) => (
          <a
            key={company.id}
            href={`/company/${company.slug}`}
            className="block min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-[125px]">
              {company.cover_url ? (
                <img
                  src={company.cover_url}
                  alt={company.company_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-slate-200" />
              )}

              <div className="absolute right-2 top-2 rounded bg-green-500 px-1.5 py-[2px] text-[8px] font-bold text-white">
                VERIFIKUAR
              </div>
            </div>

            <div className="px-3 pb-3 pt-3">
              <h3 className="truncate text-lg font-extrabold">
                {company.company_name}
              </h3>

              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-semibold text-slate-900">
  🏢 Kompani
</p>

                <span className="shrink-0 text-[11px] font-bold text-slate-600">
                  {getRating(company.reviews)}
                </span>
              </div>

              <p className="truncate text-xs font-semibold text-slate-500">
                {company.profile_categories?.[0]?.categories?.name || "Kategori"}
              </p>

              <p className="truncate text-xs font-semibold text-slate-500">
                {company.cities?.name || "Qyteti"}
              </p>

              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <span>📞</span>
                  <span>Kontakt</span>
                </div>
                <span className="text-lg text-slate-500">♡</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>


      {/* Profesionistët */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-3xl font-extrabold">Profesionistët e verifikuar</h2>
          <a href="/search?type=professional" className="text-lg font-extrabold text-blue-600">
            Shiko të gjitha ›
          </a>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {featuredProfessionals?.slice(0, 4).map((pro) => (
            <a
              key={pro.id}
              href={`/professional/${pro.slug}`}
              className="block min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-[125px]">
                {pro.logo_url ? (
                  <img
                    src={pro.logo_url}
                    alt={`${pro.first_name || ""} ${pro.last_name || ""}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-200 text-3xl font-black text-slate-500">
                    {pro.first_name?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                )}

                <div className="absolute right-2 top-2 rounded bg-green-500 px-1.5 py-[2px] text-[8px] font-bold text-white">
  VERIFIKUAR
</div>
              </div>

              <div className="px-3 pb-3 pt-3">
                <h3 className="truncate text-lg font-extrabold">
                  {pro.first_name} {pro.last_name}
                </h3>

                <div className="flex items-center justify-between gap-2">
  <p className="truncate text-xs font-semibold text-slate-900">
  👷 Puntor Privat
</p>

  <span className="shrink-0 text-[11px] font-bold text-slate-600">
    {getRating(pro.reviews)}
  </span>
</div>

<p className="truncate text-xs font-semibold text-slate-500">
  {pro.profile_categories?.[0]?.categories?.name || "Kategori"}
</p>

                <p className="truncate text-sm font-semibold text-slate-500">
                  {pro.cities?.name || "Qyteti"}
                </p>

                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    <span>📞</span>
                    <span>Kontakt</span>
                  </div>
                  <span className="text-lg text-slate-500">♡</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  </section>
)}
      {settings?.show_projects !== false && (
        <section className="mx-auto max-w-[1500px] px-8 py-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Projektet e fundit</h2>
            <a href="/search" className="text-lg font-extrabold text-blue-600">
              Shiko të gjitha ›
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {latestProjects?.map((project) => (
              <a
                key={project.id}
                href={`/project/${project.id}`}
                className="block overflow-hidden rounded-xl border bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56">
                  {project.project_photos?.[0]?.photo_url ? (
                    <img
                      src={project.project_photos[0].photo_url}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-200" />
                  )}

                  <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-white">
                    {project.project_photos?.length || 0} foto
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-extrabold">{project.title}</h3>

                  <p className="mt-1 font-semibold text-slate-600">
                    {(project.profiles as any)?.cities?.name || "Qyteti"}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {settings?.show_how_it_works !== false && (
  <section id="how" className="mx-auto max-w-[1500px] px-8 py-12">
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-extrabold">Si funksionon MojProfi?</h2>
      <p className="mt-3 text-lg text-slate-600">
        Kërko, krahaso, kontakto dhe realizo projektin.
      </p>
    </div>

    <div className="grid gap-5 md:grid-cols-4">
      <a
        href="/search"
        className="group rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
      >
        <div className="text-4xl">🔎</div>
        <h3 className="mt-4 text-xl font-extrabold group-hover:text-blue-600">
          Kërko
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Zgjidh kategorinë dhe qytetin.
        </p>
        <p className="mt-5 text-sm font-black text-blue-600">
          Filloni kërkimin →
        </p>
      </a>

      <a
        href="/search"
        className="group rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
      >
        <div className="text-4xl">📋</div>
        <h3 className="mt-4 text-xl font-extrabold group-hover:text-blue-600">
          Krahaso
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Shiko profile, projekte dhe vlerësime.
        </p>
        <p className="mt-5 text-sm font-black text-blue-600">
          Shiko rezultatet →
        </p>
      </a>

      <a
        href="/contact"
        className="group rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
      >
        <div className="text-4xl">📞</div>
        <h3 className="mt-4 text-xl font-extrabold group-hover:text-blue-600">
          Kontakto
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Telefono ose shkruaj në WhatsApp.
        </p>
        <p className="mt-5 text-sm font-black text-blue-600">
          Na kontakto →
        </p>
      </a>

      <a
        href="/projects"
        className="group rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
      >
        <div className="text-4xl">✅</div>
        <h3 className="mt-4 text-xl font-extrabold group-hover:text-blue-600">
          Kryeje projektin
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Shiko punë të kryera dhe frymëzohu.
        </p>
        <p className="mt-5 text-sm font-black text-blue-600">
          Shiko projektet →
        </p>
      </a>
    </div>
  </section>
)}

      {settings?.show_cta !== false && <HomeCTA />}

<footer className="border-t bg-slate-50 px-8 py-10">
  <div className="mx-auto grid max-w-[1500px] gap-8 md:grid-cols-4">
    <div>
      <h3 className="text-xl font-black text-slate-900">
        {settings?.platform_name || "MojProfi"}
      </h3>

      <p className="mt-2 text-sm font-semibold text-slate-500">
        {settings?.platform_slogan || "Gjej profesionistin e duhur"}
      </p>

      <p className="mt-4 text-sm font-semibold text-slate-500">
        {settings?.footer_copyright ||
          "© 2026 MojProfi. Të gjitha të drejtat e rezervuara."}
      </p>
    </div>

    <div>
      <h4 className="font-black text-slate-900">Kontakt</h4>

      <div className="mt-3 space-y-3 text-sm font-bold">
        <div className="flex items-center gap-2 text-slate-700">
          📧
          <span>
            {settings?.footer_email ||
              settings?.contact_email ||
              "info@mojprofi.com"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          📞
          <span>
            {settings?.footer_phone ||
              settings?.contact_phone ||
              "+389 XX XXX XXX"}
          </span>
        </div>
      </div>
    </div>

    <div>
      <h4 className="font-black text-slate-900">Linqe të shpejta</h4>

      <div className="mt-3 space-y-3 text-sm font-bold">
        <Link href="/contact" className="block text-slate-700 hover:text-blue-600">
          Kontakt
        </Link>

        <Link href="/about" className="block text-slate-700 hover:text-blue-600">
          Rreth Nesh
        </Link>

        <Link href="/privacy" className="block text-slate-700 hover:text-blue-600">
          Privatësia
        </Link>

        <Link href="/terms" className="block text-slate-700 hover:text-blue-600">
          Kushtet e Përdorimit
        </Link>
      </div>
    </div>

    <div>
      <h4 className="font-black text-slate-900">Social</h4>

      <div className="mt-3 space-y-3 text-sm font-bold">
        {settings?.footer_facebook && (
          <a
            href={settings.footer_facebook}
            target="_blank"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <FaFacebookF size={18} />
            Facebook
          </a>
        )}

        {settings?.footer_instagram && (
          <a
            href={settings.footer_instagram}
            target="_blank"
            className="flex items-center gap-2 text-pink-600 hover:underline"
          >
            <FaInstagram size={18} />
            Instagram
          </a>
        )}

        {settings?.footer_tiktok && (
          <a
            href={settings.footer_tiktok}
            target="_blank"
            className="flex items-center gap-2 text-slate-900 hover:underline"
          >
            <FaTiktok size={18} />
            TikTok
          </a>
        )}
      </div>
    </div>
  </div>
</footer>
</main>
);
}