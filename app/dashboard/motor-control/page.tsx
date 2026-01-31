"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import ModeStatus from "../../components/ModeStatus";

export default function MotorControlPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f5f9f0] via-[#e8f5e9] to-[#f0f8f0] text-gray-900">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-9xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                aria-label="Go back"
                className="group flex h-10 w-10 items-center justify-center rounded-2xl
                          bg-gradient-to-br from-[#7faf3b] to-[#6a9331]
                          text-white shadow-md ring-1 ring-black/5
                          transition-all hover:shadow-lg hover:-translate-x-0.5 active:scale-95"
              >
                <ArrowLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <div>
                <h1 className="text-xl font-bold sm:text-2xl">
                  Motor Control
                </h1>
                <p className="text-sm text-green-700">
                  Smart Irrigation Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ModeStatus />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 border border-green-300">
                ⚙️
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-9xl flex-1 px-4 py-6 sm:px-6 lg:px-8">

        {/* Navigation Cards */}
        <section className="mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Motors Page Link */}
            <Link
              href="/dashboard/motor-control/motor"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 text-black shadow-lg transition-all hover:shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center 
                  rounded-2xl 
                  shadow-md transition-transform group-hover:scale-110">
                  <img src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/1f8b2cc9-c384-4a8e-8942-c925dc7081f7/317c40f6-43e2-4f2b-b9e6-7a6015371bf4.png" alt="Motor Icon" width={70} height={70} className="opacity-90 object-contain" />
                </div>
                <h3 className="text-xl font-bold">Motors</h3>
                <p className="text-sm text-gray-600 text-center">
                  Control and manage all motors
                </p>
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  View Motors →
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7faf3b]/0 to-[#7faf3b]/0 transition-all group-hover:from-[#7faf3b]/5 group-hover:to-[#8ac34a]/5 pointer-events-none"></div>
            </Link>

            {/* Valve Page Link */}
            <Link
              href="/dashboard/motor-control/valves"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-black shadow-lg transition-all hover:shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center 
                  rounded-2xl bg-gradient-to-br from-blue-200 to-indigo-200
                  shadow-md transition-transform group-hover:scale-110">
                  <img src="https://res.cloudinary.com/dbyxgnjkw/image/upload/v1767022401/icons8-valve-64_xhtuoh.png" alt="Valve Icon" width={50} height={50} className="opacity-90 object-contain" />
                </div>
                <h3 className="text-xl font-bold">Valves</h3>
                <p className="text-sm text-gray-600 text-center">
                  Control and manage all valves
                </p>
                <div className="mt-2 text-sm text-blue-600 font-semibold">
                  View Valves →
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 transition-all group-hover:from-blue-500/5 group-hover:to-indigo-500/5 pointer-events-none"></div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
