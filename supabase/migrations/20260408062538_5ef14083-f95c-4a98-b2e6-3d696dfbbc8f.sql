CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paradise_id text,
  reference text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  amount integer NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_document text NOT NULL,
  customer_phone text NOT NULL,
  qr_code text,
  qr_code_base64 text,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert transactions"
  ON public.transactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Edge functions can update transactions"
  ON public.transactions FOR UPDATE
  TO anon, authenticated
  USING (true);

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();