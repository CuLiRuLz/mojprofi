"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Akaya_Kanadaka } from "next/font/google";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function DashboardProfilePage() {
  const router = useRouter();

  const [profileId, setProfileId] = useState<number | null>(null);
  const [profileSlug, setProfileSlug] = useState("");
  const [message, setMessage] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [cityId, setCityId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [about, setAbout] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [address, setAddress] = useState("");
  const [servicesText, setServicesText] = useState("");

  const [workingHoursWeekdays, setWorkingHoursWeekdays] = useState("");
  const [workingHoursSaturday, setWorkingHoursSaturday] = useState("");
  const [workingHoursSunday, setWorkingHoursSunday] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const [cities, setCities] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data: citiesData } = await supabase
        .from("cities")
        .select("*")
        .order("name", { ascending: true });

      setCities(citiesData || []);

      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      setCategories(categoriesData || []);

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setMessage("Nuk je i kyçur.");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userData.user.id)
        .single();

      if (profile) {
        setProfileId(profile.id);
        setProfileSlug(profile.slug ?? "");
        setCompanyName(profile.company_name ?? "");
        setPhone(profile.phone ?? "");
        setCityId(profile.city_id ? String(profile.city_id) : "");
        setAbout(profile.about ?? "");
        setExperienceYears(
          profile.experience_years ? String(profile.experience_years) : ""
        );

        setLogoUrl(profile.logo_url ?? "");
        setCoverUrl(profile.cover_url ?? "");

        setWebsiteUrl(profile.website_url ?? "");
        setFacebookUrl(profile.facebook_url ?? "");
        setInstagramUrl(profile.instagram_url ?? "");
        setTiktokUrl(profile.tiktok_url ?? "");
        setLinkedinUrl(profile.linkedin_url ?? "");
        setYoutubeUrl(profile.youtube_url ?? "");

        setAddress(profile.address ?? "");
        setServicesText(profile.services_text ?? "");

        setWorkingHoursWeekdays(profile.working_hours_weekdays ?? "");
        setWorkingHoursSaturday(profile.working_hours_saturday ?? "");
        setWorkingHoursSunday(profile.working_hours_sunday ?? "");

        const { data: profileCategory } = await supabase
          .from("profile_categories")
          .select("category_id")
          .eq("profile_id", profile.id)
          .eq("is_main", true)
          .single();

        if (profileCategory) {
          setCategoryId(String(profileCategory.category_id));
        }
      }
    }

    loadData();
  }, []);

  async function uploadImage(
    bucket: string,
    folder: string,
    file: File,
    id: number
  ) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, file);

    if (error) {
      setMessage(error.message);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("Nuk je i kyçur.");
      return;
    }

    let currentProfileId = profileId;

    const generatedSlug = createSlug(companyName);

    const accountType =
  userData.user.user_metadata?.account_type || "company";

const profilePayload = {
  user_id: userData.user.id,
  account_type: accountType,
  company_name: companyName,
  slug: generatedSlug,
      email: userData.user.email,
      phone,
      city_id: cityId ? Number(cityId) : null,
      about,
      experience_years: experienceYears ? Number(experienceYears) : null,
      website_url: websiteUrl,
      facebook_url: facebookUrl,
      instagram_url: instagramUrl,
      tiktok_url: tiktokUrl,
      linkedin_url: linkedinUrl,
      youtube_url: youtubeUrl,
      address,
      services_text: servicesText,
      working_hours_weekdays: workingHoursWeekdays,
      working_hours_saturday: workingHoursSaturday,
      working_hours_sunday: workingHoursSunday,
    };

    if (!currentProfileId) {
      const { data: newProfile, error } = await supabase
        .from("profiles")
        .insert(profilePayload)
        .select()
        .single();

      if (error || !newProfile) {
        setMessage(error?.message || "Profili nuk u krijua.");
        return;
      }

      currentProfileId = newProfile.id;
      setProfileId(newProfile.id);
      setProfileSlug(newProfile.slug ?? "");
    }

    let finalLogoUrl = logoUrl;
    let finalCoverUrl = coverUrl;

    if (logoFile && currentProfileId) {
      const uploadedLogo = await uploadImage(
        "company-logos",
        "logos",
        logoFile,
        currentProfileId
      );

      if (uploadedLogo) {
        finalLogoUrl = uploadedLogo;
        setLogoUrl(uploadedLogo);
      }
    }

    if (coverFile && currentProfileId) {
      const uploadedCover = await uploadImage(
        "company-covers",
        "covers",
        coverFile,
        currentProfileId
      );

      if (uploadedCover) {
        finalCoverUrl = uploadedCover;
        setCoverUrl(uploadedCover);
      }
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        ...profilePayload,
        logo_url: finalLogoUrl,
        cover_url: finalCoverUrl,
      })
      .eq("id", currentProfileId);

    if (updateError) {
      setMessage(updateError.message);
      return;
    }

    if (categoryId && currentProfileId) {
      await supabase
        .from("profile_categories")
        .delete()
        .eq("profile_id", currentProfileId)
        .eq("is_main", true);

      await supabase.from("profile_categories").insert({
        profile_id: currentProfileId,
        category_id: Number(categoryId),
        is_main: true,
      });
    }

    
    setProfileSlug(generatedSlug);
    setMessage("Profili u ruajt me sukses.");

    router.push(`/company/${generatedSlug}`);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black">Profili i Kompanisë</h1>
          <p className="mt-2 text-slate-600">
            Plotëso të dhënat që do të shfaqen në profilin publik.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-blue-50 p-4 font-semibold text-blue-700">
            <div>{message}</div>

            {profileSlug && (
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`/company/${profileSlug}`}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-white"
                >
                  Shiko profilin publik
                </a>

                <a
                  href="/dashboard/projects"
                  className="rounded-xl bg-white px-5 py-3 text-blue-600 shadow-sm"
                >
                  Shto Projekte
                </a>
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-8">
          <section className="rounded-2xl bg-white p-7 shadow-md">
            <h2 className="text-xl font-black">Të dhënat kryesore</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Emri i kompanisë"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefoni"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />

              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              >
                <option value="">Zgjidh qytetin</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              >
                <option value="">Zgjidh kategorinë kryesore</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="Vite eksperiencë"
                type="number"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />

              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adresa / lokacioni"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />
            </div>

            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Rreth kompanisë"
              rows={6}
              className="mt-5 w-full rounded-xl bg-slate-50 px-4 py-4 outline-none"
            />
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-md">
            <h2 className="text-xl font-black">Logo dhe Cover</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="font-bold">Logo</label>
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="mt-3 h-24 w-24 rounded-xl object-cover shadow"
                  />
                )}
                <input
                  type="file"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="mt-4 block w-full rounded-xl bg-slate-50 p-4"
                />
              </div>

              <div>
                <label className="font-bold">Cover / Banner</label>
                {coverUrl && (
                  <img
                    src={coverUrl}
                    alt="Cover"
                    className="mt-3 h-32 w-full rounded-xl object-cover shadow"
                  />
                )}
                <input
                  type="file"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="mt-4 block w-full rounded-xl bg-slate-50 p-4"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-md">
            <h2 className="text-xl font-black">Shërbimet</h2>
            <p className="mt-2 text-sm text-slate-500">
              Shkruaji shërbimet të ndara me presje.
            </p>

            <textarea
              value={servicesText}
              onChange={(e) => setServicesText(e.target.value)}
              placeholder="Ndërtim Shtëpish, Renovime, Fasada, Tavan & Gips, Suva & Lyerje"
              rows={4}
              className="mt-5 w-full rounded-xl bg-slate-50 px-4 py-4 outline-none"
            />
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-md">
            <h2 className="text-xl font-black">Website dhe rrjete sociale</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Website"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />

              <input
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="Facebook"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />

              <input
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="Instagram"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />

              <input
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="TikTok"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />

              <input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="LinkedIn"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />

              <input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="YouTube"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />
            </div>
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-md">
            <h2 className="text-xl font-black">Orari i punës</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <input
                value={workingHoursWeekdays}
                onChange={(e) => setWorkingHoursWeekdays(e.target.value)}
                placeholder="E Hënë - E Premte, p.sh. 08:00 - 17:00"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />

              <input
                value={workingHoursSaturday}
                onChange={(e) => setWorkingHoursSaturday(e.target.value)}
                placeholder="E Shtunë, p.sh. 08:00 - 14:00"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />

              <input
                value={workingHoursSunday}
                onChange={(e) => setWorkingHoursSunday(e.target.value)}
                placeholder="E Diel, p.sh. Mbyllur"
                className="rounded-xl bg-slate-50 px-4 py-4 outline-none"
              />
            </div>
          </section>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-10 py-4 font-black text-white shadow-md hover:bg-blue-700"
          >
            Ruaj Profilin
          </button>
                </form>
      </div>
    </main>
  </>
);
}