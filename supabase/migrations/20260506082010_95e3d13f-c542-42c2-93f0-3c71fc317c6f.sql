
-- LOAN LEADS
CREATE TABLE public.loan_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT,
  qualification TEXT,
  preferred_college TEXT,
  loan_amount TEXT,
  preferred_bank TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.loan_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit loan lead" ON public.loan_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view loan leads" ON public.loan_leads FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update loan leads" ON public.loan_leads FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete loan leads" ON public.loan_leads FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- NEWS ITEMS
CREATE TABLE public.news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  source_url TEXT,
  cover_image_url TEXT,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published news" ON public.news_items FOR SELECT USING (status = 'published' OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage news" ON public.news_items FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER news_items_updated BEFORE UPDATE ON public.news_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- BLOG POSTS
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  cover_image_url TEXT,
  excerpt TEXT,
  content TEXT,
  author_name TEXT,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published blog" ON public.blog_posts FOR SELECT USING (status = 'published' OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage blog" ON public.blog_posts FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER blog_posts_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
