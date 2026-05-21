-- Defense-in-depth: restrictive policies covering ALL roles (including anon)
-- to ensure only admins can ever modify the user_roles table.

DROP POLICY IF EXISTS "Block self role assignment" ON public.user_roles;
DROP POLICY IF EXISTS "Block self role modification" ON public.user_roles;
DROP POLICY IF EXISTS "Block self role deletion" ON public.user_roles;

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO public
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO public
USING (public.has_role(auth.uid(), 'admin'));