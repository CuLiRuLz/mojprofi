"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FavoriteButton from "@/app/company/[slug]/FavoriteButton";
import { supabase } from "@/lib/supabase";
import {
  MapPin,
  Trophy,
  Phone,
  MessageCircle,
  Star,
  Heart,
  Share2,
  CheckCircle,
  User,
  Briefcase,
  Mail,
  Calendar,
} from "lucide-react";

export default function PublicProfessionalPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [profile, setProfile] = useState<any>(null);
  const [cityName, setCityName] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .eq("account_type", "professional")
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setProfile(data);

      if (data.city_id) {
        const { data: cityData } = await supabase
          .from("cities")
          .select("name")
          .eq("id", data.city_id)
          .single();

        if (cityData) setCityName(cityData.name);
      }

      const { data: projectData } = await supabase
  .from("projects")
  .select(`
    id,
    title,
    description,
    created_at,
    project_photos (
      photo_url
    )
  `)
  .eq("profile_id", data.id)
  .order("created_at", { ascending: false })
  .limit(6);

      setProjects(projectData || []);

      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*")
        .eq("profile_id", data.id)
        .order("created_at", { ascending: false });

      setReviews(reviewData || []);

      setLoading(false);
    }

    loadProfile();
  }, [slug]);

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `${profile?.first_name} ${profile?.last_name} - MojProfi`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Linku u kopjua.");
    }
  }

  const fullName = `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim();

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 p-10 text-slate-700">
          Duke u ngarkuar...
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 p-10">
          <h1 className="text-2xl font-bold text-slate-900">Profili nuk u gjet</h1>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
        <div className="mx-auto max-w-7xl">
          {/* HERO */}
          <section
            className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-sm"
            style={{
              backgroundImage: profile.cover_url
                ? `linear-gradient(90deg, rgba(15,23,42,.82), rgba(15,23,42,.55)), url(${profile.cover_url})`
                : "linear-gradient(90deg, #0f172a, #334155)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="grid gap-8 px-8 py-8 md:grid-cols-[180px_1fr_240px] md:items-center">
              {/* Avatar */}
              <div className="flex justify-center md:justify-start">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white text-4xl font-black text-blue-600 shadow-xl">
                  {profile.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    fullName.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="text-white">
                <div className="mb-5 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
  <User size={16} />
  Mjeshtër i Pavarur
</span>

                  {profile.verified_level > 0 ? (
                    <span className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-1 text-xs font-semibold text-white">
  <CheckCircle size={16} />
  I Verifikuar
</span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-3 py-1 text-xs font-semibold text-white">
  Pa Verifikim
</span>
                  )}
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                  {fullName}
                </h1>

                <p className="mt-1 text-base font-medium text-white/90">
                  {profile.profession || "Profesionist"}
                </p>

                <div className="mt-5 flex flex-wrap gap-6 text-sm font-medium text-white/90">
                  {cityName && (
                    <span className="flex items-center gap-2">
                      <MapPin size={18} />
                      {cityName}, Maqedonia e Veriut
                    </span>
                  )}

                  {profile.experience_years && (
                    <span className="flex items-center gap-2">
                      <Trophy size={18} className="text-yellow-400" />
                      {profile.experience_years} vite përvojë
                    </span>
                  )}
                </div>

                <div className="mt-6 grid max-w-lg grid-cols-3 rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-lg font-black">
                      <Star size={20} className="fill-yellow-400 text-yellow-400" />
                      {averageRating}
                    </div>
                    <p className="mt-1 text-xs text-white/80">Vlerësim</p>
                  </div>

                  <div className="border-x border-white/20 text-center">
                    <div className="text-lg font-black">{reviews.length}</div>
                    <p className="mt-1 text-xs text-white/80">Vlerësime</p>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-black">
                      {profile.experience_years || 0}
                    </div>
                    <p className="mt-1 text-xs text-white/80">Vite</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700"
                  >
                    <Phone size={20} />
                    Telefono
                  </a>
                )}

                {profile.phone && (
                  <a
                    href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-green-700"
                  >
                    <MessageCircle size={20} />
                    WhatsApp
                  </a>
                )}

                <div className="flex gap-3 justify-center">
                  <FavoriteButton profileId={profile.id} />

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm"
                  >
                    <Share2 size={18} />
Shpërndaj
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/* TABS */}
          <section className="rounded-b-3xl bg-white shadow-sm">
            <div className="grid grid-cols-4 text-center text-sm font-semibold text-slate-600">
              <a href="#summary" className="border-b-4 border-blue-600 px-4 py-5 text-blue-600">
                Përmbledhje
              </a>
              <a href="#projects" className="px-4 py-5">
                Projektet
              </a>
              <a href="#reviews" className="px-4 py-5">
                Vlerësimet ({reviews.length})
              </a>
              <a href="#contact" className="px-4 py-5">
                Kontakti
              </a>
            </div>
          </section>

          {/* CONTENT */}
          <section id="summary" className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black">Rreth Profesionistit</h2>

              <p className="mt-4 leading-relaxed text-slate-700">
                {profile.about || "Ky profesionist ende nuk ka shtuar përshkrim."}
              </p>

              <div className="mt-8 grid gap-3 text-slate-700 sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-600" />
                  Punë profesionale
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-600" />
                  Përgjigje e shpejtë
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-600" />
                  Përvojë në terren
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-600" />
                  Kontakt direkt
                </p>
              </div>

              <div id="projects" className="mt-10 border-t pt-8">
                <h3 className="text-xl font-black">Punët e Fundit</h3>

                {projects.length === 0 ? (
                  <p className="mt-4 text-slate-500">
                    Ky profesionist ende nuk ka shtuar projekte.
                  </p>
                ) : (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                      <a
                        key={project.id}
                        href={`/project/${project.id}`}
                        className="block rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="h-32 overflow-hidden rounded-xl bg-slate-200">
                          {project.project_photos?.[0]?.photo_url ? (
                            <img
                              src={project.project_photos[0].photo_url}
                              alt={project.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <Briefcase size={32} />
                            </div>
                          )}
                        </div>

                        <h4 className="mt-4 font-bold text-slate-900">
                          {project.title}
                        </h4>

                        {project.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                            {project.description}
                          </p>
                        )}

                        <div className="mt-3 text-sm font-semibold text-blue-600">
                          Shiko projektin →
                        </div>
                      </a>
                    ))}
                  </div>
                )}

              </div>

              <div id="reviews" className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
                <h3 className="text-xl font-black">Vlerësimet</h3>
                {reviews.length === 0 ? (
                  <p className="mt-4 text-slate-500">
                    Ky profesionist ende nuk ka vlerësime.
                  </p>
                ) : null}
              </div>

            </div>

            {/* CONTACT CARD */}
            <aside id="contact" className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black">Informacion Kontakti</h2>

              <div className="mt-6 space-y-5 text-slate-700">
                {profile.phone && (
                  <p className="flex items-center gap-3">
                    <Phone size={19} className="text-slate-500" />
                    {profile.phone}
                  </p>
                )}

                {profile.phone && (
                  <p className="flex items-center gap-3">
                    <MessageCircle size={19} className="text-slate-500" />
                    {profile.phone}
                  </p>
                )}

                {profile.email && (
                  <p className="flex items-center gap-3 break-all">
                    <Mail size={19} className="text-slate-500" />
                    {profile.email}
                  </p>
                )}

                {cityName && (
                  <p className="flex items-center gap-3">
                    <MapPin size={19} className="text-slate-500" />
                    {cityName}, Maqedonia e Veriut
                  </p>
                )}
              </div>

              <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
                <div className="flex items-center gap-3 font-bold text-green-700">
                  <CheckCircle size={22} />
                  {profile.verified_level > 0
                    ? "Profil i verifikuar"
                    : "Profil pa verifikim"}
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  {profile.verified_level > 0
                    ? "Ky profil është verifikuar nga ekipi MojProfi."
                    : "Ky profil ende nuk është verifikuar nga ekipi MojProfi."}
                </p>
              </div>

              <div className="mt-8 space-y-4 border-t pt-6 text-sm text-slate-700">
                <div className="flex justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <Calendar size={17} />
                    Anëtar që nga
                  </span>
                  <strong>
                    {profile.created_at
                      ? new Date(profile.created_at).getFullYear()
                      : "2026"}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Përgjigjet shpejt</span>
                  <strong>Po</strong>
                </div>

                {cityName && (
                  <div className="flex justify-between gap-4">
                    <span>Punon në</span>
                    <strong>{cityName}</strong>
                  </div>
                )}
             </div>
</aside>
</section>
        </div>
      </main>
    </>
  );
}