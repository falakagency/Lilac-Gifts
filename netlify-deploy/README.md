# 🌷 Lilac Gifts - Online Gift Store

A custom gift store website for occasions in Jordan.

---

## 📋 About This Website

- **Built with:** React + Vite + TypeScript
- **Design:** Tailwind CSS (Arabic RTL layout)
- **Hosting:** Netlify (free)
- **Orders:** Sent by email through Formspree + WhatsApp

---

## 🚀 How to Run the Website on Your Computer

### What you need first:
- Install [Node.js](https://nodejs.org) (version 18 or newer)

### Commands:

```bash
# 1. Install all packages (only the first time)
npm install

# 2. Run the website on your computer for testing
npm run dev

# 3. Build a ready-to-publish version
npm run build
```

After running `npm run build`, a folder called `dist/` will be created. This folder has the final website files, ready to upload.

---

## 🌐 How to Update the Live Website

### Option 1: Drag & Drop (Easiest)
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the contents of the `dist/` folder onto the page
4. The update goes live in seconds

### Option 2: Connect with GitHub (Automatic)
1. Upload the project to GitHub
2. In Netlify: **Add new site** → **Import from Git**
3. Pick your repo. Netlify will read `netlify.toml` and build automatically
4. Every time you push changes to GitHub, the website updates by itself

---

## ⚙️ Important Settings

### 1. Receiving Orders by Email (Formspree)
- The current email is connected through a Formspree account
- To change it, edit the file `src/pages/Checkout.tsx`
- Find: `https://formspree.io/f/mlgaabjd`
- Replace it with your own Form ID from [Formspree](https://formspree.io)

### 2. WhatsApp Number
- Current number: `+962778967531`
- To change it: search inside the `src/` folder for the number and replace it
- Main files: `src/pages/Checkout.tsx`, `src/components/Layout.tsx`

### 3. Contact Numbers
- Found in `src/components/Layout.tsx` (in the footer)

---

## 📦 How to Add New Products

All products live in one file:
**`src/data.ts`**

### Example of adding a new product:
```typescript
{
  id: "new-product-1",
  name: "Product Name",
  price: 25, // Price in JOD
  category: "graduation", // graduation, ramadan, mother, military, baby
  image: img, // The imported image
  description: "Product description",
  // ...
}
```

### Adding new images:
1. Put the image inside the `attached_assets/` folder
2. Import it at the top of `data.ts`:
   ```typescript
   import myNewImg from "@assets/my-new-image.jpeg";
   ```
3. Use it in the product: `image: myNewImg`

---

## 🎨 Customizing Colors and Design

The main colors are in `src/index.css`:
```css
--color-lilac: #C8A8E9;        /* Main lilac */
--color-lilac-light: #EDE0F7;  /* Light lilac */
--color-lilac-dark: #A87FD1;   /* Dark lilac */
--color-lilac-deep: #534AB7;   /* Deep purple-blue */
```

---

## 📞 Technical Support

If you need help, please contact the developer who built the website.

---

## 📄 Important Files

| File | What it does |
|------|--------------|
| `src/data.ts` | All products and categories |
| `src/pages/Checkout.tsx` | Checkout (order) page |
| `src/components/Layout.tsx` | Header and footer |
| `src/index.css` | Colors and fonts |
| `netlify.toml` | Deployment settings |
| `package.json` | All packages used |

---

## 💰 Costs

- **Netlify hosting:** Free forever ✅
- **Custom domain:** ~$12 per year (optional)
- **Formspree:** Free up to 50 orders per month, then $10/month
- **WhatsApp Business:** Free

---

🌷 **Lilac Gifts** — Made with love in Jordan
