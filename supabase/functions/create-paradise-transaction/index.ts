import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const PARADISE_BASE = "https://multi.paradisepags.com/api/v1";

const bodySchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(255),
  document: z.string().regex(/^\d{11,14}$/, "CPF ou CNPJ inválido"),
  phone: z.string().regex(/^\d{10,11}$/, "Telefone inválido"),
  amount: z.number().int().positive(),
  description: z.string().min(1).max(500),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const PARADISE_API_KEY = Deno.env.get("PARADISE_API_KEY");
    if (!PARADISE_API_KEY) {
      throw new Error("PARADISE_API_KEY is not configured");
    }

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { name, email, document, phone, amount, description } = parsed.data;
    const reference = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Create transaction on Paradise
    const paradiseRes = await fetch(`${PARADISE_BASE}/transaction.php`, {
      method: "POST",
      headers: {
        "X-API-Key": PARADISE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        description,
        reference,
        source: "api_externa",
        customer: { name, email, document, phone },
      }),
    });

    const paradiseData = await paradiseRes.json();

    if (!paradiseRes.ok || paradiseData.status !== "success") {
      console.error("Paradise API error:", paradiseData);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar pagamento PIX", details: paradiseData }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save to DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("transactions").insert({
      paradise_id: String(paradiseData.transaction_id),
      reference,
      status: "pending",
      amount,
      customer_name: name,
      customer_email: email,
      customer_document: document,
      customer_phone: phone,
      qr_code: paradiseData.qr_code,
      qr_code_base64: paradiseData.qr_code_base64,
      expires_at: paradiseData.expires_at,
    });

    return new Response(
      JSON.stringify({
        success: true,
        reference,
        qr_code: paradiseData.qr_code,
        qr_code_base64: paradiseData.qr_code_base64,
        amount: paradiseData.amount,
        expires_at: paradiseData.expires_at,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});