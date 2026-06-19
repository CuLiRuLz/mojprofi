# MOJPROFI MASTER STATUS

Ky dokument është burimi zyrtar për vazhdimin e projektit MojProfi në çdo chat të ri.

Qëllimi: të mos humbet konteksti, të mos rifillojë planifikimi nga zero, dhe të vazhdohet vetëm nga gjendja aktuale.

---

# 1. Projekti

## Emri

MojProfi

## Domain

mojprofi.com

## Moto

Gjej profesionistin e duhur.

## Vizioni

MojProfi është platformë që lidh klientët me kompani dhe profesionistë të besueshëm në Maqedoni, me mundësi zgjerimi më vonë në Kosovë, Shqipëri dhe rajonin e Ballkanit.

Qëllimi kryesor është që njerëzit, sidomos diaspora, të gjejnë më lehtë kompani, mjeshtër dhe profesionistë të verifikuar për shërbime të ndryshme.

---

# 2. Parimi kryesor i MVP

MojProfi në MVP nuk është marketplace me pagesa.

MojProfi në MVP është platformë kërkimi dhe prezantimi.

Klienti hyn, kërkon kompani ose profesionist, shikon profilin, projektet, vlerësimet dhe kontakton direkt.

## Nuk ka tani:

- pagesa online
- job posting
- oferta brenda platformës
- chat system
- escrow
- aplikacion mobil
- AI features

Këto janë për të ardhmen.

---

# 3. Tech Stack

## Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS

## Backend

- Supabase

## Supabase Services

- Database
- Auth
- Storage
- Row Level Security

## Tools

- VS Code
- GitHub
- Cloudflare / deploy
- Supabase Dashboard

---

# 4. User Types

## 4.1 Client / User normal

Klienti është përdoruesi që kërkon kompani ose profesionist.

Ai mund të:

- regjistrohet
- kyçet
- kërkojë sipas qytetit
- kërkojë sipas kategorisë
- shikojë profile publike
- shikojë projekte
- ruajë favorite
- bëjë review
- kontaktojë direkt me telefon ose WhatsApp

Klienti nuk ka nevojë për:

- logo
- banner
- projekte
- profil biznesi
- premium
- verifikim kompanie

Dashboard i klientit më vonë duhet të jetë i thjeshtë:

- Profili im
- Favoritët e mi
- Review-t e mia

---

## 4.2 Company

Kompania është biznes që regjistrohet në MojProfi.

Kompania mund të ketë:

- emër kompanie
- logo
- banner / cover
- përshkrim
- telefon
- email
- qytet
- kategori kryesore
- projekte
- foto projektesh
- reviews
- verification level
- favorite nga klientët
- më vonë premium profile

Profili i kompanisë duhet të duket profesional, por MojProfi nuk duhet të duket sikur është vetëm platformë për kompani.

---

## 4.3 Professional / Mjeshtër privat

Mjeshtri privat është profesionist individual.

Shembuj:

- Elektricist
- Hidraulik
- Mjeshtër fasade
- Moler
- Renovues
- Kopshtar
- Pastrues
- Transportues

Mjeshtri privat nuk duhet të duket 100% njësoj si kompani.

Ai duhet të ketë profil më personal:

- emër
- mbiemër
- profesioni
- qyteti
- eksperienca
- telefoni
- WhatsApp
- projektet / punët
- reviews

Por mund të përdorë të njëjtin Public Profile Template me logjikë sipas `account_type`.

---

## 4.4 Admin

Admini menaxhon platformën.

Admini mund të:

- shohë kompanitë pending
- miratojë kompani
- ndryshojë verification level
- menaxhojë reviews
- krijojë përdorues admin
- kontrollojë platformën

Në të ardhmen mund të ketë role:

- Super Admin
- Admin
- Moderator
- Operator
- Support

Por kjo nuk është për MVP tani.

---

# 5. Database aktuale

Tabelat kryesore:

## profiles

Ruajtja e kompanive, mjeshtërve dhe përdoruesve.

Kolonat kryesore:

- id
- user_id
- account_type
- company_name
- first_name
- last_name
- email
- phone
- city_id
- verified_level
- is_approved
- is_admin
- logo_url
- cover_url
- about
- experience_years

`account_type` duhet të përdoret për të dalluar:

- client
- company
- professional

---

## cities

Qytetet.

Shembuj:

- Tetovë
- Gostivar
- Shkup
- Strugë

---

## categories

Kategoritë.

Shembuj:

- Fasada
- Trockenbau
- Renovime
- Elektricist
- Hidraulik
- Kopshtari
- Transport
- Pastrim

---

## profile_categories

Lidh profilin me kategorinë.

Ka:

- profile_id
- category_id
- is_main

Përdoret për kategorinë kryesore të profilit.

---

## projects

Projektet / punët e kompanive ose mjeshtërve.

Ka:

- id
- profile_id
- title
- description
- photo_url

Më vonë duhet shtuar:

- location
- completed_year
- category_id

---

## project_photos

Fotot e projekteve.

Ka:

- id
- project_id
- photo_url

Përdoret për galeri dhe lightbox.

---

## reviews

Vlerësimet.

Ka:

- id
- profile_id
- reviewer_name
- rating
- comment

---

## favorites

Favoritët.

Ka:

- profile_id
- user_id

---

# 6. Storage Buckets

Në Supabase Storage janë përdorur:

## company-logos

Për logo.

## company-covers

Për banner / cover image.

## project-photos

Për fotot e projekteve.

---

# 7. Features të përfunduara

## Authentication

DONE

- Register
- Login
- Logout
- Protected Dashboard

---

## Profile Management

DONE

- Create profile
- Save profile
- Load profile
- Edit profile
- Company name
- Phone
- City
- Main category
- Logo upload
- Cover upload
- About
- Experience years

---

## Projects System

DONE

- Create project
- Edit project
- Delete project
- Upload project photo
- Multiple photos per project
- Project gallery
- Project detail page
- Lightbox
- Next / Previous
- ESC
- Arrow navigation
- Swipe mobile

---

## Public Profile

DONE / IN PROGRESS

Aktualisht ka:

- cover image
- logo
- display name
- city
- category
- rating
- reviews count
- experience years
- verification badge
- phone button
- WhatsApp button
- favorite button
- about section
- contact info
- projects
- reviews

E rëndësishme:

Ky file nuk duhet parë më vetëm si Company Profile.

Duhet parë si:

Public Profile Template

që punon për:

- company
- professional

---

## Reviews

DONE

- Add review
- Show reviews
- Dynamic rating
- Rating in public profile
- Rating in search results
- Admin delete reviews

---

## Favorites

DONE

- Add to favorites
- Favorites database
- Favorites counter
- Favorite button styling improved

---

## Verification

DONE

- verified_level
- Level 0: Jo i verifikuar
- Level 1: Email + Telefon i Verifikuar
- Level 2: Identitet i Verifikuar
- Level 3: Kompani e Verifikuar

Badge aktualisht shfaqet në public profile.

Duhet pasur kujdes:

Për professional nuk duhet gjithmonë të thuhet "Kompani e Verifikuar".

Duhet më vonë logjikë:

- company level 3 = Kompani e Verifikuar
- professional level 3 = Profesionist i Verifikuar

---

## Admin Panel

DONE / IN PROGRESS

Ka:

- admin dashboard
- admin companies
- admin search
- admin filters
- pending companies
- verification management
- reviews moderation
- admin actions
- admin user creation

---

## Search

DONE / NEEDS UX IMPROVEMENT

Ka:

- search by city
- search by category
- dynamic results
- category + city filtering

Por dizajni i search duhet përmirësuar.

Search është shumë i rëndësishëm sepse është zemra e platformës.

---

# 8. Pages aktuale kryesore

## Public

- `frontend/app/page.tsx`
- `frontend/app/search/page.tsx`
- `frontend/app/company/[slug]/page.tsx`
- `frontend/app/project/[id]/page.tsx`

## Auth

- `frontend/app/register/page.tsx`
- `frontend/app/register/company/page.tsx`
- `frontend/app/register/professional/page.tsx`
- `frontend/app/login/page.tsx`

## Dashboard

- `frontend/app/dashboard/page.tsx`
- `frontend/app/dashboard/profile/page.tsx`
- `frontend/app/dashboard/projects/page.tsx`

## Admin

- `frontend/app/admin/companies/page.tsx`
- `frontend/app/admin/AdminActions.tsx`

---

# 9. Gjendja reale e projektit

Projekti nuk është më në fillim.

MojProfi ka tashmë bazë funksionale.

## Backend

Shumë mirë.

## Database

Shumë mirë.

## Auth

Funksional.

## Dashboard

Funksional.

## Projects

Funksional.

## Photos

Funksionale.

## Reviews

Funksionale.

## Favorites

Funksionale.

## Admin

Bazik, por funksional.

## Search

Funksional, por duhet UX më i mirë.

## Homepage

Ka strukturë, por duhet ridizajnim drejt mockup final.

## Professional Profiles

Ende jo të përfunduar.

## Premium

Ende jo i nisur.

---

# 10. Çfarë kemi bërë së fundmi

Së fundmi kemi shtuar ose përmirësuar:

- `profiles.about`
- `profiles.experience_years`
- dashboard profile textarea për about
- dashboard profile input për vite eksperiencë
- shfaqje e about në public profile
- shfaqje e viteve të eksperiencës
- heqje e emailit nga header
- telefon real me `tel:`
- WhatsApp real me `wa.me`
- react-icons për ikona
- favorite button më profesional
- public profile u bë më neutral për company/professional

Këto ndryshime nuk janë gabim.

Ato përputhen me planin e platformës.

Gabimi i vetëm ishte se filluam të merremi pak shumë me dizajnin e profilit para se të mbyllim homepage/search UX.

---

# 11. Drejtimi zyrtar i dizajnit

MojProfi duhet të duket si platformë.

Jo si website i një kompanie.

## Homepage

Duhet të jetë si mockup i planifikuar:

- header i pastër
- hero image
- search bar i madh
- kërko sipas kategori/qytet
- kategori popullore
- kompani/profesionistë të verifikuar
- projekte të fundit
- si funksionon
- CTA për regjistrim
- footer

Homepage është prioritet vizual.

## Public Profile

Duhet të jetë modern, por neutral.

Duhet të funksionojë për:

- Company
- Professional

Company mund të duket më biznesore.

Professional duhet të duket më personal.

Por nuk duhet të ndërtojmë dy sisteme krejt të ndara para kohe.

---

# 12. Company vs Professional

## Company Profile

Duhet të ketë:

- logo
- cover
- company name
- verified badge
- city
- category
- rating
- years experience
- about company
- projects
- reviews
- contact
- WhatsApp
- favorite

Më vonë:

- employees
- year founded
- website
- address
- social media
- additional categories

## Professional Profile

Duhet të ketë:

- first name
- last name
- profession/category
- city
- experience years
- personal description
- phone
- WhatsApp
- projects
- reviews
- favorite

Më vonë:

- availability
- service area
- skills
- personal verification badge

---

# 13. Premium Strategy

Premium nuk duhet ndërtuar tani si pagesë.

Por duhet planifikuar.

## Free Profile

- shfaqet në search normal
- profil bazik
- projekte të kufizuara
- foto të kufizuara

## Verified Profile

- badge verifikimi
- më shumë besim
- admin approval

## Premium Profile

Më vonë mund të ketë:

- shfaqje më lart në search
- badge Premium
- më shumë foto/projekte
- featured në homepage
- featured në kategori
- statistikë shikimesh
- buton më i dallueshëm
- prioritet në listë

Premium është mënyra kryesore e monetizimit në të ardhmen.

Por në MVP nuk duhet ende pagesa online.

---

# 14. Çfarë nuk duhet të ndërtohet ende

Mos ndërto tani:

- online payments
- job posting
- internal chat
- escrow
- AI moderation
- mobile app
- coupons
- analytics advanced
- smart matching
- report system
- RBAC kompleks
- premium checkout

Këto janë future features.

---

# 15. Prioritetet e ardhshme

## Priority 1

Homepage redesign sipas mockup final.

File:

`frontend/app/page.tsx`

Qëllimi:

Të duket si platformë profesionale MojProfi.

---

## Priority 2

Search page UX improvement.

File:

`frontend/app/search/page.tsx`

Duhet:

- cards më të mira
- dallim company/professional
- rating
- city
- category
- verified badge
- contact quick actions
- favorite counter
- premium placeholder later

---

## Priority 3

Professional profile flow.

Files:

- `frontend/app/register/professional/page.tsx`
- `frontend/app/dashboard/profile/page.tsx`
- `frontend/app/company/[slug]/page.tsx`

Duhet:

- regjistrimi i mjeshtrit të plotësojë first_name/last_name
- dashboard të shfaqë fusha të përshtatshme sipas account_type
- public profile të mos përdorë tekst "company" për professional

---

## Priority 4

Public Profile cleanup.

File:

`frontend/app/company/[slug]/page.tsx`

Duhet:

- badge text conditional
- layout të mos jetë shumë i rëndë
- favoriti të kombinohet me butonat
- company/professional wording korrekt
- mos te bëhet dizajn final pa plan

---

## Priority 5

Project metadata.

Database:

- `projects.location`
- `projects.completed_year`
- ndoshta `projects.category_id`

Dashboard:

- input location
- input year

Public:

- shfaq Tetovë / 2025 / kategori

---

## Priority 6

AL/MK language polish.

MVP gjuhët:

- Shqip
- Maqedonisht

Anglisht nuk është prioritet.

---

# 16. Rregulla për vazhdimin në chat të ri

Kur hapet chat i ri, dërgo këtë dokument dhe shkruaj:

Lexo `MASTER_STATUS.md` dhe vazhdojmë nga Priority 1. Mos e rifillo projektin nga zero. Pyet vetëm për një file në një kohë.

## Rregulla pune

- Një file në një kohë.
- Një ndryshim në një kohë.
- Nëse ka SQL, bëhet SQL para kodit.
- Jep gjithmonë path-in e file-it.
- Jep gjithmonë kod për copy/paste.
- Mos kërko shumë file njëherësh.
- Mos ndrysho arkitekturën pa arsye.
- Mos shto feature që nuk është në MVP.
- Mos e kthe MojProfi në website kompanie.
- MojProfi është platformë.

---

# 17. Gjendja emocionale / organizimi

Përdoruesi ka bërë shumë punë dhe ndihet i shqetësuar sepse chat-et bllokohen dhe konteksti humbet.

E vërteta teknike:

Projekti nuk ka dalë nga kontrolli.

Vetëm konteksti i chat-it u rëndua.

Zgjidhja:

Ky `MASTER_STATUS.md` duhet të përdoret si burim i vetëm zyrtar për vazhdimin e projektit.

---

# 18. Current Official Focus

Fokusi zyrtar tani:

Homepage + Search Experience + Professional Profile support.

Jo më dizajn i rastësishëm i profilit.

Jo më ide të reja pa i lidhur me MVP.

---

# 19. Next Chat Start Message

Në chat të ri shkruaj:

Pershendetje, po vazhdojmë MojProfi. Lexo MASTER_STATUS.md. Mos e rifillo nga zero. Jemi te Priority 1: Homepage redesign sipas mockup final. Pyet vetëm për një file në një kohë dhe më jep kod copy/paste.

---

# 20. Përmbledhje e shkurtër

MojProfi është platformë për klientë, kompani dhe profesionistë.

Core systems janë funksionale:

- auth
- profiles
- dashboard
- projects
- photos
- reviews
- favorites
- admin
- verification
- search

Tani mungon polish:

- homepage
- search UX
- professional profiles
- premium strategy later
- language polish

Drejtimi është i qartë:

MVP = klienti gjen kompani/profesionist dhe kontakton direkt.

Future = premium, mobile app, expansion, advanced tools.


# MOJPROFI - SESSION SUMMARY (2026-06-11)

## Çfarë u bë sot

### Company Public Profile

#### Verification Badge

- U rregullua sistemi i badge-it.
- Badge tani është dinamik sipas `verified_level`.

Level 0:
- Pa Verifikim

Level 1:
- Telefon & Email i Verifikuar

Level 2:
- Identitet i Verifikuar

Level 3:
- Kompani e Verifikuar

---

#### Member Since

U hoq teksti statik:

Anëtar që nga Janar 2022

dhe u lidh me:

profile.created_at

Tani shfaq:

Anëtar që nga 2026

sipas datës reale të profilit.

---

#### Share Button

U shtua butoni:

- Shpërndaj

në rresht me:

- Telefono
- WhatsApp
- Favorit

---

#### Syntax Errors

Gjatë shtimit të Share Button:

- u krijuan disa gabime JSX
- u krijuan div-e të pambyllura
- u krijua deklarim i dyfishtë i phoneDigits

Të gjitha u rregulluan.

Status:

- Company Profile kompilon pa error.
- localhost funksionon.

---

## Gjendja aktuale

Company Profile:

Funksional:
- Po

Pamje:
- Mesatare deri e mirë

Problem:
- Header ende nuk duket premium.

---

## Problemet që u identifikuan

### 1. Badge "Pa Verifikim"

Aktualisht shfaqet.

Mendim:

Nëse verified_level = 0
mos të shfaqet fare.

Për t'u vendosur më vonë.

---

### 2. Header ngjan me Facebook

Arsyet:

- Cover shumë i madh
- Logo mbi cover
- Emër + butona në të djathtë
- Tabs poshtë

Nuk është kopje e Facebook.

Por jep ndjesi të ngjashme.

---

### 3. Emri i kompanisë

Aktualisht:

- shumë i vogël

Duhet:
- më i madh
- më dominues

---

### 4. Cover

Aktualisht:

h-[390px]

Për testim:

h-[260px]

ose

h-[240px]

---

### 5. Butonat

Telefono
WhatsApp
Favorit

janë pak dominues.

Mund të zvogëlohen 10-15%.

---

### 6. Mungojnë Stats Cards

Ide:

⭐ Rating

📁 Projekte

🏆 Eksperiencë

Kjo konsiderohet përmirësimi më i madh vizual që mund të bëhet në këtë moment.

---

## Shqetësimi kryesor

U pa qartë se:

- Company Profile
- Professional Profile
- Dashboard
- Admin

janë ndërtuar në periudha të ndryshme.

Për këtë arsye:

pamja dhe logjika nuk ndihen ende si një sistem unik.

Kjo nuk është problem arkitekture.

Është problem polish/finalizimi.

---

## Vendimi për nesër

MOS të fillohen feature të reja.

Fokus vetëm te:

Company Public Profile

derisa:

- të duket premium
- të duket unik
- të mos japë ndjesi Facebook

Vetëm pasi Company Profile të jetë final:

vazhdohet me:

- Professional Profile
- Homepage Final
- Dashboard Polish

---

## Gjëja më e rëndësishme

Sot nuk u zbulua problem me projektin.

Sot u zbulua se projekti ka hyrë në fazën:

"Funksionon, por duhet të rafinohet."

Kjo është fazë normale për çdo platformë serioze.