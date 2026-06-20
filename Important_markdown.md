# INFRASTRUKTURA AKTUALE (SHUMË E RËNDËSISHME)

## Stack Teknologjik

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Supabase (Database, Auth, Storage)
- GitHub (Source Control)
- Cloudflare Pages (Hosting)

---

# Git Workflow

Çdo ndryshim bëhet lokalisht në VS Code.

Pas ndryshimeve:

```bash
git add .
git commit -m "Përshkrimi i ndryshimit"
git push
```

Nuk bëhen upload manuale në Cloudflare.

Cloudflare është i lidhur direkt me GitHub.

Sa herë bëhet:

```bash
git push
```

Cloudflare krijon automatikisht deployment të ri.

---

# Deploy Workflow

VS Code
↓
Git Commit
↓
Git Push
↓
GitHub
↓
Cloudflare Auto Deploy
↓
beta.mojprofi.com

Nuk përdoret FTP.
Nuk përdoret upload manual.
Nuk përdoret build manual në server.

Gjithçka kalon përmes GitHub.

---

# Cloudflare Pages

Projekti:

mojprofi

Domain:

beta.mojprofi.com

Production Domain:

mojprofi.com

Custom Domains:

- beta.mojprofi.com
- mojprofi.com
- www.mojprofi.com

---

# Cloudflare Settings të Aktivizuara

Compatibility Flag:

nodejs_compat

Ky flag është shtuar sepse Next.js kërkon kompatibilitet Node.js në Cloudflare.

Commit:

Enable nodejs compat flag

Deployment:

cae34b0

Status:

SUCCESS

---

# Supabase

Project:

MojProfi's Project

Database:

Supabase PostgreSQL

Auth:

Email + Password

Storage:

Profile Photos
Project Photos
Future Documents

---

# Environment Variables (Cloudflare)

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

Këto janë shtuar te:

Cloudflare
→ Workers & Pages
→ MojProfi
→ Settings
→ Variables and Secrets

Pa këto variabla:

- Login nuk funksionon
- Register nuk funksionon
- Search nuk funksionon
- Dashboard nuk funksionon

---

# Beta Access Protection

Platforma aktualisht është private.

Përdoret:

middleware.ts

Faqja:

/beta-login

Password aktual:

stendal

Pas login krijohet cookie:

mojprofi_beta_access=stendal

Vetëm përdoruesit që dinë password mund të hyjnë.

Kjo është zgjidhje e përkohshme deri në lançimin publik.

---

# Gjëra që NUK duhen prekur pa arsye

- Cloudflare Variables
- nodejs_compat flag
- GitHub Repository Connection
- Supabase URL
- Supabase Publishable Key
- Middleware Beta Protection

Këto aktualisht janë funksionale dhe çdo ndryshim mund të bllokojë login, register ose deploy.

---

# Problem i Njohur Aktual

Dashboard përdor Sidebar.

Por:

/dashboard/company/profile

dhe

/dashboard/professional/profile

ende përdorin layout tjetër.

Duhet:

Të gjitha faqet e dashboard-it të përdorin të njëjtin Sidebar Layout.

Ky është prioritet UI për fazën tjetër.

---

# Rregulli Kryesor i Projektit

Nuk ndërtojmë shpejt.

Ndërtojmë ngadalë, pastër dhe sigurt.

Çdo funksion duhet:

1. Të punojë lokalisht.
2. Të testohet.
3. Të bëhet git push.
4. Të testohet në beta.mojprofi.com.
5. Vetëm pastaj konsiderohet i përfunduar.