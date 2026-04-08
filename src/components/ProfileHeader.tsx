import { Instagram, Youtube } from "lucide-react";

const ProfileHeader = () => {
  return (
    <div className="flex flex-col items-center pt-8 animate-fade-up">
      {/* Floating Avatar with glow */}
      <div className="relative">
        <div className="absolute -inset-2 rounded-full bg-primary/20 blur-xl" />
        <div className="relative w-28 h-28 rounded-full border-2 border-primary/40 overflow-hidden card-glow bg-secondary">
          <div className="w-full h-full gold-gradient flex items-center justify-center text-primary-foreground text-3xl font-black">
            S
          </div>
        </div>
      </div>

      <h1 className="mt-4 text-2xl font-black text-foreground tracking-tight">Seu Nome</h1>
      <p className="text-muted-foreground text-sm mt-1.5 text-center max-w-xs leading-relaxed">
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
  );
};

export default ProfileHeader;
