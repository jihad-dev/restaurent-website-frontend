
import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Sparkles,
  Flame,
  Tag,
  Clock,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetActiveBannersQuery } from "../../../Redux/features/banner/bannerApi";

interface Banner {
  _id?: string;
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  promoCode?: string;
  discountPercentage?: number;
  linkUrl?: string;
  accentColor?: string;
  badgeText?: string;
  badgeIcon?: "sparkles" | "flame" | "clock" | "award";
}

export const HeroBanner: React.FC = () => {
  const { data: responseData, isLoading } = useGetActiveBannersQuery(undefined);

  const banners: Banner[] =
    ((Array.isArray(responseData)
      ? responseData
      : responseData?.data) as Banner[]) || [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Track image load status for smooth fade-in
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const totalSlides = banners.length;
  const SLIDE_DURATION = 5500;

  const handleNext = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Auto slide timer
  useEffect(() => {
    if (isPaused || totalSlides === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused, handleNext, totalSlides]);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  // Touch handlers for swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const renderBadgeIcon = (icon?: string) => {
    switch (icon) {
      case "flame":
        return (
          <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
        );
      case "clock":
        return <Clock className="w-3.5 h-3.5 text-pink-400" />;
      case "award":
        return <Award className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  // ✅ 1. Premium Skeleton UI while API loads
  if (isLoading) {
    return (
      <div className="w-full h-[450px] sm:h-[500px] md:h-[540px] rounded-3xl bg-slate-900 border border-slate-800 animate-pulse my-6 p-8 sm:p-16 flex flex-col justify-end space-y-4">
        <div className="h-6 bg-slate-800 rounded-full w-32" />
        <div className="h-12 bg-slate-800 rounded-2xl w-3/4 sm:w-1/2" />
        <div className="h-6 bg-slate-800/60 rounded-xl w-2/3 sm:w-1/3" />
        <div className="h-12 bg-slate-800 rounded-2xl w-40 pt-4" />
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] my-6 text-white group select-none"
    >
      {/* Dynamic Animated Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-gradient-to-br ${
            banners[currentSlide]?.accentColor || "from-amber-500 to-orange-500"
          } opacity-25 blur-[120px] transition-all duration-1000 ease-in-out`}
        />
        <div
          className={`absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr ${
            banners[currentSlide]?.accentColor || "from-amber-500 to-orange-500"
          } opacity-20 blur-[130px] transition-all duration-1000 ease-in-out`}
        />
      </div>

      {/* Slide Track */}
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] z-10 relative"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners?.map((banner, idx) => {
          const isActive = currentSlide === idx;
          const isImgLoaded = loadedImages[idx];

          return (
            <div
              key={banner._id || banner.id || idx}
              className="min-w-full relative h-[450px] sm:h-[500px] md:h-[540px] flex items-center overflow-hidden bg-slate-950"
            >
              {/* Background Image with Blur Placeholder & Smooth Fade-in */}
              <div className="absolute inset-0 overflow-hidden bg-slate-900">
                {!isImgLoaded && (
                  <div className="absolute inset-0 bg-slate-900 animate-pulse" />
                )}
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  loading="eager"
                  fetchPriority="high"
                  onLoad={() => handleImageLoad(idx)}
                  className={`w-full h-full object-cover transform transition-all duration-[1000ms] ease-out ${
                    isImgLoaded ? "opacity-100" : "opacity-0"
                  } ${isActive ? "scale-110" : "scale-100"}`}
                />
              </div>

              {/* Multi-layer Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 via-40% to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />

              {/* Content Box */}
              <div className="relative z-10 max-w-2xl px-6 sm:px-12 md:px-16 space-y-4">
                {/* Badges */}
                <div
                  className={`flex flex-wrap items-center gap-2.5 transition-all duration-700 delay-100 ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  {banner.discountPercentage && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25">
                      <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                      {banner.discountPercentage}% OFF
                    </span>
                  )}

                  {banner.badgeText && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-amber-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-inner">
                      {renderBadgeIcon(banner.badgeIcon)}
                      {banner.badgeText}
                    </span>
                  )}
                </div>

                {/* Subtitle */}
                {banner.subtitle && (
                  <p
                    className={`text-amber-400/90 text-xs sm:text-sm uppercase font-bold tracking-widest transition-all duration-700 delay-150 ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    {banner.subtitle}
                  </p>
                )}

                {/* Main Heading */}
                <h1
                  className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white transition-all duration-700 delay-200 ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }`}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                    {banner.title}
                  </span>
                </h1>

                {/* Description */}
                <p
                  className={`text-slate-300 text-sm sm:text-base md:text-lg line-clamp-2 max-w-xl font-normal leading-relaxed transition-all duration-700 delay-300 ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }`}
                >
                  {banner.description}
                </p>

                {/* Action Buttons */}
                <div
                  className={`pt-3 flex flex-wrap items-center gap-3 sm:gap-4 transition-all duration-700 delay-400 ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }`}
                >
                  <Link
                    to="/items"
                    className="relative group/btn overflow-hidden inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95 text-sm sm:text-base"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>

                  {banner.promoCode && (
                    <button
                      type="button"
                      onClick={() => handleCopyCode(banner.promoCode!)}
                      className="group/code relative inline-flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800/90 text-xs sm:text-sm font-mono backdrop-blur-md transition-all active:scale-95 text-slate-200 shadow-md hover:border-amber-500/50"
                      title="Click to copy promo code"
                    >
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span className="text-slate-400">Code:</span>
                      <span className="text-amber-400 font-extrabold tracking-wider">
                        {banner.promoCode}
                      </span>

                      <div className="ml-1 p-1 rounded-lg bg-slate-800 group-hover/code:bg-slate-700 transition-colors">
                        {copiedCode === banner.promoCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in-50 duration-200" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover/code:text-slate-200 transition-colors" />
                        )}
                      </div>

                      {copiedCode === banner.promoCode && (
                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
                          Copied!
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Left */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-slate-900/60 border border-slate-700/60 hover:border-amber-500/80 hover:bg-slate-900/90 text-slate-200 hover:text-amber-400 p-3 rounded-2xl shadow-2xl transition-all duration-300 opacity-80 sm:opacity-0 group-hover:opacity-100 backdrop-blur-md active:scale-90"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Navigation Arrow Right */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-slate-900/60 border border-slate-700/60 hover:border-amber-500/80 hover:bg-slate-900/90 text-slate-200 hover:text-amber-400 p-3 rounded-2xl shadow-2xl transition-all duration-300 opacity-80 sm:opacity-0 group-hover:opacity-100 backdrop-blur-md active:scale-90"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30 bg-slate-950/70 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-800/80 shadow-2xl">
        {banners.map((_, idx) => {
          const isActive = currentSlide === idx;
          return (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`relative h-2.5 rounded-full transition-all duration-500 overflow-hidden ${
                isActive
                  ? "w-10 bg-slate-800"
                  : "w-2.5 bg-slate-700 hover:bg-slate-500"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {isActive && (
                <span
                  key={currentSlide}
                  className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  style={{
                    animation: isPaused
                      ? "none"
                      : `progress ${SLIDE_DURATION}ms linear forwards`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};
