import React from "react";
import { ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Lead, Acme Co.",
    text: "The quality of products on this site is exceptional. I'm particularly impressed with the fast shipping and excellent customer service. Will definitely shop here again!",
    avatar:
      "https://ui-avatars.com/api/?name=Sarah+Johnson&background=f59e0b&color=020617&size=128",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager, Beta Inc.",
    text: "Found exactly what I was looking for at a great price. The detailed product descriptions and reviews helped me make an informed decision. Very satisfied with my purchase.",
    avatar:
      "https://ui-avatars.com/api/?name=Michael+Chen&background=f59e0b&color=020617&size=128",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Designer, Gamma LLC",
    text: "The website is so easy to navigate and the checkout process was smooth. My order arrived earlier than expected and was exactly as described. Highly recommend!",
    avatar:
      "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=f59e0b&color=020617&size=128",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "CTO, Delta Tech",
    text: "Outstanding selection of electronics. The product recommendations were spot-on and helped me find the perfect laptop for my needs. Great experience overall.",
    avatar:
      "https://ui-avatars.com/api/?name=David+Thompson&background=f59e0b&color=020617&size=128",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    role: "CEO, Epsilon Group",
    text: "The customer support team went above and beyond to help me with my purchase. The product quality is fantastic and the prices are very competitive.",
    avatar:
      "https://ui-avatars.com/api/?name=Lisa+Anderson&background=f59e0b&color=020617&size=128",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Customer Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            What Our Clients Say
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Discover why thousands of customers trust our services and products.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-2xl mx-auto px-4 sm:px-10">
          <Carousel
            showThumbs={false}
            showStatus={false}
            showArrows={true}
            showIndicators={true}
            infiniteLoop={true}
            autoPlay={true}
            interval={6000}
            swipeable={true}
            emulateTouch={true}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-400 p-2.5 rounded-full shadow-2xl transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-400 p-2.5 rounded-full shadow-2xl transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )
            }
            renderIndicator={(onClickHandler, isSelected, index, label) => (
              <li
                className={`inline-block mx-1 my-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "w-6 bg-amber-500"
                    : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                value={index}
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`${label} ${index + 1}`}
              />
            )}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="pt-10 pb-6 px-3">
                <div className="relative bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center min-h-[280px]">
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Watermark Quote Icons */}
                  <Quote className="absolute left-6 top-6 text-slate-800 w-10 h-10 -scale-x-100 pointer-events-none opacity-40" />
                  <Quote className="absolute right-6 bottom-6 text-slate-800 w-10 h-10 pointer-events-none opacity-40" />

                  {/* Avatar */}
                  <div className="relative -mt-20 mb-4">
                    <div className="p-1 rounded-full bg-slate-950 border-2 border-amber-500/40 shadow-xl">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col items-center space-y-2 z-10">
                    <h3 className="font-bold text-white text-lg sm:text-xl tracking-tight">
                      {testimonial.name}
                    </h3>
                    <span className="text-amber-400 text-xs font-medium uppercase tracking-wider">
                      {testimonial.role}
                    </span>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed text-center max-w-lg pt-2 italic">
                      "{testimonial.text}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
