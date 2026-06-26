# TalentFlow — Deployment in 3 stappen

## STAP 1: Database (5 minuten)
1. Ga naar: https://supabase.com/dashboard/project/rhpqznyfnxrjlrsjiyfw/sql/new
2. Kopieer alles uit `supabase-migrations.sql`
3. Plak in de SQL Editor → klik **RUN**
4. Zet email bevestiging UIT: https://supabase.com/dashboard/project/rhpqznyfnxrjlrsjiyfw/auth/providers
   → Email → "Confirm email" → UIT → Save

## STAP 2: GitHub (5 minuten)
1. Ga naar github.com → New repository → naam: "talentflow" → Create
2. Upload alle bestanden uit deze ZIP (drag & drop op GitHub)

## STAP 3: Vercel (5 minuten)
1. Ga naar vercel.com → "Add New Project"
2. Importeer je GitHub "talentflow" repository
3. Klik **Deploy** — klaar!
4. Je URL is bijv: talentflow.vercel.app

## Eerste gebruik
1. Ga naar /auth/register → kies Docent → maak account
2. Log in → ga naar "Klassen beheren" → maak klas aan
3. Kopieer de klascode (bijv. COMM4A)
4. Stuur studenten naar /auth/register → Student → klascode invullen

## Omgevingsvariabelen (al ingesteld)
NEXT_PUBLIC_SUPABASE_URL=https://rhpqznyfnxrjlrsjiyfw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_lblRq1p075VdzLkWBA3fDA_IfWLx6kF

## Kosten: €0 voor een pilot
