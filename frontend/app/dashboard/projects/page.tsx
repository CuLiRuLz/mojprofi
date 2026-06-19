"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardProjectsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  
  const [company, setCompany] = useState<any>(null);

  async function getMyProfile() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("Nuk je i kyçur.");
      return null;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, company_name, slug")
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

    if (!editingProject && projects.length >= 5) {
  setMessage("Mund të shtoni maksimumi 5 projekte.");
  return;
}

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
    setMessage("");

    if (!title.trim()) {
      setMessage("Shkruaje titullin e projektit.");
      return;
    }

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
  }

  function handleEdit(project: any) {
    setEditingProject(project);
    setTitle(project.title || "");
    setDescription(project.description || "");
    setPhotoFiles([]);
    setMessage("Tani je duke edituar këtë projekt.");
  }

  async function handleDelete(projectId: any) {
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

  return (
  <>
    <Navbar />

    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">
  Projektet e {company?.company_name}
</h1>

<p className="mt-2 text-slate-500">
  Menaxho projektet që shfaqen në profilin publik.
</p>

{company?.slug && (
  <a
    href={`/company/${company.slug}`}
    target="_blank"
    className="mt-3 inline-block font-semibold text-blue-600"
  >
    Shiko Profilin Publik →
  </a>
)}

        <form
          onSubmit={handleSave}
          className="rounded-3xl bg-white p-8 shadow-xl"
        >
          <div className="grid gap-6">
            <div>
              <label className="text-sm font-semibold">
                Titulli i Projektit
              </label>
              <input
                className="mt-2 w-full rounded-xl border px-4 py-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Përshkrimi</label>
              <textarea
                className="mt-2 w-full rounded-xl border px-4 py-3"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Fotot e Projektit
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                className="mt-2 w-full rounded-xl border px-4 py-3"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);

if (files.length > 5) {
  setMessage("Maksimumi 5 foto për projekt.");
  return;
}

setPhotoFiles(files);
                }}
              />

              {photoFiles.length > 0 && (
                <p className="mt-2 text-sm text-slate-500">
                  {photoFiles.length} foto të zgjedhura
                </p>
              )}

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
                className="rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white"
              >
                {editingProject ? "Përditëso Projektin" : "Ruaj Projektin"}
              </button>

              {editingProject && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setMessage("Editimi u anulua.");
                  }}
                  className="rounded-xl bg-slate-500 px-6 py-4 font-semibold text-white"
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
              <div key={project.id} className="rounded-2xl bg-white p-6 shadow-md">
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

                <p className="mt-2 text-slate-600">{project.description}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="rounded-xl bg-yellow-500 px-4 py-2 text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="rounded-xl bg-red-600 px-4 py-2 text-white"
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