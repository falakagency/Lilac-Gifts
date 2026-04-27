import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase, PRODUCTS_BUCKET, type DbCategory, type DbProduct } from "../lib/supabase";
import { useCatalog } from "../lib/catalog";

const ADMIN_PASSWORD = "lilac2024";
const AUTH_KEY = "lilac-admin-auth";

type Tab = "products" | "categories";

type ProductForm = {
  id: number | null;
  name: string;
  price: string;
  description: string;
  image_url: string;
  gallery: string;
  category_id: string;
  bestseller: boolean;
  rating: string;
  reviews: string;
};

const EMPTY_PRODUCT: ProductForm = {
  id: null,
  name: "",
  price: "",
  description: "",
  image_url: "",
  gallery: "",
  category_id: "",
  bestseller: false,
  rating: "5",
  reviews: "0",
};

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, "1");
      } catch {
        // ignore
      }
      onUnlock();
    } else {
      setError("كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white dark:bg-[#16213e] rounded-3xl p-8 shadow-lg border-2 border-[#EDE0F7] dark:border-[#2a2f4a]">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9]">لوحة التحكم</h1>
          <p className="text-sm text-[#A87FD1] mt-2">أدخلي كلمة المرور للمتابعة</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="كلمة المرور"
            className="w-full bg-white dark:bg-[#1a1a2e] text-[#2A1F3D] dark:text-[#eee] border-2 border-[#EDE0F7] dark:border-[#2a2f4a] rounded-2xl px-4 py-3 outline-none focus:border-[#534AB7] dark:focus:border-[#C8A8E9]"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#534AB7] text-white py-3 rounded-2xl font-bold hover:bg-[#A87FD1] btn-anim shadow"
          >
            دخول
          </button>
          <Link
            href="/"
            className="block text-center text-sm text-[#A87FD1] hover:text-[#534AB7] dark:hover:text-[#C8A8E9] hover:underline"
          >
            ← العودة للموقع
          </Link>
        </form>
      </div>
    </div>
  );
}

function ProductsTab({ refreshAll }: { refreshAll: () => Promise<void> }) {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<ProductForm>(EMPTY_PRODUCT);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase.from("products").select("*").order("id", { ascending: true }),
      supabase.from("categories").select("*").order("id", { ascending: true }),
    ]);
    if (prodRes.data) setProducts(prodRes.data as DbProduct[]);
    if (catRes.data) setCategories(catRes.data as DbCategory[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const showMessage = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4000);
  };

  const startEdit = (p: DbProduct) => {
    setForm({
      id: p.id,
      name: p.name ?? "",
      price: String(p.price ?? ""),
      description: p.description ?? "",
      image_url: p.image_url ?? "",
      gallery: Array.isArray(p.gallery) ? p.gallery.join("\n") : "",
      category_id: p.category_id != null ? String(p.category_id) : "",
      bestseller: !!p.bestseller,
      rating: String(p.rating ?? 5),
      reviews: String(p.reviews ?? 0),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startAdd = () => {
    setForm(EMPTY_PRODUCT);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setShowForm(false);
    setForm(EMPTY_PRODUCT);
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const safeBase = file.name
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "image";
      const path = `${Date.now()}-${safeBase}.${ext}`;
      const { error: upErr } = await supabase.storage.from(PRODUCTS_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(PRODUCTS_BUCKET).getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      showMessage("ok", "تم رفع الصورة بنجاح ✓");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      showMessage("err", `فشل رفع الصورة: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryFiles = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const safeBase = file.name
          .replace(/\.[^.]+$/, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 40) || "image";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeBase}.${ext}`;
        const { error: upErr } = await supabase.storage.from(PRODUCTS_BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from(PRODUCTS_BUCKET).getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setForm((f) => {
        const existing = f.gallery
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        return { ...f, gallery: [...existing, ...urls].join("\n") };
      });
      showMessage("ok", `تم رفع ${urls.length} صورة للمعرض ✓`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      showMessage("err", `فشل رفع الصور: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showMessage("err", "الاسم مطلوب");
      return;
    }
    const priceNum = parseFloat(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      showMessage("err", "السعر غير صحيح");
      return;
    }

    setBusy(true);
    try {
      const galleryArr = form.gallery
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: form.name.trim(),
        price: priceNum,
        description: form.description.trim() || null,
        image_url: form.image_url.trim() || null,
        gallery: galleryArr,
        category_id: form.category_id ? Number(form.category_id) : null,
        bestseller: form.bestseller,
        rating: form.rating ? parseFloat(form.rating) : 5,
        reviews: form.reviews ? parseInt(form.reviews, 10) : 0,
      };

      if (form.id == null) {
        const { error: insErr } = await supabase.from("products").insert(payload);
        if (insErr) throw insErr;
        showMessage("ok", "تمت إضافة المنتج ✓");
      } else {
        const { error: updErr } = await supabase.from("products").update(payload).eq("id", form.id);
        if (updErr) throw updErr;
        showMessage("ok", "تم تحديث المنتج ✓");
      }
      setShowForm(false);
      setForm(EMPTY_PRODUCT);
      await load();
      await refreshAll();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      showMessage("err", `فشل الحفظ: ${msg}`);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (p: DbProduct) => {
    if (!window.confirm(`هل تريدين حذف المنتج "${p.name}"؟`)) return;
    setBusy(true);
    try {
      const { error: delErr } = await supabase.from("products").delete().eq("id", p.id);
      if (delErr) throw delErr;
      showMessage("ok", "تم حذف المنتج ✓");
      await load();
      await refreshAll();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      showMessage("err", `فشل الحذف: ${msg}`);
    } finally {
      setBusy(false);
    }
  };

  const inputBase =
    "w-full bg-white dark:bg-[#1a1a2e] text-[#2A1F3D] dark:text-[#eee] border-2 border-[#EDE0F7] dark:border-[#2a2f4a] rounded-2xl px-4 py-3 outline-none focus:border-[#534AB7] dark:focus:border-[#C8A8E9]";

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-2xl p-4 text-sm font-semibold text-center ${
            message.type === "ok"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#16213e] rounded-3xl border-2 border-[#C8A8E9]/60 dark:border-[#2a2f4a] p-6 shadow-md space-y-4"
        >
          <h2 className="text-xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9]">
            {form.id == null ? "➕ إضافة منتج جديد" : `✏️ تعديل المنتج #${form.id}`}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-1">اسم المنتج</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputBase}
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-1">السعر (د.أ)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputBase}
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-1">الوصف</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={`${inputBase} resize-none`}
            />
          </div>

          <div>
            <label className="block font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-1">القسم</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className={inputBase}
            >
              <option value="">— اختاري قسماً —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-1">الصورة الرئيسية</label>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <input
                type="text"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="رابط الصورة (أو ارفعي صورة)"
                className={inputBase}
              />
              <label className="cursor-pointer bg-[#EDE0F7] dark:bg-[#2a2f4a] text-[#534AB7] dark:text-[#C8A8E9] font-bold px-5 py-3 rounded-2xl hover:bg-[#C8A8E9] hover:text-white btn-anim flex items-center justify-center gap-2 whitespace-nowrap">
                <span>📷</span>
                <span>{uploading ? "جارٍ الرفع..." : "رفع صورة"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                    e.target.value = "";
                  }}
                  disabled={uploading}
                />
              </label>
            </div>
            {form.image_url && (
              <div className="mt-3 inline-block bg-[#EDE0F7] dark:bg-[#1a1a2e] rounded-xl overflow-hidden">
                <img src={form.image_url} alt="" className="w-32 h-32 object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-1">
              صور إضافية للمعرض (اختياري)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch mb-2">
              <textarea
                value={form.gallery}
                onChange={(e) => setForm({ ...form, gallery: e.target.value })}
                rows={3}
                placeholder="رابط لكل صورة بسطر منفصل"
                className={`${inputBase} resize-none`}
              />
              <label className="cursor-pointer bg-[#EDE0F7] dark:bg-[#2a2f4a] text-[#534AB7] dark:text-[#C8A8E9] font-bold px-5 py-3 rounded-2xl hover:bg-[#C8A8E9] hover:text-white btn-anim flex items-center justify-center gap-2 whitespace-nowrap">
                <span>🖼️</span>
                <span>{uploading ? "جارٍ الرفع..." : "رفع عدة صور"}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) void handleGalleryFiles(e.target.files);
                    e.target.value = "";
                  }}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-[#EDE0F7] dark:bg-[#1a1a2e] rounded-2xl px-4 py-3">
              <input
                id="bestseller"
                type="checkbox"
                checked={form.bestseller}
                onChange={(e) => setForm({ ...form, bestseller: e.target.checked })}
                className="w-5 h-5 accent-[#534AB7]"
              />
              <label htmlFor="bestseller" className="font-bold text-[#534AB7] dark:text-[#C8A8E9]">
                ⭐ الأكثر طلباً
              </label>
            </div>
            <div>
              <label className="block font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-1 text-sm">التقييم (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className={inputBase}
              />
            </div>
            <div>
              <label className="block font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-1 text-sm">عدد التقييمات</label>
              <input
                type="number"
                min="0"
                value={form.reviews}
                onChange={(e) => setForm({ ...form, reviews: e.target.value })}
                className={inputBase}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={busy || uploading}
              className="flex-1 bg-[#534AB7] text-white py-3 rounded-2xl font-bold hover:bg-[#A87FD1] btn-anim shadow disabled:opacity-60"
            >
              {busy ? "جارٍ الحفظ..." : form.id == null ? "💾 إضافة المنتج" : "💾 حفظ التعديلات"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-3 rounded-2xl font-bold bg-white dark:bg-[#1a1a2e] border-2 border-[#EDE0F7] dark:border-[#2a2f4a] text-[#534AB7] dark:text-[#C8A8E9] hover:bg-[#EDE0F7] dark:hover:bg-[#2a2f4a] btn-anim"
            >
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={startAdd}
          className="w-full bg-[#534AB7] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#A87FD1] btn-anim shadow-lg"
        >
          ➕ إضافة منتج جديد
        </button>
      )}

      <div className="bg-white dark:bg-[#16213e] rounded-3xl border-2 border-[#EDE0F7] dark:border-[#2a2f4a] p-4 sm:p-6">
        <h2 className="text-lg font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-4">
          المنتجات ({products.length})
        </h2>
        {loading ? (
          <p className="text-center text-[#A87FD1] py-6">جارٍ التحميل...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-[#A87FD1] py-6">لا توجد منتجات بعد</p>
        ) : (
          <div className="space-y-3">
            {products.map((p) => {
              const cat = categories.find((c) => c.id === p.category_id);
              return (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row gap-3 sm:items-center bg-[#EDE0F7]/40 dark:bg-[#1a1a2e] rounded-2xl p-3 border border-[#EDE0F7] dark:border-[#2a2f4a]"
                >
                  <div className="w-20 h-20 bg-[#EDE0F7] dark:bg-[#16213e] rounded-xl overflow-hidden flex-shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-[#A87FD1]">🎁</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#2A1F3D] dark:text-[#eee] truncate">
                      {p.bestseller && <span className="text-yellow-500 mr-1">⭐</span>}
                      {p.name}
                    </div>
                    <div className="text-sm text-[#A87FD1]">
                      {Number(p.price ?? 0).toFixed(2)} د.أ
                      {cat && <span className="mx-2">•</span>}
                      {cat && <span>{cat.icon} {cat.name}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      disabled={busy}
                      className="px-4 py-2 rounded-xl bg-[#534AB7] text-white font-bold text-sm hover:bg-[#A87FD1] btn-anim disabled:opacity-60"
                    >
                      ✏️ تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={busy}
                      className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 btn-anim disabled:opacity-60"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoriesTab({ refreshAll }: { refreshAll: () => Promise<void> }) {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🎁");
  const [editing, setEditing] = useState<DbCategory | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("id", { ascending: true });
    if (data) setCategories(data as DbCategory[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const showMessage = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4000);
  };

  const reset = () => {
    setEditing(null);
    setName("");
    setIcon("🎁");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showMessage("err", "اسم القسم مطلوب");
      return;
    }
    setBusy(true);
    try {
      if (editing) {
        const { error: updErr } = await supabase
          .from("categories")
          .update({ name: name.trim(), icon: icon.trim() || "🎁" })
          .eq("id", editing.id);
        if (updErr) throw updErr;
        showMessage("ok", "تم تحديث القسم ✓");
      } else {
        const { error: insErr } = await supabase
          .from("categories")
          .insert({ name: name.trim(), icon: icon.trim() || "🎁" });
        if (insErr) throw insErr;
        showMessage("ok", "تمت إضافة القسم ✓");
      }
      reset();
      await load();
      await refreshAll();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      showMessage("err", `فشل: ${msg}`);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (c: DbCategory) => {
    if (
      !window.confirm(
        `هل تريدين حذف قسم "${c.name}"؟\nملاحظة: المنتجات المرتبطة بهذا القسم لن تُحذف، لكنها لن تظهر في أي قسم.`,
      )
    )
      return;
    setBusy(true);
    try {
      await supabase.from("products").update({ category_id: null }).eq("category_id", c.id);
      const { error: delErr } = await supabase.from("categories").delete().eq("id", c.id);
      if (delErr) throw delErr;
      showMessage("ok", "تم حذف القسم ✓");
      if (editing?.id === c.id) reset();
      await load();
      await refreshAll();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      showMessage("err", `فشل الحذف: ${msg}`);
    } finally {
      setBusy(false);
    }
  };

  const inputBase =
    "w-full bg-white dark:bg-[#1a1a2e] text-[#2A1F3D] dark:text-[#eee] border-2 border-[#EDE0F7] dark:border-[#2a2f4a] rounded-2xl px-4 py-3 outline-none focus:border-[#534AB7] dark:focus:border-[#C8A8E9]";

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-2xl p-4 text-sm font-semibold text-center ${
            message.type === "ok"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#16213e] rounded-3xl border-2 border-[#C8A8E9]/60 dark:border-[#2a2f4a] p-6 shadow-md space-y-4"
      >
        <h2 className="text-xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9]">
          {editing ? `✏️ تعديل القسم #${editing.id}` : "➕ إضافة قسم جديد"}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-1">اسم القسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: التخرج"
              className={inputBase}
              required
            />
          </div>
          <div>
            <label className="block font-bold text-[#534AB7] dark:text-[#C8A8E9] mb-1">الإيقونة</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="🎓"
              className={`${inputBase} text-center text-2xl`}
              maxLength={4}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={busy}
            className="flex-1 bg-[#534AB7] text-white py-3 rounded-2xl font-bold hover:bg-[#A87FD1] btn-anim shadow disabled:opacity-60"
          >
            {busy ? "جارٍ الحفظ..." : editing ? "💾 حفظ التعديلات" : "💾 إضافة القسم"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={reset}
              className="px-6 py-3 rounded-2xl font-bold bg-white dark:bg-[#1a1a2e] border-2 border-[#EDE0F7] dark:border-[#2a2f4a] text-[#534AB7] dark:text-[#C8A8E9] hover:bg-[#EDE0F7] dark:hover:bg-[#2a2f4a] btn-anim"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      <div className="bg-white dark:bg-[#16213e] rounded-3xl border-2 border-[#EDE0F7] dark:border-[#2a2f4a] p-4 sm:p-6">
        <h2 className="text-lg font-extrabold text-[#534AB7] dark:text-[#C8A8E9] mb-4">
          الأقسام ({categories.length})
        </h2>
        {loading ? (
          <p className="text-center text-[#A87FD1] py-6">جارٍ التحميل...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-[#A87FD1] py-6">لا توجد أقسام بعد</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 bg-[#EDE0F7]/40 dark:bg-[#1a1a2e] rounded-2xl p-3 border border-[#EDE0F7] dark:border-[#2a2f4a]"
              >
                <div className="text-3xl">{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#2A1F3D] dark:text-[#eee]">{c.name}</div>
                  <div className="text-xs text-[#A87FD1]">#{c.id}</div>
                </div>
                <button
                  onClick={() => {
                    setEditing(c);
                    setName(c.name);
                    setIcon(c.icon ?? "🎁");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={busy}
                  className="px-3 py-2 rounded-xl bg-[#534AB7] text-white font-bold text-sm hover:bg-[#A87FD1] btn-anim disabled:opacity-60"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  disabled={busy}
                  className="px-3 py-2 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 btn-anim disabled:opacity-60"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState<Tab>("products");
  const { refetch } = useCatalog();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(AUTH_KEY) === "1") setUnlocked(true);
    } catch {
      // ignore
    }
  }, []);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      // ignore
    }
    setUnlocked(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#534AB7] dark:text-[#C8A8E9]">🌷 لوحة التحكم</h1>
          <p className="text-sm text-[#A87FD1] mt-1">إدارة المنتجات والأقسام</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#16213e] border-2 border-[#EDE0F7] dark:border-[#2a2f4a] text-[#534AB7] dark:text-[#C8A8E9] font-semibold hover:bg-[#EDE0F7] dark:hover:bg-[#2a2f4a] btn-anim text-sm"
          >
            ← الموقع
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 btn-anim text-sm"
          >
            🚪 خروج
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-[#EDE0F7] dark:bg-[#16213e] p-2 rounded-2xl">
        <button
          onClick={() => setTab("products")}
          className={`flex-1 py-3 rounded-xl font-bold btn-anim ${
            tab === "products"
              ? "bg-[#534AB7] text-white shadow"
              : "text-[#534AB7] dark:text-[#C8A8E9] hover:bg-white dark:hover:bg-[#1a1a2e]"
          }`}
        >
          🎁 المنتجات
        </button>
        <button
          onClick={() => setTab("categories")}
          className={`flex-1 py-3 rounded-xl font-bold btn-anim ${
            tab === "categories"
              ? "bg-[#534AB7] text-white shadow"
              : "text-[#534AB7] dark:text-[#C8A8E9] hover:bg-white dark:hover:bg-[#1a1a2e]"
          }`}
        >
          📂 الأقسام
        </button>
      </div>

      {tab === "products" ? <ProductsTab refreshAll={refetch} /> : <CategoriesTab refreshAll={refetch} />}
    </div>
  );
}
