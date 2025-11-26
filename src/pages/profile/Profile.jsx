import { useUser } from "../../context/UserContext";

export default function Profile() {
  const { user } = useUser();

  return (
    <div className="reloved-page pt-10 space-y-6">
      <h1 className="section-title mb-4">Profile</h1>

      {user ? (
        <div className="bg-white/80 backdrop-blur border border-black/5 p-6 max-w-md text-xs space-y-2">
          <div>
            <span className="opacity-60">Email</span>
            <div>{user.email}</div>
          </div>
          <div className="opacity-60 text-[11px]">
            Data detail (nama, alamat, nomor hp) bisa kamu ambil dari tabel
            profiles Supabase dan tampilkan di sini nanti.
          </div>
        </div>
      ) : (
        <div className="text-xs opacity-70">
          You&apos;re not logged in yet.
        </div>
      )}
    </div>
  );
}
