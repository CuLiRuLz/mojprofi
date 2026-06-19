# MOJPROFI ARCHITECTURE

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Supabase Auth
- Supabase Database

---

# Database Tables

## profiles

Ruajtja e kompanive dhe mjeshtërve.

Columns:

- id
- user_id
- account_type
- company_name
- first_name
- last_name
- email
- phone
- city_id
- created_at

Relations:

- profiles.city_id → cities.id
- profiles.user_id → auth.users.id

---

## projects

Projektet e kompanive.

Columns:

- id
- profile_id
- title
- description
- city_id
- created_at

Relations:

- projects.profile_id → profiles.id
- projects.city_id → cities.id

---

## cities

Lista e qyteteve.

Columns:

- id
- name
- created_at

Examples:

- Tetovë
- Gostivar
- Shkup
- Strugë

---

## categories

Lista e kategorive.

Columns:

- id
- name
- created_at

Examples:

- Fasada
- Trockenbau
- Renovime
- Elektricist
- Hidraulik

---

## profile_categories

Lidh kompani ↔ kategori.

Columns:

- id
- profile_id
- category_id
- is_main
- created_at

Relations:

- profile_id → profiles.id
- category_id → categories.id

---

## reviews

Vlerësimet e klientëve.

Columns:

- id
- profile_id
- reviewer_name
- rating
- comment
- created_at

Relations:

- profile_id → profiles.id

---

# Working Pages

## Public

### /

Homepage

### /search

Search companies

Filters:

- City
- Category

### /company/[slug]

Public company profile

Shows:

- Company info
- Contact
- City
- Projects

---

## Authentication

### /register

Choose account type

### /register/company

Company registration

### /register/professional

Professional registration

### /login

Login page

---

## Dashboard

### /dashboard

Protected dashboard

### /dashboard/profile

Edit profile

Fields:

- Company Name
- Phone
- City
- Main Category

### /dashboard/projects

Project management

Functions:

- Create project
- List projects
- Delete project

---

# Completed Features

## Auth

- Register
- Login
- Logout
- Protected Dashboard

## Profile

- Create Profile
- Edit Profile
- Save City
- Save Category

## Projects

- Create Project
- List Projects
- Delete Project

## Public Profile

- Company page
- Company projects
- City display

## Search

- Search by City
- Search by Category
- Search by City + Category

---

# Current Status

Project is functional.

Current phase:

MVP Development

Next tasks:

1. Show category on company profile
2. Show category on search cards
3. Edit project
4. Upload project photos
5. Reviews system
6. Favorites system
7. Company verification levels
8. Admin panel