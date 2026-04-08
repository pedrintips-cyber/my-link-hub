import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Copy, CheckCircle, Shield } from "lucide-react";
import { toast } from "sonner";

const AMOUNT_CENTS = 9790;
const PRODUCT_NAME = "PULSE CLUB — Acesso Vitalício";

type CheckoutStep = "form" | "loading" | "pix";

interface PixData {
  qr_code: string;
  qr_code_base64: string;
  expires_at: string;
  reference: string;
}

const formatCPF = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const Checkout = () => {
  const [step, setStep] = useState<CheckoutStep>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const isValid =
    name.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    document.replace(/\D/g, "").length === 11 &&
    phone.replace(/\D/g, "").length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setStep("loading");
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "create-paradise-transaction",
        {
          body: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            document: document.replace(/\D/g, ""),
            phone: phone.replace(/\D/g, ""),
            amount: AMOUNT_CENTS,
            description: PRODUCT_NAME,
          },
        }
      );

      if (fnError || !data?.success) {
        setError(data?.error || fnError?.message || "Erro ao gerar pagamento");
        setStep("form");
        return;
      }

      setPixData(data);
      setStep("pix");
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setStep("form");
    }
  };

  const handleCopy = async () => {
    if (!pixData?.qr_code) return;
    await navigator.clipboard.writeText(pixData.qr_code);
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050a18] text-white">
      <div className="max-w-md mx-auto px-4 py-6">
        <Link to="/comunidade" className="inline-flex items-center text-blue-300/70 hover:text-blue-200 text-sm transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Link>

        {step === "form" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-black">Finalizar Compra</h1>
              <p className="text-white/50 text-sm mt-1">{PRODUCT_NAME}</p>
              <div className="mt-3 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black text-[#00AEEF]">R$97</span>
                <span className="text-xl font-bold text-[#00AEEF]">,90</span>
              </div>
              <p className="text-white/40 text-xs mt-1">Pagamento único via PIX</p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-white/80 text-sm">Nome completo</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João da Silva"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00AEEF]"
                  required
                />
              </div>
              <div>
                <Label className="text-white/80 text-sm">E-mail</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@email.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00AEEF]"
                  required
                />
              </div>
              <div>
                <Label className="text-white/80 text-sm">CPF</Label>
                <Input
                  value={document}
                  onChange={(e) => setDocument(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00AEEF]"
                  required
                />
              </div>
              <div>
                <Label className="text-white/80 text-sm">Telefone (com DDD)</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#00AEEF]"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={!isValid}
                className="w-full py-6 text-base font-bold bg-[#00AEEF] hover:bg-[#0099d4] text-white rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,174,239,0.4)] disabled:opacity-40"
              >
                GERAR PIX — R$ 97,90
              </Button>

              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <p className="text-xs text-white/50">Garantia de 15 dias ou seu dinheiro de volta</p>
              </div>
            </form>
          </div>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#00AEEF] animate-spin" />
            <p className="text-white/60 text-sm">Gerando seu QR Code PIX...</p>
          </div>
        )}

        {step === "pix" && pixData && (
          <div className="space-y-6 text-center">
            <div>
              <h1 className="text-2xl font-black text-[#00AEEF]">PIX Gerado!</h1>
              <p className="text-white/50 text-sm mt-1">Escaneie o QR Code ou copie o código</p>
            </div>

            {pixData.qr_code_base64 && (
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-2xl">
                  <img
                    src={pixData.qr_code_base64}
                    alt="QR Code PIX"
                    className="w-52 h-52"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs text-white/40">Código PIX (copia e cola):</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70 break-all font-mono leading-relaxed">
                  {pixData.qr_code?.slice(0, 80)}...
                </p>
              </div>
              <Button
                onClick={handleCopy}
                className="w-full py-5 font-bold bg-[#00AEEF] hover:bg-[#0099d4] text-white rounded-xl"
              >
                {copied ? (
                  <><CheckCircle className="w-5 h-5 mr-2" /> Copiado!</>
                ) : (
                  <><Copy className="w-5 h-5 mr-2" /> Copiar Código PIX</>
                )}
              </Button>
            </div>

            {pixData.expires_at && (
              <p className="text-xs text-white/40">
                Expira em: {new Date(pixData.expires_at).toLocaleString("pt-BR")}
              </p>
            )}

            <div className="pt-4 border-t border-white/10">
              <p className="text-white/50 text-sm">
                Após o pagamento, você receberá o acesso no e-mail <strong className="text-white/80">{email}</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;