import { supabase } from "/src/lib/supabase"; // Use absolute path

export async function uploadProductImage(file) {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// FUNGSI BARU: Upload Avatar
export async function uploadAvatar(file, userId) {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  // Gunakan ID user agar file tidak menumpuk (overwrite file lama user ini)
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  
  // Kita simpan di bucket 'avatars' yang baru dibuat
  const filePath = `${fileName}`; 

  const { error: uploadError } = await supabase.storage
    .from("avatars") // Bucket khusus avatar
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload avatar error:", uploadError);
    alert("Gagal upload foto: " + uploadError.message);
    return null;
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return data.publicUrl;
}