CREATE POLICY "Anyone can check transaction status by reference"
ON public.transactions
FOR SELECT
TO anon, authenticated
USING (true);