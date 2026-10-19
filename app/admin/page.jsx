import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];
  let errorPesan = null;

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      errorPesan = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    errorPesan = err.message || "Gagal memuat daftar produk dari database.";
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {errorPesan ? (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
          <p className="font-semibold">Gagal memuat produk</p>
          <p className="mt-1">{errorPesan}</p>
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="text-teks-lembut">Belum ada produk.</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
