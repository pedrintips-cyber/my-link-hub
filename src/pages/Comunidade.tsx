import { usePageView } from "@/hooks/usePageView";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Users, Zap, Trophy, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  { icon: Users, text: "Network com pessoas que faturam +6 dígitos" },
  { icon: Zap, text: "Conteúdos exclusivos e atualizados semanalmente" },
  { icon: Trophy, text: "Desafios e metas para escalar seus resultados" },
  { icon: MessageCircle, text: "Grupo VIP no WhatsApp com suporte direto" },
];

const Comunidade = () => {
  usePageView("/comunidade");
  const { data: settings } = useSiteSettings();

  const whatsappUrl = settings?.whatsapp_url || "#";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6 pb-16">
        {/* Back */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Link>

        {/* Hero */}
        <div className="text-center animate-fade-up">
          <h1 className="text-3xl font-black gold-text mb-3">Comunidade VIP</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Faça parte do grupo mais exclusivo de empreendedores digitais do Brasil. 
            Aqui você conecta com quem realmente faz acontecer.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 space-y-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 4)}`}
            >
              <b.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">{b.text}</p>
            </div>
          ))}
        </div>

        {/* What you get */}
        <div className="mt-10 animate-fade-up animate-fade-up-delay-3">
          <h2 className="text-lg font-bold text-foreground mb-4">O que você recebe:</h2>
          <div className="space-y-2">
            {[
              "Acesso ao grupo VIP no WhatsApp",
              "Calls semanais com a comunidade",
              "Material de estudo exclusivo",
              "Networking com top players",
              "Suporte e mentoria em grupo",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center animate-fade-up animate-fade-up-delay-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="w-full text-base font-bold py-6 gold-gradient text-primary-foreground hover:opacity-90 transition-opacity">
              <MessageCircle className="w-5 h-5 mr-2" />
              Quero Entrar na Comunidade
            </Button>
          </a>
          <p className="text-xs text-muted-foreground mt-3">
            Ao clicar, você será redirecionado para o WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comunidade;
