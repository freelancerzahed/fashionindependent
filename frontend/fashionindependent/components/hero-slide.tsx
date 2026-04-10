import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroSlideProps {
  title: string
  subtitle: string
  description: string
  image: string
  ctaText: string
  ctaLink: string
}

export function HeroSlide({ title, subtitle, description, image, ctaText, ctaLink }: HeroSlideProps) {
  return (
    <div
      className="relative h-96 md:h-[500px] bg-cover bg-center rounded-lg overflow-hidden"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <p className="text-sm font-medium mb-2 opacity-90">{subtitle}</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{title}</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-95">{description}</p>
        <Button size="lg" variant="secondary" asChild>
          <Link href={ctaLink}>{ctaText}</Link>
        </Button>
      </div>
    </div>
  )
}
