"use client";

import { useEffect, useState } from "react";
import { Save, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Settings = {
  id: number;
  platform_name: string | null;
  platform_slogan: string | null;
  platform_logo_url: string | null;
  homepage_hero_url: string | null;
  favicon_url: string | null;

  homepage_hero_title: string | null;
  homepage_hero_subtitle: string | null;
  homepage_cta_text: string | null;

  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;

  registrations_enabled: boolean | null;
  reviews_enabled: boolean | null;
  reports_enabled: boolean | null;
  maintenance_mode: boolean | null;
  public_profiles_enabled: boolean | null;
  manual_approval_enabled: boolean | null;

  homepage_verified_limit: number | null;
  homepage_projects_limit: number | null;
  search_results_limit: number | null;

  meta_title: string | null;
  meta_description: string | null;

  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;

  support_email: string | null;
  support_whatsapp: string | null;
  contact_text: string | null;

  footer_copyright: string | null;
  footer_email: string | null;
  footer_phone: string | null;
  footer_facebook: string | null;
  footer_instagram: string | null;
  footer_tiktok: string | null;

  show_categories: boolean | null;
  show_companies: boolean | null;
  show_projects: boolean | null;
  show_how_it_works: boolean | null;
  show_cta: boolean | null;

  maintenance_message: string | null;

  message_after_registration: string | null;
  message_pending_approval: string | null;
  message_profile_approved: string | null;
  message_profile_rejected: string | null;

  premium_enabled: boolean | null;
  ads_enabled: boolean | null;
  featured_enabled: boolean | null;
  level_1_price: string | null;
  level_2_price: string | null;
  level_3_price: string | null;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data, error } = await supabase
      .from("platform_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setSettings(data as Settings);
    setLoading(false);
  }

  function updateField<K extends keyof Settings>(key: K, value: Settings[K]) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  async function uploadImage(
    file: File,
    field: "platform_logo_url" | "homepage_hero_url" | "favicon_url"
  ) {
    if (!settings) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `platform/${field}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("company-logos")
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("company-logos")
      .getPublicUrl(fileName);

    updateField(field, data.publicUrl);
  }

  async function saveSettings() {
    if (!settings) return;

    setSaving(true);

    const { id, ...dataToUpdate } = settings;

    const { error } = await supabase
      .from("platform_settings")
      .update(dataToUpdate)
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("Gabim: " + error.message);
      return;
    }

    alert("Cilësimet u ruajtën me sukses.");
  }

  if (loading) return <div className="px-8 py-7">Duke u ngarkuar...</div>;
  if (!settings) return <div className="px-8 py-7">Nuk u gjetën cilësimet.</div>;

  return (
    <div className="px-8 py-7">
      <h1 className="text-2xl font-black">Cilësimet</h1>
      <p className="mt-1 text-sm text-slate-500">
        Menaxho cilësimet kryesore të platformës MojProfi.
      </p>

      <div className="mt-6 space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">1. Branding</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input label="Emri i platformës" value={settings.platform_name} onChange={(v) => updateField("platform_name", v)} />
              <Input label="Slogani" value={settings.platform_slogan} onChange={(v) => updateField("platform_slogan", v)} />
              <Input label="Email kontakti" value={settings.contact_email} onChange={(v) => updateField("contact_email", v)} />
              <Input label="Telefoni" value={settings.contact_phone} onChange={(v) => updateField("contact_phone", v)} />
              <Input label="WhatsApp" value={settings.whatsapp_number} onChange={(v) => updateField("whatsapp_number", v)} />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <UploadBox label="Logo e platformës" imageUrl={settings.platform_logo_url} onUpload={(file) => uploadImage(file, "platform_logo_url")} />
              <UploadBox label="Favicon" imageUrl={settings.favicon_url} onUpload={(file) => uploadImage(file, "favicon_url")} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">2. Homepage</h2>

            <div className="mt-5 grid gap-4">
              <Input label="Hero title" value={settings.homepage_hero_title} onChange={(v) => updateField("homepage_hero_title", v)} />
              <Input label="Hero subtitle" value={settings.homepage_hero_subtitle} onChange={(v) => updateField("homepage_hero_subtitle", v)} />
              <Input label="Teksti i butonit" value={settings.homepage_cta_text} onChange={(v) => updateField("homepage_cta_text", v)} />
              <UploadBox label="Hero banner / foto kryesore" imageUrl={settings.homepage_hero_url} onUpload={(file) => uploadImage(file, "homepage_hero_url")} />
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">3. Kontrolli i platformës</h2>

            <div className="mt-5 grid gap-3">
              <Toggle label="Regjistrimet" checked={settings.registrations_enabled} onChange={(v) => updateField("registrations_enabled", v)} />
              <Toggle label="Profile publike" checked={settings.public_profiles_enabled} onChange={(v) => updateField("public_profiles_enabled", v)} />
              <Toggle label="Reviews / Vlerësimet" checked={settings.reviews_enabled} onChange={(v) => updateField("reviews_enabled", v)} />
              <Toggle label="Raportimet" checked={settings.reports_enabled} onChange={(v) => updateField("reports_enabled", v)} />
              <Toggle label="Aprovim manual" checked={settings.manual_approval_enabled} onChange={(v) => updateField("manual_approval_enabled", v)} />
              <Toggle label="Maintenance mode" checked={settings.maintenance_mode} onChange={(v) => updateField("maintenance_mode", v)} />
            </div>

            <div className="mt-5">
              <Textarea label="Mesazhi i mirëmbajtjes" value={settings.maintenance_message} onChange={(v) => updateField("maintenance_message", v)} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">4. Homepage Sections</h2>

            <div className="mt-5 grid gap-3">
              <Toggle label="Shfaq Kategoritë" checked={settings.show_categories} onChange={(v) => updateField("show_categories", v)} />
              <Toggle label="Shfaq Kompanitë" checked={settings.show_companies} onChange={(v) => updateField("show_companies", v)} />
              <Toggle label="Shfaq Projektet" checked={settings.show_projects} onChange={(v) => updateField("show_projects", v)} />
              <Toggle label="Shfaq Si funksionon" checked={settings.show_how_it_works} onChange={(v) => updateField("show_how_it_works", v)} />
              <Toggle label="Shfaq CTA" checked={settings.show_cta} onChange={(v) => updateField("show_cta", v)} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">5. Monetizimi</h2>

            <div className="mt-5 grid gap-3">
              <Toggle label="Premium aktiv" checked={settings.premium_enabled} onChange={(v) => updateField("premium_enabled", v)} />
              <Toggle label="Reklama aktive" checked={settings.ads_enabled} onChange={(v) => updateField("ads_enabled", v)} />
              <Toggle label="Featured kompani" checked={settings.featured_enabled} onChange={(v) => updateField("featured_enabled", v)} />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Input label="Level 1" value={settings.level_1_price} onChange={(v) => updateField("level_1_price", v)} />
              <Input label="Level 2" value={settings.level_2_price} onChange={(v) => updateField("level_2_price", v)} />
              <Input label="Level 3" value={settings.level_3_price} onChange={(v) => updateField("level_3_price", v)} />
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black">6. Kufizimet e platformës</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <NumberInput
              label="Kompani në homepage"
              description="Sa kompani të verifikuara shfaqen në faqen kryesore."
              value={settings.homepage_verified_limit}
              onChange={(v) => updateField("homepage_verified_limit", v)}
            />

            <NumberInput
              label="Projekte në homepage"
              description="Sa projekte të fundit shfaqen në homepage."
              value={settings.homepage_projects_limit}
              onChange={(v) => updateField("homepage_projects_limit", v)}
            />

            <NumberInput
              label="Rezultate në kërkim"
              description="Sa rezultate shfaqen në faqen e kërkimit."
              value={settings.search_results_limit}
              onChange={(v) => updateField("search_results_limit", v)}
            />
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">7. Kontakt & Mbështetje</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input label="Email support" value={settings.support_email} onChange={(v) => updateField("support_email", v)} />
              <Input label="WhatsApp support" value={settings.support_whatsapp} onChange={(v) => updateField("support_whatsapp", v)} />
              <Input label="Facebook" value={settings.facebook_url} onChange={(v) => updateField("facebook_url", v)} />
              <Input label="Instagram" value={settings.instagram_url} onChange={(v) => updateField("instagram_url", v)} />
              <Input label="TikTok" value={settings.tiktok_url} onChange={(v) => updateField("tiktok_url", v)} />
              <Input label="YouTube" value={settings.youtube_url} onChange={(v) => updateField("youtube_url", v)} />
            </div>

            <div className="mt-5">
              <Textarea label="Teksti i kontaktit" value={settings.contact_text} onChange={(v) => updateField("contact_text", v)} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">8. Footer</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input label="Copyright" value={settings.footer_copyright} onChange={(v) => updateField("footer_copyright", v)} />
              <Input label="Footer email" value={settings.footer_email} onChange={(v) => updateField("footer_email", v)} />
              <Input label="Footer telefon" value={settings.footer_phone} onChange={(v) => updateField("footer_phone", v)} />
              <Input label="Footer Facebook" value={settings.footer_facebook} onChange={(v) => updateField("footer_facebook", v)} />
              <Input label="Footer Instagram" value={settings.footer_instagram} onChange={(v) => updateField("footer_instagram", v)} />
              <Input label="Footer TikTok" value={settings.footer_tiktok} onChange={(v) => updateField("footer_tiktok", v)} />
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">9. SEO</h2>

            <div className="mt-5 grid gap-4">
              <Input label="Meta title" value={settings.meta_title} onChange={(v) => updateField("meta_title", v)} />
              <Textarea label="Meta description" value={settings.meta_description} onChange={(v) => updateField("meta_description", v)} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">10. Mesazhe automatike</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Textarea label="Pas regjistrimit" value={settings.message_after_registration} onChange={(v) => updateField("message_after_registration", v)} />
              <Textarea label="Në pritje të aprovimit" value={settings.message_pending_approval} onChange={(v) => updateField("message_pending_approval", v)} />
              <Textarea label="Profili u aprovua" value={settings.message_profile_approved} onChange={(v) => updateField("message_profile_approved", v)} />
              <Textarea label="Profili u refuzua" value={settings.message_profile_rejected} onChange={(v) => updateField("message_profile_rejected", v)} />
            </div>
          </section>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-500"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  description?: string;
}) {
  const current = value || 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-800">{label}</p>
      {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, current - 1))}
          className="h-9 w-9 rounded-lg bg-white font-black text-slate-700 shadow-sm hover:bg-slate-100"
        >
          -
        </button>

        <input
          type="number"
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-9 w-20 rounded-lg border border-slate-300 bg-white text-center text-sm font-bold outline-none focus:border-blue-500"
        />

        <button
          type="button"
          onClick={() => onChange(current + 1)}
          className="h-9 w-9 rounded-lg bg-white font-black text-slate-700 shadow-sm hover:bg-slate-100"
        >
          +
        </button>
      </div>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean | null;
  onChange: (v: boolean) => void;
}) {
  const active = Boolean(checked);

  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100"
    >
      <span className="text-sm font-black text-slate-800">{label}</span>

      <span className={`relative h-6 w-11 rounded-full transition ${active ? "bg-blue-600" : "bg-slate-300"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${active ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

function UploadBox({
  label,
  imageUrl,
  onUpload,
}: {
  label: string;
  imageUrl: string | null;
  onUpload: (file: File) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={label}
            className="mb-3 h-28 w-full rounded-lg object-cover"
          />
        )}

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-100">
          <Upload size={16} />
          Ngarko foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </label>
      </div>
    </label>
  );
}