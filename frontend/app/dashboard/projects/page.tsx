"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const MAX_PROJECTS = 5;
const MAX_PHOTOS = 5;

export default function DashboardProjectsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function getMyProfile() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("Nuk je i kyçur.");
      return null;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, company_name, first_name, last_name, slug, account_type")
      .eq("user_id", userData.user.id)
      .single();

    if (error || !profile) {
      setMessage("Profili nuk u gjet.");
      return null;
    }

    return profile;
  }

  async function loadProjects() {
    const profile = await getMyProfile();
    if (!profile) return;

    setCompany(profile);

    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        project_photos(*)
      `)
      .eq("profile_id", profile.id)
      .order("id", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setProjects(data || []);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setPhotoFiles([]);
    setEditingProject(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSelectPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    const remainingSlots = MAX_PHOTOS - photoFiles.length;

    if (remainingSlots <= 0) {
      setMessage("Maksimumi 5 foto për projekt.");
      e.target.value = "";
      return;
    }

    const allowedFiles = selectedFiles.slice(0, remainingSlots);
    const newFiles = [...photoFiles, ...allowedFiles];

    setPhotoFiles(newFiles);

    if (selectedFiles.length > remainingSlots) {
      setMessage(`Mund të shtoni maksimumi ${MAX_PHOTOS} foto. U morën vetëm fotot që lejohen.`);
    } else {
      setMessage("");
    }

    e.target.value = "";
  }

  function removeSelectedPhoto(index: number) {
    setPhotoFiles((currentFiles) =>
      currentFiles.filter((_, fileIndex) => fileIndex !== index)
    );
  }

  async function uploadProjectPhotos(projectId: number, profileId: number) {
    if (photoFiles.length === 0) return null;

    let firstPhotoUrl: string | null = null;

    for (const file of photoFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${profileId}-${projectId}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("project-photos")
        .upload(filePath, file);

      if (uploadError) {
        setMessage(uploadError.message);
        return null;
      }

      const { data } = supabase.storage
        .from("project-photos")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      if (!firstPhotoUrl) {
        firstPhotoUrl = publicUrl;
      }

      const { error: photoInsertError } = await supabase
        .from("project_photos")
        .insert({
          project_id: projectId,
          photo_url: publicUrl,
        });

      if (photoInsertError) {
        setMessage(photoInsertError.message);
        return null;
      }
    }

    return firstPhotoUrl;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (isSaving) return;

    setMessage("");

    if (!title.trim()) {
      setMessage("Shkruaje titullin e projektit.");
      return;
    }

    if (photoFiles.length > MAX_PHOTOS) {
      setMessage("Maksimumi 5 foto për projekt.");
      return;
    }

    if (!editingProject && projects.length >= MAX_PROJECTS) {
      setMessage("Mund të shtoni maksimumi 5 projekte.");
      return;
    }

    setIsSaving(true);
    setMessage("Ju lutem prisni, projekti po ruhet...");

    try {
      const profile = await getMyProfile();
      if (!profile) return;

      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update({
            title,
            description,
          })
          .eq("id", editingProject.id);

        if (error) {
          setMessage(error.message);
          return;
        }

        const firstPhotoUrl = await uploadProjectPhotos(
          editingProject.id,
          profile.id
        );

        if (photoFiles.length > 0 && !firstPhotoUrl) return;

        if (firstPhotoUrl && !editingProject.photo_url) {
          await supabase
            .from("projects")
            .update({
              photo_url: firstPhotoUrl,
            })
            .eq("id", editingProject.id);
        }

        setMessage("Projekti u përditësua me sukses.");
      } else {
        const { data: newProject, error } = await supabase
          .from("projects")
          .insert({
            profile_id: profile.id,
            title,
            description,
          })
          .select()
          .single();

        if (error || !newProject) {
          setMessage(error?.message || "Projekti nuk u ruajt.");
          return;
        }

        const firstPhotoUrl = await uploadProjectPhotos(newProject.id, profile.id);

        if (photoFiles.length > 0 && !firstPhotoUrl) return;

        if (firstPhotoUrl) {
          await supabase
            .from("projects")
            .update({
              photo_url: firstPhotoUrl,
            })
            .eq("id", newProject.id);
        }

        setMessage("Projekti u ruajt me sukses.");
      }

      resetForm();
      await loadProjects();
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(project: any) {
    setEditingProject(project);
    setTitle(project.title || "");
    setDescription(project.description || "");
    setPhotoFiles([]);
    setMessage("Tani je duke edituar këtë projekt.");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleDelete(projectId: any) {
    if (isSaving) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      setMessage(error.message);
      return;
    }

    resetForm();
    setMessage("Projekti u fshi me sukses.");
    await loadProjects();
  }

  const profileName =
    company?.account_type === "professional"
      ? `${company?.first_name || ""} ${company?.last_name || ""}`.trim()
      : company?.company_name;

  const publicProfileUrl =
    company?.account_type === "professional"
      ? `/professional/${company?.slug}`
      : `/company/${company?.slug}`;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold">
            Projektet e {profileName}
          </h1>

          <p className="mt-2 text-slate-500">
            Menaxho projektet që shfaqen në profilin publik.
          </p>

          {company?.slug && (
            <a
              href={publicProfileUrl}
              target="_blank"
              className="mt-3 inline-block font-semibold text-blue-600"
            >
              Shiko Profilin Publik →
            </a>
          )}

          <form
            onSubmit={handleSave}
            className="mt-4 rounded-3xl bg-white p-8 shadow-xl"
          >
            <div className="grid gap-6">
              <div>
                <label className="text-sm font-semibold">
                  Titulli i Projektit
                </label>
                <input
                  className="mt-2 w-full rounded-xl border px-4 py-3"
                  value={title}
                  disabled={isSaving}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Përshkrimi</label>
                <textarea
                  className="mt-2 w-full rounded-xl border px-4 py-3"
                  rows={5}
                  value={description}
                  disabled={isSaving}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Fotot e Projektit
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isSaving || photoFiles.length >= MAX_PHOTOS}
                  onChange={handleSelectPhotos}
                />

                <div className="mt-2 rounded-xl border border-dashed p-4">
                  {photoFiles.length < MAX_PHOTOS ? (
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Shto Foto
                    </button>
                  ) : (
                    <p className="font-semibold text-slate-700">
                      Maksimumi 5 foto u zgjodhën.
                    </p>
                  )}

                  <p className="mt-3 text-sm text-slate-500">
                    {photoFiles.length}/{MAX_PHOTOS} foto të zgjedhura
                  </p>

                  {photoFiles.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {photoFiles.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Foto e zgjedhur"
                            className="h-28 w-full rounded-xl object-cover"
                          />

                          {!isSaving && (
                            <button
                              type="button"
                              onClick={() => removeSelectedPhoto(index)}
                              className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white"
                            >
                              X
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {editingProject?.project_photos?.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {editingProject.project_photos.map((photo: any) => (
                      <img
                        key={photo.id}
                        src={photo.photo_url}
                        alt="Foto projekti"
                        className="h-24 w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? "Ju lutem prisni..."
                    : editingProject
                    ? "Përditëso Projektin"
                    : "Ruaj Projektin"}
                </button>

                {editingProject && (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      resetForm();
                      setMessage("Editimi u anulua.");
                    }}
                    className="rounded-xl bg-slate-500 px-6 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Anulo Editimin
                  </button>
                )}
              </div>

              {message && <p className="font-semibold">{message}</p>}
            </div>
          </form>

          <div className="mt-12">
            <h2 className="text-2xl font-bold">Projektet e Mia</h2>

            <div className="mt-6 grid gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl bg-white p-6 shadow-md"
                >
                  {project.project_photos?.length > 0 ? (
                    <div className="mb-4 grid grid-cols-3 gap-3">
                      {project.project_photos.map((photo: any) => (
                        <img
                          key={photo.id}
                          src={photo.photo_url}
                          alt={project.title}
                          className="h-28 w-full rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  ) : project.photo_url ? (
                    <img
                      src={project.photo_url}
                      alt={project.title}
                      className="mb-4 h-48 w-full rounded-xl object-cover"
                    />
                  ) : null}

                  <h3 className="font-bold">{project.title}</h3>

                  <p className="mt-2 text-slate-600">
                    {project.description}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleEdit(project)}
                      className="rounded-xl bg-yellow-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleDelete(project.id)}
                      className="rounded-xl bg-red-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Fshij Projektin
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}