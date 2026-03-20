import Image from "next/image";

export interface PageHeroProps {
  title: string;
  description: string;
  backgroundImage: string;
  alt?: string;
}

export function PageHero({
  title,
  description,
  backgroundImage,
  alt = "",
}: PageHeroProps) {
  return (
    <section className="relative h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] w-full flex flex-col items-center justify-center pt-20">
      <Image
        src={backgroundImage}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center px-4 max-w-3xl mt-8">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-2xl text-white/90">{description}</p>
      </div>
    </section>
  );
}
