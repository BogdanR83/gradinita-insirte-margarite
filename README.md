# Grădinița „Înșir'te Mărgărite”

Site one-page vesel pentru grădinița din Sectorul 4, București — construit cu **Next.js** și pregătit pentru host gratuit pe **Vercel** (fără domeniu propriu).

## Date incluse

- Director: Tomescu Mirela Danila
- Email: gradinitainsirtemargarite@s4.ismb.ro
- Program: Luni – Vineri 7:00–18:00
- Sediul principal: Str. Almașu Mare Nr. 1 (telefon +4 021 450 3452)
- Sediul Piticot: Str. Spiniș 1 (telefon +4 021 450 3827)
- Poză clădire + linkuri Google Maps (sursă: [DGAUIS](https://dgauis.ro/unitati/gradinita-insirte-margarite/))

## Dezvoltare locală

```bash
npm install
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).

## Anunțuri + admin

- Public: [/anunturi](http://localhost:3000/anunturi) (+ secțiune pe pagina principală)
- Admin upload: [/admin](http://localhost:3000/admin)
- Poți publica **text** și/sau **PDF**

Copiază `.env.example` în `.env.local` și setează parola:

```bash
ADMIN_PASSWORD=parola-ta
ADMIN_SESSION_SECRET=un-secret-lung-aleator
```

### Persistare pe Vercel

Pe Vercel, filesystem-ul nu păstrează upload-urile. Adaugă **Vercel Blob**:

1. În proiectul Vercel → **Storage** → creează un **Blob** store
2. Conectează-l la proiect (setează `BLOB_READ_WRITE_TOKEN`)
3. Adaugă și `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET` în Environment Variables
4. Redeploy

Local, fără Blob, anunțurile se salvează în `data/announcements.json` și PDF-urile în `public/uploads/`.

## Publicare pe Vercel (gratuit, fără domeniu)

1. Creează un cont pe [vercel.com](https://vercel.com) (poți folosi GitHub).
2. Încarcă proiectul pe GitHub:
   ```bash
   git add .
   git commit -m "Site gradiniță Înșir'te Mărgărite"
   git remote add origin https://github.com/<user>/gradinita-insirte-margarite.git
   git push -u origin main
   ```
3. În Vercel: **Add New Project** → selectează repository-ul → **Deploy**.
4. Primești automat un URL public tip `https://gradinita-insirte-margarite.vercel.app`.

Alternativ, din folderul proiectului (cu [Vercel CLI](https://vercel.com/docs/cli)):

```bash
npx vercel
```

Nu ai nevoie de domeniu plătit — subdomeniul `*.vercel.app` e suficient pentru început.
