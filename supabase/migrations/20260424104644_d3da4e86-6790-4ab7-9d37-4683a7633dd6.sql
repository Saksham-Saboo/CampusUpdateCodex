-- Create public bucket for college images
INSERT INTO storage.buckets (id, name, public)
VALUES ('college-images', 'college-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Public can view college images"
ON storage.objects FOR SELECT
USING (bucket_id = 'college-images');

-- Admin uploads
CREATE POLICY "Admins can upload college images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'college-images' AND public.has_role(auth.uid(), 'admin'));

-- Admin updates
CREATE POLICY "Admins can update college images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'college-images' AND public.has_role(auth.uid(), 'admin'));

-- Admin deletes
CREATE POLICY "Admins can delete college images"
ON storage.objects FOR DELETE
USING (bucket_id = 'college-images' AND public.has_role(auth.uid(), 'admin'));