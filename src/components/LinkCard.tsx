interface LinkCardProps {
  image: string;
  href: string;
  animationDelay?: string;
}

const LinkCard = ({ image, href, animationDelay = "" }: LinkCardProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] animate-fade-up ${animationDelay}`}
    >
      {/* LED glow behind */}
      <div className="absolute -inset-1 rounded-xl bg-primary/15 blur-lg group-hover:bg-primary/25 transition-all duration-300" />

      {/* Banner with border */}
      <div className="relative rounded-xl border-2 border-primary/20 group-hover:border-primary/40 overflow-hidden transition-colors duration-300">
        <div className="aspect-[16/10]">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            width={1024}
            height={640}
          />
        </div>
      </div>
    </a>
  );
};

export default LinkCard;
