import ProfileHeader from "@/components/ProfileHeader";
import LinkCard from "@/components/LinkCard";
import mentoriaIcon from "@/assets/mentoria-icon.png";
import planilhaIcon from "@/assets/planilha-icon.png";
import networkIcon from "@/assets/network-icon.png";

const links = [
  {
    title: "Mentoria Premium",
    description: "Mentoria exclusiva + acesso ao grupo VIP de network com quem fez +6 dígitos",
    image: mentoriaIcon,
    href: "#",
    badge: "🔥 MAIS VENDIDO",
    isPaid: true,
    price: "R$ 997,00",
  },
  {
    title: "Planilha Personalizada",
    description: "Controle total das suas finanças e métricas do seu negócio digital",
    image: planilhaIcon,
    href: "#",
    isPaid: true,
    price: "R$ 97,00",
  },
  {
    title: "Grupo de Network FREE",
    description: "Entre no nosso grupo gratuito do WhatsApp e conecte-se com empreendedores",
    image: networkIcon,
    href: "#",
    badge: "GRÁTIS",
  },
  {
    title: "Grupo VIP Network",
    description: "Acesso exclusivo ao grupo privado com empreendedores de +6 dígitos",
    image: networkIcon,
    href: "#",
    badge: "EXCLUSIVO",
    isPaid: true,
    price: "Incluído na Mentoria",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8 pb-16">
        <ProfileHeader />

        {/* Section title */}
        <div className="mt-10 mb-5 animate-fade-up animate-fade-up-delay-1">
          <h2 className="text-lg font-bold gold-text">Meus Links</h2>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          {links.map((link, i) => (
            <LinkCard
              key={link.title}
              {...link}
              animationDelay={`animate-fade-up-delay-${Math.min(i + 2, 4)}`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center animate-fade-up animate-fade-up-delay-4">
          <p className="text-xs text-muted-foreground">© 2026 · Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
