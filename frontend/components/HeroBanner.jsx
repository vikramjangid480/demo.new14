import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl, DEFAULT_IMAGES, handleImageError } from '../utils/imageUtils'

const HeroBanner = ({ banners = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Default banners if none provided
  const defaultBanners = [
    {
      id: 1,
      title: 'Welcome to Boganto',
      subtitle: 'Upload your own banners from the admin panel!',
      image_url: DEFAULT_IMAGES.HERO_BANNER,
      link_url: '/blog'
    }
  ]
  const slides = banners.length > 0 ? banners : defaultBanners

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isAutoPlaying, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  if (slides.length === 0) {
    return null
  }

  const currentBanner = slides[currentSlide]

  return (
    <section 
      className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(currentBanner.image_url, DEFAULT_IMAGES.HERO_BANNER)}
          alt={currentBanner.title}
          fill
          className="object-cover transition-opacity duration-500"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
          quality={85}
          loading="eager"
          onError={(e) => handleImageError(e, DEFAULT_IMAGES.HERO_BANNER)}
        />
        <div className="absolute inset-0 hero-section"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-shadow-lg leading-tight">
              {currentBanner.title}
            </h1>
            {currentBanner.subtitle && (
              <p className="text-xl md:text-2xl text-gray-200 mb-8 text-shadow leading-relaxed">
                {currentBanner.subtitle}
              </p>
            )}
            {currentBanner.link_url && (
              <Link
                href={currentBanner.link_url}
                className="btn-primary inline-flex items-center text-lg px-8 py-4 hover:bg-primary-700 transform hover:scale-105 transition-all duration-200"
              >
                Read More
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-primary-500'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroBanner