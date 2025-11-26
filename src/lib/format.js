// src/lib/format.js
export function formatPrice(value) {
  if (value == null) return "-";
  const number = typeof value === "number" ? value : Number(value);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
}

export function formatDate(isoString) {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
