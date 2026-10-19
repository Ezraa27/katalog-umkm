"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";

export async function masuk(prevStateOrFormData, maybeFormData) {
  const formData = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let pesanError = error.message;
    if (error.message === "Invalid login credentials") {
      pesanError = "Email atau password salah.";
    } else if (error.message === "Email not confirmed") {
      pesanError = "Email belum dikonfirmasi.";
    }
    return { error: pesanError };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function keluar() {
  const supabase = await createAdminClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

export async function gantiPassword(prevStateOrFormData, maybeFormData) {
  const formData = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const passwordBaru = formData.get("password_baru")?.toString();
  const konfirmasiPassword = formData.get("konfirmasi_password")?.toString();

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak sama dengan password baru." };
  }

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda belum login atau sesi telah berakhir. Silakan login kembali." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: error.message };
  }

  return { sukses: true, pesan: "Password berhasil diganti." };
}

export async function tambahProduk(prevStateOrFormData, maybeFormData) {
  const formData = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga")?.toString().trim();
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan tidak boleh negatif." };
  }

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda belum login atau sesi telah berakhir. Silakan login kembali." };
  }

  const { error: insertError } = await supabase.from("produk").insert([
    {
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    },
  ]);

  if (insertError) {
    return { error: insertError.message || "Gagal menyimpan produk ke database." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function ubahProduk(prevStateOrFormData, maybeFormData) {
  const formData = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const id = formData.get("id")?.toString();
  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga")?.toString().trim();
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  if (!nama) {
    redirect(`/admin/produk/${id}/ubah?error=${encodeURIComponent("Nama produk wajib diisi.")}`);
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    redirect(`/admin/produk/${id}/ubah?error=${encodeURIComponent("Harga harus berupa angka dan tidak boleh negatif.")}`);
  }

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/admin/produk/${id}/ubah?error=${encodeURIComponent("Anda belum login atau sesi telah berakhir.")}`);
  }

  const { error: updateError } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (updateError) {
    redirect(`/admin/produk/${id}/ubah?error=${encodeURIComponent(updateError.message || "Gagal mengubah data produk.")}`);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function hapusProduk(idOrFormData) {
  const id = idOrFormData instanceof FormData ? idOrFormData.get("id") : idOrFormData;

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda belum login atau sesi telah berakhir. Silakan login kembali." };
  }

  const { error: deleteError } = await supabase
    .from("produk")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { error: deleteError.message || "Gagal menghapus produk." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/");
  return { sukses: true };
}

export async function hapusProduk(idOrFormData) {
  const id = idOrFormData instanceof FormData ? idOrFormData.get("id") : idOrFormData;

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  const supabase = await createAdminClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda belum login atau sesi telah berakhir. Silakan login kembali." };
  }

  const { error: deleteError } = await supabase
    .from("produk")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { error: deleteError.message || "Gagal menghapus produk." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/");
  return { sukses: true };
}

