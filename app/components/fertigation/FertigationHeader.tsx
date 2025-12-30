"use client";

import { useRouter } from "next/navigation";

export default function FertigationHeader() {
  const router = useRouter();

  return (
    <header className="w-full border-b border-white/5 bg-gradient-to-r from-[#0f172a]/90 to-[#1e293b]/90 backdrop-blur-xl shadow-lg sticky top-0 z-50">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#7faf3b] to-[#8ec045] text-[#1b290b] transition-all hover:scale-110 active:scale-95 shadow-lg hover:shadow-[#7faf3b]/50"
            aria-label="Go back"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-100 to-lime-200 shadow-md">
            <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-[#166534] leading-tight text-center">
              Agri
              <br />
              SenseX
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-lime-300">
              Fertigation Module
            </span>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-wide text-white">
              Soil & Nutrient Intelligence
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-[#a3c94f] animate-pulse" />
            <span className="text-xs text-slate-300">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}

