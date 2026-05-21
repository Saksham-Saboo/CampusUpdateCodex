ALTER TABLE public.colleges
  ADD COLUMN IF NOT EXISTS cat_cutoff numeric,
  ADD COLUMN IF NOT EXISTS placement_pct integer,
  ADD COLUMN IF NOT EXISTS hostel boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS scholarship boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS sponsored boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_colleges_sponsored ON public.colleges(sponsored) WHERE sponsored = true;
CREATE INDEX IF NOT EXISTS idx_colleges_cat_cutoff ON public.colleges(cat_cutoff);