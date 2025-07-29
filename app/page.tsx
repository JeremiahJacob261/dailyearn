"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { HamburgerMenu } from "@/components/hamburger-menu"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col relative overflow-x-hidden">
      {/* Theme Toggle */}
      
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-6">
        <span className="text-black dark:text-white text-2xl font-bold tracking-tight">DailyEarn</span>
        <div className="flex items-center space-x-4">
          <Button className="bg-stone-800 text-white px-6 py-2 rounded-lg hover:bg-stone-700 transition-colors" asChild>
            <a href="/register">Get App</a>
          </Button>
          <HamburgerMenu />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 relative z-10">
        {/* Light effect background behind hero text */}
        <div className="absolute left-1/2 top-24 md:top-32 -translate-x-1/2 z-0 w-[420px] h-[220px] md:w-[600px] md:h-[320px] rounded-full blur-3xl opacity-60 dark:opacity-40 pointer-events-none select-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #e0ffe6 0%, #baffc9 60%, transparent 100%)',
          }}
        />
        <h1 className="text-5xl md:text-7xl font-extrabold text-black dark:text-white text-center leading-tight mb-4 relative z-10">
          Turn Your Screen<br />Time into Cash!
        </h1>
        {/* Phone in hand image, absolute and centered, overlapping the text */}
        <div className="relative w-full flex justify-center items-center -mt-20 md:-mt-32 mb-8" style={{ zIndex: 20 }}>
          <Image
            src="/1landing.png"
            alt="Phone in hand"
            width={400}
            height={600}
            className="z-20 drop-shadow-2xl pointer-events-none select-none"
            priority
          />
          <Image
            src="/1landing.png"
            alt="Phone only"
            width={300}
            height={600}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">Ads Are Everywhere.<br />Now They Pay You.</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">Sit back, watch ads, and watch your balance grow.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-lime-400 hover:bg-lime-500 text-black font-semibold px-10 py-3 text-lg rounded-full shadow-lg transition-all">
                Sign up
              </Button>
            </Link>
            <Link href="/signin">
              <Button className="bg-transparent border-2 border-lime-400 hover:bg-lime-400 text-lime-400 hover:text-black font-semibold px-10 py-3 text-lg rounded-full shadow-lg transition-all">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
        </div>
  )
}
