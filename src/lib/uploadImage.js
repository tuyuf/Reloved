import { api } from "../services/api";

export async function uploadProductImage(file) {
  if (!file) return null;
  const token = localStorage.getItem("reloved_token");
  if (!token) return alert("Login required"), null;

  const ext = file.name.split(".").pop();
  const name = `${Date.now()}.${ext}`;
  return await api.storage.upload("product-images", name, file, token);
}

export async function uploadAvatar(file, userId) {
  if (!file) return null;
  const token = localStorage.getItem("reloved_token");
  const ext = file.name.split(".").pop();
  const name = `${userId}_${Date.now()}.${ext}`;
  return await api.storage.upload("avatars", name, file, token);
}