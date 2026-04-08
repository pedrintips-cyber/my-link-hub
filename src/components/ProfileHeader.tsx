import { Instagram, Youtube } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const ProfileHeader = () => {
  const { data: settings } = useSiteSettings();

  const name = settings?.profile_name || "Seu Nome";
  const bio = settings?.bio || "";
  const avatarUrl = settings?.profile_image_url;
  const instagramUrl = settings?.instagram_url;
  const youtubeUrl = settings?.youtube_url;

  return (
    <div className="flex flex-col items-center pt-8 animate-fade-up">
      {/* Floating Avatar with glow */}
      <div className="relative">
        <div className="absolute -inset-2 rounded-full bg-primary/20 blur-xl" />
        <div className="relative w-28 h-28 rounded-full border-2 border-primary/40 overflow-hidden card-glow bg-secondary">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full gold-gradient flex items-center justify-center text-primary-foreground text-3xl font-black">
              {name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <h1 className="mt-4 text-2xl font-black text-foreground tracking-tight">{name}</h1>
      <p className="text-muted-foreground text-sm mt-1.5 text-center max-w-xs leading-relaxed">
        {bio}
      </p>

      {/* Social icons */}
      <div className="flex items-center gap-3 mt-3">
        {instagramUrl && (
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
            <Instagram className="w-5 h-5" />
          </a>
        )}
        {youtubeUrl && (
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
            <Youtube className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
