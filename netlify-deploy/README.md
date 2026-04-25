# 🌷 Lilac Gifts - متجر الهدايا

موقع متجر هدايا مخصصة للمناسبات في الأردن.

---

## 📋 معلومات الموقع

- **الإطار:** React + Vite + TypeScript
- **التصميم:** Tailwind CSS + RTL عربي
- **الاستضافة:** Netlify (مجاني)
- **استلام الطلبات:** Formspree + WhatsApp

---

## 🚀 كيف تشغّل الموقع على جهازك (للتطوير)

### المتطلبات:
- تنزيل [Node.js](https://nodejs.org) (نسخة 18 أو أحدث)

### الأوامر:

```bash
# 1. تثبيت المكتبات (مرة واحدة فقط)
npm install

# 2. تشغيل الموقع محلياً للاختبار
npm run dev

# 3. بناء نسخة جاهزة للنشر
npm run build
```

بعد `npm run build` رح يتولّد مجلد `dist/` فيه كل ملفات الموقع جاهزة للرفع.

---

## 🌐 كيف تنشر تحديث على الموقع

### الطريقة 1: السحب اليدوي (الأسهل)
1. شغّل `npm run build`
2. روح على https://app.netlify.com/drop
3. اسحب محتويات مجلد `dist/` على الصفحة
4. التحديث يصير مباشر خلال ثواني

### الطريقة 2: ربط مع GitHub (أوتوماتيكي)
1. ارفع المشروع على GitHub
2. في Netlify: **Add new site** → **Import from Git**
3. اختر الريبو، Netlify رح يقرأ `netlify.toml` ويبني تلقائياً
4. كل تعديل وترفعه على GitHub = الموقع يتحدّث لحاله

---

## ⚙️ الإعدادات المهمة

### 1. استلام الطلبات بالإيميل (Formspree)
- الإيميل الحالي: مربوط على حساب Formspree
- لتغيير وجهة الإيميل، عدّل ملف `src/pages/Checkout.tsx`
- ابحث عن: `https://formspree.io/f/mlgaabjd`
- استبدل بالـ Form ID الجديد من حسابك على [Formspree](https://formspree.io)

### 2. رقم WhatsApp
- الرقم الحالي: `+962778967531`
- لتغييره: ابحث في `src/` عن الرقم وغيّره
- الملفات الرئيسية: `src/pages/Checkout.tsx`, `src/components/Layout.tsx`

### 3. أرقام التواصل
- في `src/components/Layout.tsx` (في الفوتر)

---

## 📦 إضافة منتجات جديدة

كل المنتجات موجودة في ملف واحد:
**`src/data.ts`**

### مثال على إضافة منتج جديد:
```typescript
{
  id: "new-product-1",
  name: "اسم المنتج",
  price: 25, // السعر بالدينار
  category: "graduation", // graduation, ramadan, mother, military, baby
  image: img, // الصورة المستوردة
  description: "وصف المنتج",
  // ...
}
```

### إضافة صور جديدة:
1. ضع الصورة في مجلد `attached_assets/`
2. استوردها في أعلى `data.ts`:
   ```typescript
   import myNewImg from "@assets/my-new-image.jpeg";
   ```
3. استخدمها في المنتج: `image: myNewImg`

---

## 🎨 تخصيص الألوان والتصميم

الألوان الأساسية في ملف `src/index.css`:
```css
--color-lilac: #C8A8E9;        /* البنفسجي الرئيسي */
--color-lilac-light: #EDE0F7;  /* البنفسجي الفاتح */
--color-lilac-dark: #A87FD1;   /* البنفسجي الغامق */
--color-lilac-deep: #534AB7;   /* الأزرق البنفسجي */
```

---

## 📞 الدعم الفني

إذا احتجت مساعدة، تواصل مع المطوّر الذي بنى الموقع.

---

## 📄 الملفات المهمة

| الملف | الوظيفة |
|-------|---------|
| `src/data.ts` | كل المنتجات والأقسام |
| `src/pages/Checkout.tsx` | صفحة إتمام الطلب |
| `src/components/Layout.tsx` | الهيدر والفوتر |
| `src/index.css` | الألوان والخطوط |
| `netlify.toml` | إعدادات النشر |
| `package.json` | المكتبات المستخدمة |

---

## 💰 التكاليف

- **الاستضافة على Netlify:** مجاني للأبد ✅
- **الدومين الخاص:** ~12$ سنوياً (اختياري)
- **Formspree:** مجاني حتى 50 طلب شهرياً، بعدها 10$ شهرياً
- **WhatsApp Business:** مجاني

---

🌷 **Lilac Gifts** — صُنع بحب في الأردن
