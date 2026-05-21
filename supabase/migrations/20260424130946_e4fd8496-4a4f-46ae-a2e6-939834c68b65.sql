-- Defense-in-depth: explicit RESTRICTIVE policy preventing any authenticated user
-- from inserting roles for themselves. This blocks privilege escalation even if
-- a future permissive policy is accidentally added.
CREATE POLICY "Block self role assignment"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Also restrict UPDATE/DELETE in the same restrictive manner
CREATE POLICY "Block self role modification"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Block self role deletion"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));