import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaHeart,
  FaStar,
  FaMapMarkerAlt,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaTools,
  FaCheckCircle,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaShareAlt,
} from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import ReviewForm from "@/components/ReviewForm";
import FavoriteButton from "@/components/FavoriteButton";

export const runtime = "edge";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CompanyProfilePage({ params }: PageProps) {
  const { slug } = await params;

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      cities(name),
      profile_categories(
        is_main,
        categories(name)
      )
    `)
    .eq("slug", slug)
.single();

  if (!profile) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-3xl font-bold">Profili nuk u gjet</h1>
      </main>
    );
  }

  const phoneDigits = profile.phone?.replace(/\D/g, "");

const verification =
  profile.verified_level === 3
    ? {
        label: "Kompani e Verifikuar",
        className: "bg-green-100 text-green-700",
      }
    : profile.verified_level === 2
    ? {
        label: "Identitet i Verifikuar",
        className: "bg-orange-100 text-orange-700",
      }
    : profile.verified_level === 1
    ? {
        label: "Telefon & Email i Verifikuar",
        className: "bg-yellow-100 text-yellow-700",
      }
    : {
        label: "Pa Verifikim",
        className: "bg-slate-100 text-slate-600",
      };

  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      project_photos(*)
    `)
    .eq("profile_id", profile.id)
    .order("id", { ascending: false });

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("profile_id", profile.id)
    .order("id", { ascending: false });

  const reviewCount = reviews?.length || 0;

  const averageRating =
    reviewCount > 0
      ? (
          reviews!.reduce((sum: number, review: any) => sum + review.rating, 0) /
          reviewCount
        ).toFixed(1)
      : "0.0";

  const displayName =
    profile.account_type === "professional"
      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
        "Mjeshtër"
      : profile.company_name || "Kompani";

  const mainCategory =
    profile.profile_categories?.find((c: any) => c.is_main)?.categories?.name ||
    "Ndërtim & Konstruksion";



const memberSince = profile.created_at
  ? new Date(profile.created_at).getFullYear()
  : null;

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
<Navbar />

      <div className="mx-auto max-w-[1380px] px-6 py-5">
        <section className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="relative h-[220px] md:h-[390px]">
            {profile.cover_url ? (
              <img
                src={profile.cover_url}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-950" />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

            </div>



          <div className="relative rounded-t-2xl bg-white px-4 md:px-10 pb-0 pt-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4 md:gap-8">
                <div className="-mt-14 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-2xl md:-mt-24 md:h-40 md:w-40">
                  {profile.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-black text-blue-600">
                      {displayName.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="-mt-3">
  <div
    className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-[11px] font-bold ${verification.className}`}
  >
    <FaCheckCircle />
    {verification.label}
  </div>

                  <h2 className="-mt-1 flex items-center gap-2 text-2xl font-black md:text-3xl">
  {displayName}
  <span className="text-lg text-blue-600">●</span>
</h2>

<div className="mt-3 hidden items-center gap-3 text-sm md:flex">
  <span className="text-yellow-400">★★★★★</span>
  <span className="font-semibold">{averageRating}</span>
  <span className="text-slate-500">({reviewCount} Vlerësime)</span>
</div>

<div className="mt-4 hidden gap-2 text-sm text-slate-600 md:grid">
  <div className="flex items-center gap-3">
    <FaMapMarkerAlt className="text-slate-500" />
    {profile.cities?.name || "Tetovë"}, Maqedonia e Veriut
  </div>

  <div className="flex items-center gap-3">
    <FaTools className="text-slate-500" />
    {mainCategory}
  </div>

  <div className="flex items-center gap-3">
    <FaClock className="text-slate-500" />
    Anëtar që nga {memberSince}
  </div>
</div>

<div className="mt-3 -ml-25 text-sm text-slate-600 md:hidden">
  <div className="flex justify-between">
    <span>{profile.cities?.name || "Tetovë"}, MK</span>
    <span>⭐ {averageRating}</span>
  </div>

  <div className="mt-2 flex justify-between">
    <span>{mainCategory}</span>
    <span>Anëtar {memberSince}</span>
  </div>
</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 md:flex-wrap md:gap-4">
  <a
    href={`tel:${profile.phone}`}
    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-2 py-2 text-xs md:px-4 md:text-sm font-bold text-white shadow-md hover:bg-blue-700"
  >
    <FaPhoneAlt />
    Telefono
  </a>

  <a
    href={`https://wa.me/${phoneDigits}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-2 py-2 text-xs md:px-4 md:text-sm font-bold text-white shadow-md hover:bg-green-600"
  >
    <FaWhatsapp />
    WhatsApp
  </a>

  <a
    href={`https://www.facebook.com/sharer/sharer.php?u=https://mojprofi.com/company/${profile.slug}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-2 py-2 text-xs md:px-4 md:text-sm md:px-4 md:text-sm font-bold text-slate-700 hover:bg-slate-300"
  >
    <FaShareAlt />
    Shpërndaj
  </a>

  <div className="rounded-xl bg-white shadow-sm">
    <FavoriteButton profileId={profile.id.toString()} />
  </div>
</div>
</div>

<div className="mt-7 flex gap-2 overflow-x-auto whitespace-nowrap text-sm font-semibold text-slate-600 md:gap-0 md:overflow-visible">
  <a className="shrink-0 border-b-4 border-blue-600 px-4 py-4 text-blue-600 md:px-8">
    Përmbledhje
  </a>

  <a href="#projects" className="shrink-0 px-4 py-4 md:px-8">
    Projekte
  </a>

  <a href="#reviews" className="shrink-0 px-4 py-4 md:px-8">
    Vlerësimet ({reviewCount})
  </a>

  <a href="#about" className="shrink-0 px-4 py-4 md:px-8">
    Rreth Nesh
  </a>

  <a className="shrink-0 px-4 py-4 md:px-8">
    Shërbimet
  </a>

  <a href="#contact" className="shrink-0 px-4 py-4 md:px-8">
    Kontakti
  </a>
</div>
</div>
</section>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <section id="about" className="rounded-2xl bg-white p-7 shadow-md">
              <h3 className="text-xl font-black">Rreth Kompanisë</h3>
              <p className="mt-5 max-w-4xl leading-8 text-slate-700">
                {profile.about ||
                  "Kompania është e specializuar në ndërtim, renovim dhe shërbime profesionale për klientë privatë dhe kompani."}
              </p>

              <div className="mt-7 flex flex-wrap gap-4">
                {[
                  "Cilësi e garantuar",
                  "Punë në kohë",
                  "Materiale cilësore",
                  "Ekip profesional",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold"
                  >
                    <FaCheckCircle className="text-blue-600" />
                    {item}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-7 shadow-md">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-black">Shërbimet Tona</h3>
                
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
  {(profile.services_text
    ? profile.services_text.split(",").filter(Boolean)
    : [
        "Ndërtim Shtëpish",
        "Renovime",
        "Fasada",
        "Tavan & Gips",
        "Suva & Lyerje",
        "Pllaka & Keramikë",
      ]
  ).map((service: string) => (
    <div
      key={service}
      className="rounded-xl bg-slate-50 p-4 text-center text-sm font-bold shadow-sm"
    >
      <div className="mb-3 text-3xl">⌂</div>
      {service.trim()}
    </div>
  ))}
</div>
            </section>

            <section id="projects" className="rounded-2xl bg-white p-7 shadow-md">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-black">Projektet e Fundit</h3>
                <Link href="#" className="text-sm font-bold text-blue-600">
                  Shiko të gjitha
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {projects?.slice(0, 4).map((project) => {
                  const photoCount = project.project_photos?.length || 0;
                  const coverPhoto =
                    project.project_photos?.[0]?.photo_url || project.photo_url;

                  return (
                    <Link
                      href={`/project/${project.id}`}
                      key={project.id}
                      className="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-40">
                        {coverPhoto ? (
                          <img
                            src={coverPhoto}
                            alt={project.title || "Projekt"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-slate-200" />
                        )}
                        <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white">
                          {photoCount} foto
                        </span>
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-black">
                          {project.title || "Projekt"}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500">
                          {profile.cities?.name || "Tetovë"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section id="reviews" className="rounded-2xl bg-white p-7 shadow-md">
              <div className="mb-5 flex items-center justify-between">
  <h3 className="text-xl font-black">Vlerësimet e Klientëve</h3>

  <Link
    href={`/company/${profile.slug}/reviews`}
    className="text-sm font-bold text-blue-600"
  >
    Shiko të gjitha
  </Link>
</div>

              <div className="grid gap-4 md:grid-cols-[150px_1fr_1fr_1fr]">
                <div className="rounded-xl bg-slate-50 p-5 text-center shadow-sm">
                  <div className="text-5xl font-black">{averageRating}</div>
                  <div className="mt-2 text-yellow-400">★★★★★</div>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    Nga {reviewCount} vlerësime
                  </p>
                </div>

                {reviews?.slice(0, 3).map((review) => (
                  <div key={review.id} className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-200" />
                      <div>
                        <h4 className="text-sm font-black">
                          {review.reviewer_name}
                        </h4>
                        <div className="text-xs text-yellow-400">
                          {"★".repeat(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <ReviewForm profileId={profile.id.toString()} />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section id="contact" className="rounded-2xl bg-white p-7 shadow-md">
              <h3 className="text-xl font-black">Informacion Kontakti</h3>

              <div className="mt-6 space-y-5 text-sm">
                <div className="flex items-center gap-4">
                  <FaPhoneAlt className="text-slate-600" />
                  {profile.phone || "Nuk është vendosur"}
                </div>
                <div className="flex items-center gap-4">
                  <FaEnvelope className="text-slate-600" />
                  {profile.email || "Nuk është vendosur"}
                </div>
                <div className="flex items-center gap-4">
                  <FaGlobe className="text-slate-600" />
                  {profile.website_url || "Nuk është vendosur"}
                </div>
                <div className="flex items-center gap-4">
                  <FaMapMarkerAlt className="text-slate-600" />
                  {profile.address || `${profile.cities?.name || "Tetovë"}, Maqedonia e Veriut`}
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-7 shadow-md">
              <h3 className="text-xl font-black">Orari i Punës</h3>

              <div className="mt-6 space-y-5 text-sm">
                <div className="flex justify-between">
  <b>E Hënë - E Premte</b>
  <span>{profile.working_hours_weekdays || "-"}</span>
</div>

<div className="flex justify-between">
  <b>E Shtunë</b>
  <span>{profile.working_hours_saturday || "-"}</span>
</div>

<div className="flex justify-between">
  <b>E Diel</b>
  <span>{profile.working_hours_sunday || "-"}</span>
</div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-7 shadow-md">
  <h3 className="text-xl font-black">Na Ndiqni</h3>

  <div className="mt-6 flex gap-4">
    {profile.facebook_url && (
      <a
        href={profile.facebook_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white"
      >
        <FaFacebookF />
      </a>
    )}

    {profile.instagram_url && (
      <a
        href={profile.instagram_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-white"
      >
        <FaInstagram />
      </a>
    )}

    {profile.linkedin_url && (
      <a
        href={profile.linkedin_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white"
      >
        <FaLinkedinIn />
      </a>
    )}

    {profile.youtube_url && (
      <a
        href={profile.youtube_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white"
      >
        <FaYoutube />
      </a>
    )}

    {!profile.facebook_url &&
      !profile.instagram_url &&
      !profile.linkedin_url &&
      !profile.youtube_url && (
        <p className="text-sm text-slate-500">
          Rrjetet sociale nuk janë vendosur.
        </p>
      )}
  </div>
</section>

            <section className="rounded-2xl bg-white p-7 shadow-md">
              <h3 className="text-xl font-black">Lokacioni</h3>
              <div className="mt-6 flex h-48 items-center justify-center rounded-xl bg-blue-50 text-center font-bold text-blue-600">
                📍 {profile.cities?.name || "Tetovë"}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-7 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-black">
                Keni një projekt në mendje?
              </h3>
              <p className="mt-1 text-blue-100">
                Na kontaktoni për një ofertë falas dhe konsultim profesional.
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href={`tel:${profile.phone}`}
                className="rounded-xl bg-white px-8 py-4 font-bold text-blue-600"
              >
                Kërko Ofertë
              </a>
              <a
                href={`https://wa.me/${phoneDigits}`}
                className="rounded-xl bg-blue-500 px-8 py-4 font-bold text-white"
              >
                Na Kontaktoni
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}