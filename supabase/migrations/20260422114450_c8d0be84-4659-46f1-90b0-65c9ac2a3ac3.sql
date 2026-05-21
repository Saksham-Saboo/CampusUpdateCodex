
-- Roles enum + table (separate from profiles for security)
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer role check (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text,
  email text,
  phone text,
  city text,
  target_degree text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + assign student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'phone');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Colleges catalogue
CREATE TABLE public.colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  location text NOT NULL,
  type text,                      -- e.g. Online MBA, Executive MBA, etc.
  degree text,                    -- MBA, BBA, etc.
  description text,
  fees_min int,
  fees_max int,
  duration text,
  rating numeric(2,1) DEFAULT 4.0,
  image_url text,
  logo_color text DEFAULT '#1043E9',
  accreditations text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  apply_link text,                -- bitly link
  brochure_link text,
  admission_open boolean DEFAULT true,
  featured boolean DEFAULT false,
  placement_avg int,
  placement_high int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Admins manage colleges" ON public.colleges FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON public.colleges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Applications
CREATE TYPE public.application_status AS ENUM ('submitted','under_review','accepted','rejected','waitlisted');

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  college_id uuid REFERENCES public.colleges(id) ON DELETE CASCADE NOT NULL,
  status application_status NOT NULL DEFAULT 'submitted',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, college_id)
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own apps" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own apps" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own apps" ON public.applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own apps" ON public.applications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all apps" ON public.applications FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update all apps" ON public.applications FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Saved colleges
CREATE TABLE public.saved_colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  college_id uuid REFERENCES public.colleges(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, college_id)
);
ALTER TABLE public.saved_colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own saved" ON public.saved_colleges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users save colleges" ON public.saved_colleges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unsave" ON public.saved_colleges FOR DELETE USING (auth.uid() = user_id);

-- Counselling leads (public form)
CREATE TABLE public.counselling_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text,
  degree text,
  budget text,
  message text,
  status text DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.counselling_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit lead" ON public.counselling_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view all leads" ON public.counselling_leads FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update leads" ON public.counselling_leads FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete leads" ON public.counselling_leads FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Seed sample colleges
INSERT INTO public.colleges (name, short_name, location, type, degree, description, fees_min, fees_max, duration, rating, logo_color, accreditations, tags, apply_link, admission_open, featured, placement_avg, placement_high) VALUES
('Indian Institute of Management Bangalore', 'IIMB', 'Bangalore, Karnataka', 'Full-time MBA', 'MBA', 'Premier B-school known for analytics, finance, and entrepreneurship.', 2400000, 2500000, '2 years', 4.9, '#1043E9', ARRAY['AACSB','EQUIS','AMBA'], ARRAY['Top Ranked','Tier 1','Residential'], 'https://example.com/apply/iimb', true, true, 3500000, 8500000),
('IIBM Institute of Business Management', 'IIBM', 'Online / Patna', 'Online MBA', 'MBA', 'Affordable industry-focused online MBA with flexible schedule.', 70000, 95000, '2 years', 4.4, '#F05A26', ARRAY['AICTE','IAO'], ARRAY['Online','Affordable','Working Professional'], 'https://bit.ly/iibm-apply', true, true, 800000, 1800000),
('Symbiosis Institute of Business Management', 'SIBM', 'Pune, Maharashtra', 'Full-time MBA', 'MBA', 'Renowned private B-school with strong industry connect.', 1900000, 2300000, '2 years', 4.7, '#7C3AED', ARRAY['NAAC A++','AICTE'], ARRAY['Top Ranked','Residential'], 'https://example.com/apply/sibm', true, true, 2400000, 5800000),
('Amity Online University', 'Amity', 'Online / Noida', 'Online MBA', 'MBA', 'Globally recognized online MBA with 25+ specializations.', 199000, 280000, '2 years', 4.3, '#059669', ARRAY['UGC','WES','AICTE'], ARRAY['Online','Global'], 'https://bit.ly/amity-apply', true, false, 950000, 2200000),
('Manipal Online MBA', 'MAHE', 'Online / Manipal', 'Online MBA', 'MBA', 'Top-rated online MBA from Manipal Academy of Higher Education.', 168000, 175000, '2 years', 4.5, '#0EA5E9', ARRAY['NAAC A++','UGC','WES'], ARRAY['Online','Premium'], 'https://bit.ly/manipal-apply', true, true, 1100000, 2600000),
('NMIMS Global Access', 'NMIMS', 'Online / Mumbai', 'Distance MBA', 'MBA', 'Distance learning MBA from NMIMS, ideal for working pros.', 165000, 180000, '2 years', 4.4, '#DC2626', ARRAY['UGC','AICTE'], ARRAY['Distance','Working Professional'], 'https://bit.ly/nmims-apply', true, false, 900000, 2000000);
