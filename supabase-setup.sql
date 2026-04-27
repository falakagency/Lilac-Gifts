-- ════════════════════════════════════════════════════════════════════════
-- 🌷 LILAC GIFTS - Supabase Setup Script
-- ════════════════════════════════════════════════════════════════════════
-- INSTRUCTIONS:
-- 1. Open your Supabase project: https://supabase.com/dashboard
-- 2. Go to: SQL Editor (left sidebar)
-- 3. Click "New query"
-- 4. Paste this entire file
-- 5. Click "Run"
-- ════════════════════════════════════════════════════════════════════════

-- ─── 1. CATEGORIES TABLE ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  icon      TEXT
);

-- ─── 2. PRODUCTS TABLE ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  price        DECIMAL NOT NULL,
  description  TEXT,
  image_url    TEXT,
  gallery      JSONB DEFAULT '[]'::jsonb,
  category_id  INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  bestseller   BOOLEAN DEFAULT false,
  rating       NUMERIC DEFAULT 5,
  reviews      INTEGER DEFAULT 0,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ─── 3. ROW LEVEL SECURITY (allow public access for site + admin) ───────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_public_all" ON categories;
CREATE POLICY "categories_public_all" ON categories
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "products_public_all" ON products;
CREATE POLICY "products_public_all" ON products
  FOR ALL USING (true) WITH CHECK (true);

-- ─── 4. STORAGE BUCKET FOR PRODUCT IMAGES ──────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "products_storage_public_read"   ON storage.objects;
DROP POLICY IF EXISTS "products_storage_public_insert" ON storage.objects;
DROP POLICY IF EXISTS "products_storage_public_update" ON storage.objects;
DROP POLICY IF EXISTS "products_storage_public_delete" ON storage.objects;

CREATE POLICY "products_storage_public_read"   ON storage.objects
  FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "products_storage_public_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products');
CREATE POLICY "products_storage_public_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'products') WITH CHECK (bucket_id = 'products');
CREATE POLICY "products_storage_public_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'products');

-- ─── 5. SEED CATEGORIES (5 رئيسية) ─────────────────────────────────────
TRUNCATE TABLE products RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

INSERT INTO categories (id, name, icon) VALUES
  (1, 'التخرج',              '🎓'),
  (2, 'ترفيعات عسكرية',      '⭐'),
  (3, 'يوم الأم',            '🌸'),
  (4, 'رمضان وعيد الفطر',    '🌙'),
  (5, 'دلات وفناجين',         '☕');
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- ─── 6. SEED PRODUCTS (المنتجات الحالية) ───────────────────────────────
INSERT INTO products
  (id, name, price, description, image_url, gallery, category_id, bestseller, rating, reviews)
VALUES
  (101, 'طقم تخرج أمن عام', 15,
   'طقم هدايا مخصص لمناسبة التخرج، مع طباعة اسم الخريج',
   '/products/amn-aam.jpeg',
   '[]'::jsonb,
   1, true, 4.8, 47),

  (102, 'طقم تخرج جامعي', 20,
   'هدية أنيقة للخريجين الجدد، مع طباعة الاسم وسنة التخرج',
   '/products/uni-grad-1.jpeg',
   '["/products/uni-grad-1.jpeg","/products/uni-grad-2.jpeg","/products/uni-grad-3.jpeg"]'::jsonb,
   1, true, 4.9, 63),

  (201, 'طقم ترفيع ضابط', 25,
   'طقم تهنئة فاخر بالرتبة الجديدة، مع طباعة الاسم والشعار العسكري بتصميم مخصص',
   '/products/promo-1.jpeg',
   '["/products/promo-1.jpeg","/products/promo-2.jpeg"]'::jsonb,
   2, false, 4.7, 31),

  (301, 'طقم يوم الأم الكلاسيكي', 18,
   'أجمل هدية لأحن الأمهات، يحتوي على لوحة مرآة مخصصة باسم الأم وعبارة محفورة، مع شمعة وفنجان قهوة مخصص',
   '/products/mom-1.jpeg',
   '["/products/mom-1.jpeg","/products/mom-2.jpeg","/products/mom-3.jpeg"]'::jsonb,
   3, true, 5.0, 89),

  (401, 'طقم رمضان وعيد الفطر', 22,
   'بكجات هدايا رمضانية وعيدية فاخرة، تشمل سبحة، ماء زمزم، وبطاقات معايدة بتصميم مخصص',
   '/products/ramadan-1.jpeg',
   '["/products/ramadan-1.jpeg","/products/ramadan-2.jpeg","/products/ramadan-3.jpeg"]'::jsonb,
   4, false, 4.6, 24),

  (501, 'دلة بطباعة مخصصة', 30,
   'دلة قهوة فاخرة مع طباعة الاسم أو عبارة مخصصة، تأتي مع فناجين مطابقة',
   '/products/dallah-1.jpeg',
   '["/products/dallah-1.jpeg","/products/dallah-2.jpeg","/products/dallah-3.jpeg"]'::jsonb,
   5, true, 4.9, 56);

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- ════════════════════════════════════════════════════════════════════════
-- ✓ Done! Your store is now connected to Supabase.
-- ════════════════════════════════════════════════════════════════════════
