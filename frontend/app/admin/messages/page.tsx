"use client";

import { useEffect, useState } from "react";
import { Eye, Mail, MailOpen, Trash2, Reply, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setMessages((data as Message[]) || []);
    setLoading(false);
  }

  async function openMessage(msg: Message) {
    setSelected(msg);

    if (!msg.is_read) {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", msg.id);

      if (!error) {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === msg.id ? { ...item, is_read: true } : item
          )
        );

        window.dispatchEvent(new Event("contact-messages-updated"));
      }
    }
  }

  async function deleteMessage(id: number) {
    const confirmed = confirm("A dëshironi ta fshini këtë mesazh?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setMessages((prev) => prev.filter((item) => item.id !== id));
    window.dispatchEvent(new Event("contact-messages-updated"));
  }

  return (
    <div className="px-8 py-7">
      <h1 className="text-2xl font-black">Mesazhet</h1>

      <p className="mt-1 text-sm text-slate-500">
        Këtu shfaqen mesazhet që vijnë nga faqja Kontakt.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <p className="py-8 text-center text-slate-500">
            Duke ngarkuar mesazhet...
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 font-bold">Statusi</th>
                <th className="py-3 font-bold">Emri</th>
                <th className="py-3 font-bold">Email</th>
                <th className="py-3 font-bold">Subjekti</th>
                <th className="py-3 font-bold">Mesazhi</th>
                <th className="py-3 font-bold">Data</th>
                <th className="py-3 font-bold">Veprimet</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="py-4">
                    {msg.is_read ? (
                      <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        <MailOpen size={14} />
                        Lexuar
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
                        <Mail size={14} />
                        I ri
                      </span>
                    )}
                  </td>

                  <td className="py-4 font-bold text-slate-900">{msg.name}</td>
                  <td className="py-4 text-slate-600">{msg.email}</td>
                  <td className="py-4 font-semibold text-slate-800">
                    {msg.subject}
                  </td>

                  <td className="max-w-[360px] truncate py-4 text-slate-600">
                    {msg.message}
                  </td>

                  <td className="py-4 text-slate-600">
                    {new Date(msg.created_at).toLocaleDateString("sq-AL")}
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openMessage(msg)}
                        className="inline-flex rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                        title="Shiko mesazhin"
                      >
                        <Eye size={15} />
                      </button>

                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                          msg.subject
                        )}`}
                        className="inline-flex rounded-lg bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100"
                        title="Përgjigju"
                      >
                        <Reply size={15} />
                      </a>

                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="inline-flex rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        title="Fshij mesazhin"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {messages.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Nuk ka mesazhe për momentin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black">{selected.subject}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Nga: <span className="font-semibold">{selected.name}</span> ·{" "}
                  {selected.email}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 max-h-[55vh] overflow-y-auto whitespace-pre-wrap pr-3 text-sm leading-7 text-slate-700">
  {selected.message}
</div>

            <div className="mt-6 flex justify-between">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(
                  selected.subject
                )}`}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <Reply size={16} />
                Përgjigju
              </a>

              <button
                onClick={() => setSelected(null)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
              >
                Mbyll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}