import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProjectGallery from "./ProjectGallery";
import {
  Building2,
  Camera,
  MapPin,
  Phone,
  UserRound,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

export const runtime = "edge";

type PageProps = {
  params: Promise<{ id: string }>;
};

function getProfileName(profile: any) {
  if (!profile) return "Profil";

  if (profile.account_type === "company") {
    return profile.company_name || "Kompani";
  }

  return (
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    "Profesionist"
  );
}

function getProfileLink(profile: any) {
  if (!profile?.slug) return "#";

  if (profile.account_type === "professional") {
    return `/professional/${profile.slug}`;
  }

  return `/company/${profile.slug}`;
}

function getProfileType(profile: any) {
  if (profile?.account_type === "professional") return "Profesionist";
  return "Kompani";
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  const { data: project } = await supabase
    .from("projects")
    .select(`
      *,
      profiles(
        id,
        slug,
        account_type,
        company_name,
        first_name,
        last_name,
        email,
        phone,
        logo_url,
        cities(name)
      ),
      project_photos(*)
    `)
    .eq("id", id)
    .single();

  if (!project) {
    return (
      <main className="min-h-screen bg-white p-10">
        <h1 className="text-3xl font-black">Projekti nuk u gjet</h1>
      </main>
    );
  }

  const profile = project.profiles;
  const profileName = getProfileName(profile);
  const profileLink = getProfileLink(profile);
  const profileType = getProfileType(profile);
  const cityName = profile?.cities?.name || "Pa qytet";
  const photoCount = project.project_photos?.length || 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.45fr_0.65fr]">
            <div className="p-8">
              <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                  {profile?.account_type === "professional" ? (
                    <UserRound size={14} />
                  ) : (
                    <Building2 size={14} />
                  )}
                  {profileType}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  <MapPin size={14} />
                  {cityName}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  <Camera size={14} />
                  {photoCount} foto
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900">
                {project.title}
              </h1>

              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
                {project.description || "Ky projekt nuk ka përshkrim."}
              </p>
            </div>

            <aside className="border-t border-slate-200 bg-slate-50 p-6 lg:border-l lg:border-t-0">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                Projekti nga
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-base font-black">
                  {profile?.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt={profileName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profileName.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-black leading-tight">
                    {profileName}
                  </h2>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">
                    {profileType} · {cityName}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                <Link
                  href={profileLink}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  <ExternalLink size={15} />
                  Shiko profilin
                </Link>

                {profile?.phone && (
                  <>
                    <a
                      href={`tel:${profile.phone}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50"
                    >
                      <Phone size={15} />
                      Telefon
                    </a>

                    <a
                      href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                    >
                      <MessageCircle size={15} />
                      WhatsApp
                    </a>
                  </>
                )}
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black">Galeria e projektit</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Fotot e publikuara për këtë projekt.
              </p>
            </div>
          </div>

          <div className="mt-6">
            {photoCount > 0 ? (
              <ProjectGallery
                photos={project.project_photos}
                title={project.title}
              />
            ) : project.photo_url ? (
              <img
                src={project.photo_url}
                alt={project.title}
                className="h-80 w-full rounded-2xl object-cover shadow-sm"
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                Ky projekt nuk ka foto ende.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}