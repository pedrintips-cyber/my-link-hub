import { useState } from "react";
import { usePageView } from "@/hooks/usePageView";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { ArrowLeft, Flame, Users, Target, Zap, MessageCircle, Video, Globe, ShoppingCart, TrendingUp, Smartphone, BookOpen, CreditCard, Shield, ChevronDown, ChevronUp, CheckCircle, Star, Headphones, Rocket, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import mascotImg from "@/assets/mascot-monkey.png";

const modules = [
  { icon: Video, title: "VSL de alta conversão" },
  { icon: Globe, title: "Criação de sites" },
  { icon: Target, title: "Direct Response" },
  { icon: TrendingUp, title: "Mineração de ofertas" },
  { icon: Smartphone, title: "TikTok Ads" },
  { icon: ShoppingCart, title: "Tráfego para delivery" },
  { icon: Rocket, title: "Ofertas globais" },
  { icon: CreditCard, title: "Gateway de pagamento" },
  { icon: Users, title: "Afiliado interno" },
];

const benefits = [
  { icon: Video, title: "Calls ao vivo semanais", desc: "Toda semana uma call de estratégia ao vivo" },
  { icon: BarChart3, title: "Estratégias atualizadas", desc: "Marketing digital em constante evolução" },
  { icon: Zap, title: "Ferramentas prontas", desc: "Templates, scripts e criativos prontos" },
  { icon: Headphones, title: "Suporte direto", desc: "Tire dúvidas diretamente com a equipe" },
  { icon: Star, title: "Acesso vitalício", desc: "Pague uma vez, acesse para sempre" },
];

const faqs = [
  { q: "O acesso é imediato?", a: "Sim! Após a confirmação do pagamento, você recebe o acesso imediatamente." },
  { q: "É mensalidade?", a: "Não! O pagamento é único e o acesso é vitalício." },
  { q: "Posso pedir reembolso?", a: "Sim, você tem 15 dias de garantia incondicional." },
  { q: "Funciona no celular?", a: "Sim! Todo o conteúdo é 100% acessível pelo celular." },
];

const Comunidade = () => {
  usePageView("/comunidade");
  const { data: settings } = useSiteSettings();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const whatsappUrl = settings?.whatsapp_url || "#";

  return (
    <div className="min-h-screen bg-[#050a18] text-white">
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <Link to="/" className="inline-flex items-center text-white/50 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Link>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF]/10 via-transparent to-[#0066cc]/10" />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-up">
              <p className="text-sm text-[#00AEEF] font-semibold mb-4 flex items-center gap-1">
                <Flame className="w-4 h-4" /> Promoção via PIX válida até o final do mês
              </p>
              <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
                Entre para a comunidade que está criando{" "}
                <span className="text-[#00AEEF]">novos players</span> no digital.
              </h1>
              <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                A PULSE CLUB reúne iniciantes e players avançados com um único objetivo: fazer você faturar com consistência.
              </p>
              <a href="#oferta">
                <button className="px-8 py-4 bg-[#00AEEF] hover:bg-[#0099d4] text-white font-bold rounded-xl text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,174,239,0.4)] hover:scale-105">
                  QUERO ENTRAR AGORA
                </button>
              </a>
            </div>
            <div className="relative flex justify-center animate-fade-up animate-fade-up-delay-2">
              <div className="absolute inset-0 bg-[#00AEEF]/15 blur-[80px] rounded-full" />
              <img src={mascotImg} alt="PULSE CLUB Mascot" className="relative z-10 w-64 md:w-80 drop-shadow-2xl" width={768} height={1024} />
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Sobre a <span className="text-[#00AEEF]">Comunidade</span></h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10">
            Aqui você não recebe motivação vazia. Você recebe direção, estratégia e execução.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, t: "Comunidade ativa" },
              { icon: Target, t: "Networking com players" },
              { icon: TrendingUp, t: "Foco em resultado" },
              { icon: Zap, t: "Conteúdo direto ao ponto" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00AEEF]/30 transition-colors">
                <item.icon className="w-6 h-6 text-[#00AEEF] mx-auto mb-2" />
                <p className="text-sm font-semibold">{item.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ RECEBE */}
      <section className="py-16 md:py-20 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10">O que você <span className="text-[#00AEEF]">recebe</span></h2>
          <div className="grid md:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#00AEEF]/30 transition-all duration-300 hover:bg-white/[0.06]">
                <b.icon className="w-8 h-8 text-[#00AEEF] mb-3" />
                <h3 className="font-bold text-base mb-1">{b.title}</h3>
                <p className="text-white/50 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUEBRA DE OBJEÇÃO */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Isso realmente <span className="text-[#00AEEF]">funciona?</span></h2>
          <p className="text-white/60 leading-relaxed">
            Vamos ser diretos: não existe promessa mágica.
            <br />
            Mas com o direcionamento certo, você consegue evoluir muito mais rápido do que sozinho.
          </p>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="py-16 md:py-20 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10">Prova <span className="text-[#00AEEF]">Social</span></h2>
          <div className="grid md:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/60 text-sm italic mb-3">"Depoimento de resultado — em breve serão adicionados depoimentos reais dos membros da comunidade."</p>
                <p className="text-xs font-semibold text-white/40">Membro #{i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA INTERMEDIÁRIO */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">QUERO SER O <span className="text-[#00AEEF]">PRÓXIMO</span></h2>
          <a href="#oferta">
            <button className="px-10 py-4 bg-[#00AEEF] hover:bg-[#0099d4] text-white font-bold rounded-xl text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,174,239,0.4)] hover:scale-105">
              ENTRAR AGORA
            </button>
          </a>
        </div>
      </section>

      {/* MÓDULOS */}
      <section className="py-16 md:py-20 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10">Módulos <span className="text-[#00AEEF]">Exclusivos</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {modules.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00AEEF]/30 transition-colors">
                <m.icon className="w-5 h-5 text-[#00AEEF] shrink-0" />
                <span className="text-sm font-medium">{m.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFERTA */}
      <section id="oferta" className="py-16 md:py-24">
        <div className="max-w-xl mx-auto px-4">
          <div className="relative rounded-2xl bg-gradient-to-b from-[#00AEEF]/10 to-[#050a18] border border-[#00AEEF]/30 overflow-hidden">
            <div className="absolute -inset-1 rounded-2xl bg-[#00AEEF]/5 blur-xl -z-10" />
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00AEEF]/20 to-[#00AEEF]/5 px-6 py-4 border-b border-[#00AEEF]/20">
              <p className="text-center text-sm font-bold text-[#00AEEF] uppercase tracking-wider flex items-center justify-center gap-2">
                <Flame className="w-4 h-4" /> Oferta especial por tempo limitado
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* O que está incluso */}
              <div>
                <p className="text-sm font-semibold text-white/80 mb-3">Tudo que você recebe:</p>
                <div className="space-y-2.5">
                  {[
                    "Acesso vitalício à comunidade PULSE CLUB",
                    "Calls ao vivo semanais com estratégias reais",
                    "9 módulos completos de marketing digital",
                    "Ferramentas, templates e scripts prontos",
                    "Networking com players ativos do mercado",
                    "Suporte direto com a equipe",
                    "Todas as atualizações futuras incluídas",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#00AEEF] shrink-0 mt-0.5" />
                      <span className="text-sm text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preço */}
              <div className="text-center pt-2 pb-1 border-t border-white/5">
                <p className="text-white/40 line-through text-base mb-1">De R$197,00</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg text-white/50">por</span>
                  <span className="text-5xl md:text-6xl font-black text-[#00AEEF]">R$97</span>
                  <span className="text-2xl font-bold text-[#00AEEF]">,90</span>
                </div>
                <p className="text-white/50 text-xs mt-1">Pagamento único · Acesso vitalício</p>
              </div>

              {/* CTA */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <button className="w-full px-8 py-4 bg-[#00AEEF] hover:bg-[#0099d4] text-white font-bold rounded-xl text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,174,239,0.4)] hover:scale-105 mt-2">
                  GARANTIR MINHA VAGA
                </button>
              </a>

              {/* Garantia inline */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <Shield className="w-4 h-4 text-green-400" />
                <p className="text-xs text-white/50">Garantia de 15 dias ou seu dinheiro de volta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="py-16 md:py-20 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-[#00AEEF] mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-3">Garantia de <span className="text-[#00AEEF]">15 dias</span></h2>
          <p className="text-white/60">
            Teste por 15 dias. Se não gostar, devolvemos 100% do seu dinheiro.
          </p>
        </div>
      </section>

      {/* SUPORTE */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-3">Ficou com <span className="text-[#00AEEF]">dúvida?</span></h2>
          <p className="text-white/60 mb-6">Fale diretamente no WhatsApp.</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> TIRAR DÚVIDAS
            </button>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-white/[0.02]">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10">Perguntas <span className="text-[#00AEEF]">Frequentes</span></h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#00AEEF]" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-white/60 text-sm">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#00AEEF]/10 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-black mb-2">ÚLTIMAS VAGAS <span className="text-[#00AEEF]">DISPONÍVEIS</span></h2>
          <p className="text-white/50 mb-8">Não perca essa oportunidade.</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <button className="px-12 py-4 bg-[#00AEEF] hover:bg-[#0099d4] text-white font-bold rounded-xl text-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,174,239,0.5)] hover:scale-105">
              ENTRAR AGORA
            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-white/10">
        <p className="text-center text-xs text-white/30">© 2026 PULSE CLUB · Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

export default Comunidade;
