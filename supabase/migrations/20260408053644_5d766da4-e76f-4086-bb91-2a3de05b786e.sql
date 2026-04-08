
-- Drop the overly permissive policy and replace with a more specific one
DROP POLICY "Anyone can insert page views" ON public.page_views;

-- Allow anonymous inserts but only for the page column
CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    page IS NOT NULL AND length(page) < 200
  );
