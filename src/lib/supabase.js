// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET;

export async function uploadProductImage(file) {
  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = fileName;

  // ------- UPLOAD -------
  const { data, error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw uploadError;
  }

  // ------- GET PUBLIC URL -------
  const { data: publicData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return publicData.publicUrl;
}
