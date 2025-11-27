import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Peminjaman() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/borrow", {
        params: { status: "BORROWED", limit: 50 },
      });

      setBorrows(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load borrows", err);
      const msg =
        err.response?.data?.message || err.message || "Gagal memuat data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleReturn = async (borrowId) => {
    if (!window.confirm("Konfirmasi buku ini sudah dikembalikan?")) return;

    try {
      await api.post(`/borrow/return/${borrowId}`);
      await load();
    } catch (err) {
      console.error("Failed to return book", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal memproses pengembalian";
      alert(msg);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Daftar Peminjaman</h2>

      {loading && <p className="text-gray-500">Memuat data...</p>}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {!loading && borrows.length === 0 && !error && (
        <p className="text-gray-500">Tidak ada peminjaman aktif</p>
      )}

      {!loading && borrows.length > 0 && (
        <div className="space-y-3">
          {borrows.map((r) => (
            <div
              key={r.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <div className="font-medium">
                  {r.book?.title || "Judul tidak tersedia"}
                </div>
                <div className="text-sm text-gray-500">
                  Oleh: {r.user?.name || "-"}{" "}
                  {r.user?.nim && <>• NIM: {r.user.nim}</>} <br />
                  Tanggal pinjam:{" "}
                  {r.borrowDate
                    ? new Date(r.borrowDate).toLocaleString()
                    : "-"}
                  {r.dueDate && (
                    <> • Tenggat Pinjam: {new Date(r.dueDate).toLocaleDateString()}</>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleReturn(r.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Konfirmasi Pengembalian
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
