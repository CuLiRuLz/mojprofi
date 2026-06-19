"use client";

import { useState } from "react";
import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
    });

    setLoading(false);

    if (error) {
      alert("Gabim gjatë dërgimit të mesazhit.");
      return;
    }

    setSuccess(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Na Kontaktoni
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Keni pyetje, sugjerime ose dëshironi të raportoni një problem?
            Ekipi i MojProfi është këtu për t&apos;ju ndihmuar.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <ContactCard
            icon={<Mail size={24} />}
            color="bg-blue-100 text-blue-600"
            title="Email"
            text="Për pyetje dhe mbështetje."
            value="info@mojprofi.com"
          />

          <ContactCard
            icon={<MessageCircle size={24} />}
            color="bg-emerald-100 text-emerald-600"
            title="WhatsApp"
            text="Mbështetje e shpejtë."
            value="Së shpejti"
          />

          <ContactCard
            icon={<MapPin size={24} />}
            color="bg-purple-100 text-purple-600"
            title="Lokacioni"
            text="Platformë online për Maqedoninë e Veriut."
            value="Tetovë • Gostivar • Shkup"
          />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black">Dërgo një mesazh</h2>

            <p className="mt-2 text-sm text-slate-500">
              Plotësoni formularin dhe do t&apos;ju kontaktojmë sa më shpejt.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <InputField
                label="Emri"
                value={name}
                onChange={setName}
                placeholder="Shkruani emrin tuaj"
                type="text"
              />

              <InputField
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="email@example.com"
                type="email"
              />

              <InputField
                label="Subjekti"
                value={subject}
                onChange={setSubject}
                placeholder="Subjekti i mesazhit"
                type="text"
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Mesazhi
                </label>

                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Shkruani mesazhin tuaj..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                />
              </div>

              {success && (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  Mesazhi u dërgua me sukses. Do t&apos;ju kontaktojmë së
                  shpejti.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />
                {loading ? "Duke dërguar..." : "Dërgo Mesazhin"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <HelpCircle size={20} />
              </div>

              <h2 className="text-xl font-black">Pyetje të shpeshta</h2>
            </div>

            <div className="mt-8 space-y-6">
              <FaqItem
                title="Si mund ta regjistroj kompaninë?"
                text='Klikoni "Regjistro Kompaninë" dhe plotësoni informacionet bazë.'
              />

              <FaqItem
                title="Si mund të ndryshoj profilin?"
                text="Hyni në llogarinë tuaj dhe përdorni Dashboard-in për editim."
              />

              <FaqItem
                title="Si mund të raportoj një profil?"
                text="Përdorni opsionin e raportimit në profilin përkatës."
              />
            </div>
          </div>
        </div>

        <section className="mt-16 rounded-3xl bg-slate-900 px-8 py-12 text-center text-white">
          <h2 className="text-3xl font-black">
            Gjej profesionistin e duhur për projektin tënd
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            MojProfi ju ndihmon të gjeni kompani dhe profesionistë të verifikuar
            në Maqedoninë e Veriut.
          </p>
        </section>
      </section>
    </main>
  );
}

function ContactCard({
  icon,
  color,
  title,
  text,
  value,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  text: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-black">{title}</h3>

      <p className="mt-2 text-sm text-slate-500">{text}</p>

      <p className="mt-4 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
      />
    </div>
  );
}

function FaqItem({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </div>
  );
}