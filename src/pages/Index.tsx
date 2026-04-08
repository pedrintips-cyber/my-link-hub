import ProfileHeader from "@/components/ProfileHeader";
import LinkCard from "@/components/LinkCard";
import { usePageView } from "@/hooks/usePageView";
import { useBanners } from "@/hooks/useBanners";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import bannerComunidade from "@/assets/banner-comunidade.webp";
import bannerMentoria from "@/assets/banner-mentoria.webp";
import bannerWhatsapp from "@/assets/banner-network-free.jpg";

const fallbackImages: Record<number, string> = {
  1: bannerComunidade,
  2: bannerMentoria,
  3: bannerWhatsapp,
};

const Index = () => {
  usePageView("/");
  const { data: banners } = useBanners();
  const { data: settings } = useSiteSettings();

  const links = (banners || []).map((b) => {
    const bannerHref =
      b.position === 3 && (!b.link_url || b.link_url === "#" || b.link_url === "#whatsapp")
        ? settings?.whatsapp_url || "#"
        : b.link_url || "#";

    return {
      image: b.image_url || fallbackImages[b.position] || bannerWhatsapp,
      href: bannerHref,
      external: b.link_type === "external",
    };
  });

  // Fallback if no banners in DB yet
  const displayLinks = links.length > 0 ? links : [
    { image: bannerComunidade, href: "/comunidade", external: false },
    { image: bannerMentoria, href: "/mentoria", external: false },
    { image: bannerWhatsapp, href: "#", external: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-4 pb-16">
        <ProfileHeader />

        {/* Links */}
        <div className="flex flex-col gap-5 mt-10">
          {displayLinks.map((link, i) => (
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
