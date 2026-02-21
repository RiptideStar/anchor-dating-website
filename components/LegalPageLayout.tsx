"use client";

import Image from "next/image";
import Link from "next/link";
import LandingFooter from "@/components/LandingFooter";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white font-dm-serif-display">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8 py-4 backdrop-blur-md bg-white/80">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/anchor-header-logo.png"
            alt="Anchor"
            width={64}
            height={64}
            className="rounded-2xl"
            style={{ boxShadow: "7px 10px 6.8px 0px #00000040" }}
          />
        </Link>
        <Link
          href="/events"
          className="text-lg font-bold text-neutral-700 hover:text-black transition-colors"
        >
          Events
        </Link>
      </header>

      <main className="pt-24 sm:pt-28 pb-20 px-6 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
            {title}
          </h1>
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-12">
            {lastUpdated}
          </p>
          <div className="legal-content-landing">{children}</div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
