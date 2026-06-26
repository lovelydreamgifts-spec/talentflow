-- TalentFlow — Plak dit in Supabase SQL Editor en klik Run

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','docent','bedrijf')),
  voornaam TEXT, achternaam TEXT, telefoon TEXT,
  woonplaats TEXT, rijbewijs TEXT DEFAULT 'geen',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.klassen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  docent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  naam TEXT NOT NULL, code TEXT UNIQUE NOT NULL,
  opleiding TEXT NOT NULL, crebo TEXT,
  schooljaar TEXT DEFAULT '2024/2025', school TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.klas_studenten (
  klas_id UUID REFERENCES public.klassen(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (klas_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.student_profielen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  klas_id UUID REFERENCES public.klassen(id),
  opleiding TEXT DEFAULT 'jam', niveau INT DEFAULT 4,
  kan_vaardigh JSONB DEFAULT '[]', wil_vaardigh JSONB DEFAULT '[]',
  sel_kerntaken JSONB DEFAULT '[]',
  school TEXT, startdatum TEXT, uren TEXT, duur TEXT,
  stagedagen JSONB DEFAULT '["Ma","Di","Wo","Do"]',
  talen JSONB DEFAULT '[{"nm":"Nederlands","lvl":5}]',
  certificaten JSONB DEFAULT '[]', werkervaring JSONB DEFAULT '[]',
  opleidingen JSONB DEFAULT '[]', video_url TEXT,
  video_avg_ok BOOLEAN DEFAULT FALSE, morgen_zin TEXT,
  profiel_gedeeld BOOLEAN DEFAULT TRUE,
  stap_bereikt INT DEFAULT 1, profiel_pct INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pok_documenten (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  klas_id UUID REFERENCES public.klassen(id),
  pdf_url TEXT, status TEXT DEFAULT 'concept',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.klassen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.klas_studenten ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profielen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pok_documenten ENABLE ROW LEVEL SECURITY;

CREATE POLICY "eigen_profiel" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "docent_klassen" ON public.klassen FOR ALL USING (docent_id = auth.uid());
CREATE POLICY "klas_lookup" ON public.klassen FOR SELECT USING (true);
CREATE POLICY "student_inschrijving" ON public.klas_studenten FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "klas_studenten_select" ON public.klas_studenten FOR SELECT USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.klassen WHERE id = klas_studenten.klas_id AND docent_id = auth.uid()));
CREATE POLICY "eigen_sp" ON public.student_profielen FOR ALL USING (student_id = auth.uid());
CREATE POLICY "docent_sp" ON public.student_profielen FOR SELECT USING (EXISTS (SELECT 1 FROM public.klassen k JOIN public.klas_studenten ks ON ks.klas_id = k.id WHERE ks.student_id = student_profielen.student_id AND k.docent_id = auth.uid()));
CREATE POLICY "eigen_pok" ON public.pok_documenten FOR ALL USING (student_id = auth.uid());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('videos','videos',false,524288000,ARRAY['video/mp4','video/quicktime','video/webm']),
       ('pok-docs','pok-docs',false,10485760,ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, voornaam, achternaam, role)
  VALUES (NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'voornaam',''),
    COALESCE(NEW.raw_user_meta_data->>'achternaam',''),
    COALESCE(NEW.raw_user_meta_data->>'role','student'));
  IF COALESCE(NEW.raw_user_meta_data->>'role','student') = 'student' THEN
    INSERT INTO public.student_profielen (student_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
