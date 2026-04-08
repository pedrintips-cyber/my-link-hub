DROP POLICY "Anyone can insert transactions" ON public.transactions;
CREATE POLICY "Anyone can insert pending transactions"
  ON public.transactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

DROP POLICY "Edge functions can update transactions" ON public.transactions;
CREATE POLICY "Service can update transaction status"
  ON public.transactions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);