"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { carouselData, appConfig } from "../../data"
import { TechCarouselCard } from "./tech-carousel-card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel"

interface CarouselSectionProps {
  className?: string
  isPaused?: boolean
}

export function CarouselSection({
  className = "",
  isPaused = false,
}: CarouselSectionProps) {
  const carouselApiRef = useRef<CarouselApi | null>(null)
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const setCarouselApi = useCallback((api: CarouselApi) => {
    carouselApiRef.current = api
  }, [])

  const goToSlide = useCallback((index: number) => {
    if (carouselApiRef.current) {
      carouselApiRef.current.scrollTo(index)
      setActiveIndex(index)
    }
  }, [])

  const nextSlide = useCallback(() => {
    if (!isPaused && carouselApiRef.current) {
      carouselApiRef.current.scrollNext()
      setActiveIndex((prev) => (prev + 1) % carouselData.length)
    }
  }, [isPaused])

  useEffect(() => {
    if (appConfig.carousel.autoPlay && !isPaused) {
      autoSlideIntervalRef.current = setInterval(
        nextSlide,
        appConfig.carousel.interval
      )
    }
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
      }
    }
  }, [nextSlide, isPaused])

  return (
    <div className={`relative ${className}`}>
      <div className="relative h-[280px] overflow-hidden border border-[#333]">
        <Carousel
          setApi={setCarouselApi}
          className="h-full"
          opts={{ 
            watchDrag: false,
            loop: true
          }}
        >
          <CarouselContent className="h-full" style={{ height: "280px" }}>
            {carouselData.map((item) => (
              <CarouselItem
                key={item.id}
                className="h-full pl-0"
                style={{ height: "280px" }}
              >
                <TechCarouselCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute right-0 bottom-2 left-0 flex justify-center gap-2">
          {carouselData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
                activeIndex === idx
                  ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}