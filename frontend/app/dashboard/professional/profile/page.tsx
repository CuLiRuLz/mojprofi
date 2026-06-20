"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function createSlug(firstName: string, lastName: string) {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function ProfessionalProfilePage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [about, setAbout] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState(""); 
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: categoriesData } = await supabase
  .from("categories")
  .select("*")
  .order("name", { ascending: true });

setCategories(categoriesData || []);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (profile) {
        if (profile.account_type !== "professional") {
          router.push("/dashboard/company/profile");
          return;
        }
        setLogoUrl(profile.logo_url || "");
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
        setProfession(profile.profession || "");
        setPhone(profile.phone || "");
        setCity(profile.city_id ? String(profile.city_id) : "");
        setAbout(profile.about || "");
        setExperienceYears(
          profile.experience_years ? String(profile.experience_years) : ""
        );
      }

      if (!profile) {
  setMessage("Profili nuk u gjet. Ju lutem plotësoni regjistrimin fillimisht.");
  return;
}

      const { data: mainCategory } = await supabase
  .from("profile_categories")
  .select("category_id")
  .eq("profile_id", profile.id)
  .eq("is_main", true)
  .maybeSingle();

if (mainCategory) {
  setCategory(String(mainCategory.category_id));
}

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setMessage("Duhet të kyçesh.");
        return;
      }

      const generatedSlug = createSlug(firstName, lastName);

let finalLogoUrl = logoUrl;

if (logoFile) {
  const fileExt = logoFile.name.split(".").pop();
  const fileName = `professionals/${userData.user.id}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("company-logos")
    .upload(fileName, logoFile, {
      upsert: true,
    });

  if (uploadError) {
    setMessage(uploadError.message);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("company-logos")
    .getPublicUrl(fileName);

  finalLogoUrl = publicUrlData.publicUrl;
}

      const profilePayload = {
  user_id: userData.user.id,
  account_type: "professional",
  first_name: firstName,
  last_name: lastName,
  profession: "Puntor Privat",
  phone,
  city_id: city ? Number(city) : null,
  about,
  experience_years: experienceYears ? Number(experienceYears) : null,
  slug: generatedSlug,
  email: userData.user.email,
  logo_url: finalLogoUrl,
};

      const { error } = await supabase
        .from("profiles")
        .upsert(profilePayload, {
          onConflict: "user_id",
        });

      if (error) {
        setMessage(error.message);
        return;
      }
      const { data: savedProfile } = await supabase
  .from("profiles")
  .select("id")
  .eq("user_id", userData.user.id)
  .maybeSingle();

if (savedProfile && category) {
  await supabase
    .from("profile_categories")
    .delete()
    .eq("profile_id", savedProfile.id)
    .eq("is_main", true);

  const { error: categoryError } = await supabase
    .from("profile_categories")
    .insert({
      profile_id: savedProfile.id,
      category_id: Number(category),
      is_main: true,
    });

  if (categoryError) {
    setMessage(categoryError.message);
    return;
  }
}


      router.push(`/professional/${generatedSlug}`);
    } catch {
      setMessage("Ndodhi një gabim.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-slate-50 p-10 text-slate-700">
          Duke ngarkuar profilin...
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-black">Profili i Profesionistit</h1>

          <p className="mt-2 text-slate-600">
            Plotëso ose ndrysho të dhënat që shfaqen në profilin tënd publik.
          </p>

          <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-black">Të dhënat kryesore</h2>

            <div className="mb-6 flex items-center gap-5">
  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-3xl font-black text-blue-600">
    {logoUrl ? (
      <img
        src={logoUrl}
        alt="Foto profili"
        className="h-full w-full object-cover"
      />
    ) : (
      firstName?.charAt(0) || "P"
    )}
  </div>

  <div>
    <p className="mb-2 text-sm font-bold text-slate-700">Foto profili</p>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLogoFile(file);
        setLogoUrl(URL.createObjectURL(file));
      }}
      className="text-sm"
    />
  </div>
</div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-slate-200 px-5 py-4"
                placeholder="Emri"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <input
                className="rounded-2xl border border-slate-200 px-5 py-4"
                placeholder="Mbiemri"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />

              <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full rounded-xl border border-slate-200 px-4 py-3"
>
  <option value="">Zgjidh kategorinë</option>

  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>

              <input
                className="rounded-2xl border border-slate-200 px-5 py-4"
                placeholder="Telefoni"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <select
                className="rounded-2xl border border-slate-200 px-5 py-4"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Zgjidh qytetin</option>
                <option value="1">Tetovë</option>
                <option value="2">Gostivar</option>
                <option value="3">Shkup</option>
                <option value="4">Kumanovë</option>
                <option value="5">Kërçovë</option>
                <option value="6">Strugë</option>
                <option value="7">Dibër</option>
                <option value="8">Ohër</option>
                <option value="9">Prilep</option>
                <option value="10">Manastir</option>
                <option value="11">Veles</option>
                <option value="12">Shtip</option>
              </select>

              <input
                className="rounded-2xl border border-slate-200 px-5 py-4"
                placeholder="Vite eksperiencë"
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
            </div>

            <textarea
              className="mt-4 min-h-40 w-full rounded-2xl border border-slate-200 px-5 py-4"
              placeholder="Rreth teje"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-6 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white disabled:opacity-60"
            >
              {saving ? "Duke ruajtur..." : "Ruaj Profilin"}
            </button>

            {message && <p className="mt-4 text-sm font-medium">{message}</p>}
          </section>
        </div>
      </main>
    </>
  );
}