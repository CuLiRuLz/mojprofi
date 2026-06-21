"use client";

import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

type FavoriteButtonProps = {
  profileId: string;
};

export default function FavoriteButton({ profileId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    checkFavorite();
  }, []);

  async function checkFavorite() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("profile_id", profileId)
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (data) {
      setIsFavorite(true);
      setFavoriteId(data.id);
    } else {
      setIsFavorite(false);
      setFavoriteId(null);
    }
  }

  async function handleFavorite() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Duhet të kyçesh për të ruajtur favoritë.");
      return;
    }

    const { data: ownProfile } = await supabase
  .from("profiles")
  .select("id")
  .eq("user_id", userData.user.id)
  .eq("id", profileId)
  .maybeSingle();

if (ownProfile) {
  alert("Nuk mund ta ruash profilin tënd si favorit.");
  return;
}

    if (isFavorite && favoriteId) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) {
        alert(error.message);
        return;
      }

      setIsFavorite(false);
      setFavoriteId(null);
      return;
    }

    const { data, error } = await supabase
      .from("favorites")
      .insert({
        profile_id: profileId,
        user_id: userData.user.id,
      })
      .select("id")
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setIsFavorite(true);
    setFavoriteId(data.id);
  }

  return (
  <button
    onClick={handleFavorite}
    className="inline-flex h-[30px] w-[34px] items-center justify-center rounded-xl border border-pink-200 bg-pink-50 text-pink-600 shadow-sm hover:bg-pink-100 md:h-[36px] md:w-auto md:min-w-[96px] md:gap-2 md:px-3 md:text-xs md:font-semibold"
  >
    {isFavorite ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
    <span className="hidden md:inline">Favorit</span>
  </button>
);
}