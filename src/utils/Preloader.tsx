import { Utensils } from "lucide-react";

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 text-slate-100">
      {/* Container for Main Animation */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Large Outer Pulsing Glow */}
        <div className="absolute w-40 h-40 rounded-full bg-orange-500/20 animate-ping" />

        {/* Giant Spinner Ring */}
        <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-orange-500 border-r-amber-500 animate-spin" />

        {/* Large Center Icon Badge */}
        <div className="absolute flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-full shadow-2xl shadow-orange-500/50">
          <Utensils className="w-10 h-10 text-white animate-bounce" />
        </div>
      </div>

      {/* Bigger Brand & Text */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold tracking-widest bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent uppercase">
          FOOD EXPRESS
        </h1>
        <div className="flex items-center justify-center gap-2">
          <span className="text-base text-slate-300 font-medium">
            Loading, please wait
          </span>
          <span className="flex gap-1.5">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100" />
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-200" />
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-300" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
