"use client";

import { useEffect, useState } from "react";

type Photo = {
  id: number;
  photo_url: string;
};

type Props = {
  photos: Photo[];
  title: string;
};

export default function ProjectGallery({ photos, title }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const selectedPhoto =
    selectedIndex !== null ? photos[selectedIndex] : null;

  function closeGallery() {
    setSelectedIndex(null);
  }

  function showPrevious() {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1
    );
  }

  function showNext() {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1
    );
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedIndex === null) return;

      if (e.key === "ArrowLeft") {
        showPrevious();
      }

      if (e.key === "ArrowRight") {
        showNext();
      }

      if (e.key === "Escape") {
        closeGallery();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  return (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={photo.photo_url}
              alt={title}
              className="h-64 w-full rounded-2xl object-cover transition hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={closeGallery}
          onTouchStart={(e) => {
            setTouchStart(e.touches[0].clientX);
          }}
          onTouchEnd={(e) => {
            if (touchStart === null) return;

            const touchEnd = e.changedTouches[0].clientX;
            const difference = touchStart - touchEnd;

            if (difference > 50) {
              showNext();
            }

            if (difference < -50) {
              showPrevious();
            }

            setTouchStart(null);
          }}
        >
          <button
            type="button"
            className="absolute right-6 top-6 rounded-full bg-white px-4 py-2 font-bold text-black"
            onClick={(e) => {
              e.stopPropagation();
              closeGallery();
            }}
          >
            ✕
          </button>

          <button
            type="button"
            className="absolute left-6 rounded-full bg-white px-4 py-3 text-2xl font-bold text-black"
            onClick={(e) => {
              e.stopPropagation();
              showPrevious();
            }}
          >
            ‹
          </button>

          <img
            src={selectedPhoto.photo_url}
            alt={title}
            className="max-h-[90vh] max-w-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="absolute right-6 rounded-full bg-white px-4 py-3 text-2xl font-bold text-black"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
          >
            ›
          </button>

          <div className="absolute bottom-6 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
            {selectedIndex! + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}