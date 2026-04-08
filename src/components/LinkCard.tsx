import { ExternalLink } from "lucide-react";

interface LinkCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  badge?: string;
  isPaid?: boolean;
  price?: string;
  animationDelay?: string;
}

const LinkCard = ({ title, description, image, href, badge, isPaid, price, animationDelay = "" }: LinkCardProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-xl bg-card border border-border card-glow hover:card-glow-hover transition-all duration-300 hover:scale-[1.02] overflow-hidden animate-fade-up ${animationDelay}`}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
          <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" width={64} height={64} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{title}</h3>
            {badge && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full gold-gradient text-primary-foreground flex-shrink-0">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          {isPaid && price && (
            <p className="text-sm font-bold gold-text mt-1">{price}</p>
          )}
        </div>
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
      </div>
    </a>
  );
};

export default LinkCard;
