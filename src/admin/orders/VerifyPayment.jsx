import { useParams } from "react-router-dom";

export default function VerifyPayment() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Verify Payment for Order {id}
      </h1>
      <p>Halaman verifikasi pembayaran belum dibuat.</p>
    </div>
  );
}