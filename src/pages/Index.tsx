import ProfileHeader from "@/components/ProfileHeader";
import LinkCard from "@/components/LinkCard";
import { usePageView } from "@/hooks/usePageView";
import bannerMentoria from "@/assets/banner-mentoria.webp";
import bannerPlanilha from "@/assets/banner-planilha.jpg";
import bannerNetworkFree from "@/assets/banner-network-free.jpg";

const links = [
  { image: bannerMentoria, href: "/comunidade" },
  { image: bannerPlanilha, href: "/mentoria" },
  { image: bannerNetworkFree, href: "https://chat.whatsapp.com/SEUGRUPO", external: true },
];

const Index = () => {
  usePageView("/");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-4 pb-16">
        <ProfileHeader />

        {/* Links */}
        <div className="flex flex-col gap-5 mt-10">
          {links.map((link, i) => (
            <LinkCard
              key={i}
              {...link}
              animationDelay={`animate-fade-up-delay-${Math.min(i + 1, 4)}`}
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
