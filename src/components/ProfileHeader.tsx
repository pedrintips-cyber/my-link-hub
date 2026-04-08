import { Instagram, Youtube } from "lucide-react";
import bannerImg from "@/assets/banner.jpg";

const ProfileHeader = () => {
  return (
    <div className="animate-fade-up">
      {/* Banner */}
      <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden card-glow">
        <img src={bannerImg} alt="Banner" className="w-full h-full object-cover" width={1920} height={640} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center -mt-14 relative z-10">
        <div className="w-28 h-28 rounded-full border-4 border-background overflow-hidden card-glow bg-secondary">
          <div className="w-full h-full gold-gradient flex items-center justify-center text-primary-foreground text-3xl font-black">
            S
          </div>
        </div>

        <h1 className="mt-3 text-2xl font-black text-foreground tracking-tight">Seu Nome</h1>
        <p className="text-muted-foreground text-sm mt-1 text-center max-w-xs leading-relaxed">
          Empresário digital · +6 dígitos · Ajudando você a escalar seus resultados 🚀
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-3 mt-3">
          <a href="#" className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
            <Youtube className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
