# Muhammad Saqlain Hashim - Portfolio (React + Vite + Admin Panel)

Website + admin panel in ONE project, deployed on Vercel.
Admin panel address: `https://your-domain.com/wp-admin`

## 1. First-time setup on Vercel (5 minutes)

1. **Storage**: Vercel Dashboard > your project > *Storage* > *Create* > **Blob** > choose **Public** > connect to this project.
   (This adds `BLOB_READ_WRITE_TOKEN` automatically. It stores your text changes and uploaded images.)
2. **Environment Variables** (Settings > Environment Variables):

| Name | Value |
| --- | --- |
| `ADMIN_USERNAME` | the username you will log in with |
| `ADMIN_PASSWORD` | a LONG strong password (16+ characters) |
| `SESSION_SECRET` | any long random text (32+ characters) |
| `VITE_SITE_URL` | your live domain, e.g. `https://yourname.com` |
| `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` | contact form |
| `VITE_ADMIN_PATH` | optional secret address, e.g. `/saqlain-control` (default `/wp-admin`) |

3. **Redeploy** (Deployments > ... > Redeploy). Then open `/wp-admin` and log in.

## 2. Using the admin panel
- Left menu = every section of the website (Hero, About, Header, Footer, Contact...).
- **Projects (add / edit)**: Add project > name, type, live link, feature image, short description.
  Turn on *Show on home page* for the cards you want on the home page. Use the arrows to reorder.
- **Two ways to add a card:**
  1. **Create card from link** (top of the Projects page in the panel): paste the website link and click *Create card*.
     It fills the name, type (WooCommerce Store or Service Website), a short description taken from the website itself,
     and a full-page screenshot. Check it, edit if you like, then Save.
  2. **+ Add project**: fill everything by hand.
  Inside each card, *Fill empty fields from link* completes only the missing fields.
- **Screenshots** come from the free Microlink service (about 25-50 per day, no key needed). If a site blocks it, you get a
  message and can upload the screenshot manually. Optional: `MICROLINK_API_KEY` for more.
- **Feature image**: upload a TALL full-page screenshot of the website. On hover the card scrolls the whole page smoothly.
  (Chrome: F12 > Ctrl+Shift+P > "Capture full size screenshot")
- Click **Save changes**. Visitors see changes within about a minute.
- You can also replace the CV (PDF) and hero/about images from the panel.

## 3. Contact form (EmailJS)
The form now sends **country** and **budget**. They are also added at the end of the message text, so they arrive even before you edit the template.
Optional: in your EmailJS template add `{{country}}` and `{{budget}}`.

## 4. Run locally
```bash
npm install
cp .env.example .env     # fill in ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET
npm run dev              # website + admin + API together, data saved in .local-data
```

## 5. Security notes
- Login uses a signed, HTTP-only cookie (24 hours). Changing `ADMIN_PASSWORD` logs out all old sessions.
- Wrong passwords are slowed down and blocked after 5 tries (per server instance), so use a long password.
- Only logged-in requests can save or upload. Uploads are checked (real PNG/JPG/WebP/PDF only).

## 6. SEO
`robots.txt` and `sitemap.xml` are generated at build time. After deploying, add the site to Google Search Console and submit `/sitemap.xml`.
Edit page titles/descriptions in the admin panel > **SEO (Google)**.
