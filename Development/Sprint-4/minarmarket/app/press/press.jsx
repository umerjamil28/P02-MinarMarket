"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Press() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const pressReleases = [
    {
      id: 1,
      title: "MinarMarket Raises $15M in Series A Funding",
      date: "March 15, 2024",
      excerpt:
        "MinarMarket, the innovative buyer-driven marketplace, announced today that it has raised $15 million in Series A funding led by Acme Ventures with participation from existing investors.",
      link: "#",
    },
    {
      id: 2,
      title: "MinarMarket Launches New Mobile App",
      date: "February 2, 2024",
      excerpt:
        "MinarMarket today announced the launch of its new mobile application for iOS and Android, bringing its unique buyer-driven marketplace experience to mobile users.",
      link: "#",
    },
    {
      id: 3,
      title: "MinarMarket Expands to European Markets",
      date: "December 10, 2023",
      excerpt:
        "MinarMarket today announced its expansion into European markets, starting with the UK, Germany, and France, bringing its innovative marketplace model to international users.",
      link: "#",
    },
  ]

  const mediaFeatures = [
    {
      id: 1,
      outlet: "TechCrunch",
      title: "MinarMarket Flips the Script on Traditional E-commerce",
      date: "March 16, 2024",
      excerpt:
        "MinarMarket's approach to letting buyers post what they need and having sellers respond is gaining traction as a new model for online marketplaces.",
      link: "#",
    },
    {
      id: 2,
      outlet: "Forbes",
      title: "The Future of E-commerce: Buyer-Driven Marketplaces",
      date: "January 25, 2024",
      excerpt:
        "Forbes explores how MinarMarket is leading the charge in transforming how people buy and sell online with its innovative buyer-first approach.",
      link: "#",
    },
    {
      id: 3,
      outlet: "Business Insider",
      title: "How MinarMarket is Disrupting Traditional Marketplaces",
      date: "November 5, 2023",
      excerpt:
        "Business Insider takes a deep dive into how MinarMarket's platform is changing the game for both buyers and sellers in the digital marketplace.",
      link: "#",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 text-white/80">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-5 mix-blend-soft-light pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Animated particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: "rgba(255,255,255,0.3)",
              boxShadow: "0 0 10px rgba(255,255,255,0.2)",
              animation: `float-particle ${Math.random() * 20 + 30}s linear infinite`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Mouse light effect */}
      <div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)",
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          transition: "left 1s ease-out, top 1s ease-out",
        }}
      />

      <div className="relative z-10">


        <main className="container px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 animate-fade-in">
              <Link href="/">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="space-y-16">
              {/* Hero Section */}
              <section className="text-center space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-white/90">Press & Media</h1>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">
                  Find the latest news, press releases, and media resources about MinarMarket.
                </p>
              </section>

              {/* Media Contact */}
              <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold text-white/90 mb-4">Media Contact</h2>
                  <p className="text-white/70 mb-6">For press inquiries, please contact our media relations team:</p>
                  <div className="space-y-2">
                    <p className="text-white/80">
                      <strong>Email:</strong>{" "}
                      <a href="mailto:press@minarmarket.com" className="text-white hover:underline">
                        press@minarmarket.com
                      </a>
                    </p>
                    <p className="text-white/80">
                      <strong>Phone:</strong> +1 (415) 555-0123
                    </p>
                  </div>
                </div>
              </section>

              {/* Press Releases */}
              <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h2 className="text-3xl font-bold text-white/90 mb-8">Press Releases</h2>
                <div className="space-y-6">
                  {pressReleases.map((release) => (
                    <div key={release.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="text-white/60 text-sm mb-2">{release.date}</div>
                      <h3 className="text-xl font-semibold text-white/90 mb-3">{release.title}</h3>
                      <p className="text-white/70 mb-4">{release.excerpt}</p>
                      <Link href={release.link}>
                        <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                          Read Full Release
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* Media Features */}
              <section className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <h2 className="text-3xl font-bold text-white/90 mb-8">Media Features</h2>
                <div className="space-y-6">
                  {mediaFeatures.map((feature) => (
                    <div key={feature.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white/90 font-medium">{feature.outlet}</span>
                        <span className="text-white/60 text-sm">{feature.date}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white/90 mb-3">{feature.title}</h3>
                      <p className="text-white/70 mb-4">{feature.excerpt}</p>
                      <Link href={feature.link}>
                        <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                          Read Article
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* Brand Assets */}
              <section className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <h2 className="text-3xl font-bold text-white/90 mb-8">Brand Assets</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white/90 mb-4">Logo Package</h3>
                    <p className="text-white/70 mb-6">Download our logo in various formats and sizes for media use.</p>
                    <Button className="bg-white/10 hover:bg-white/20 text-white">
                      <Download className="mr-2 h-4 w-4" />
                      Download Logo Pack
                    </Button>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white/90 mb-4">Brand Guidelines</h3>
                    <p className="text-white/70 mb-6">
                      Access our comprehensive brand guidelines for proper usage of our brand assets.
                    </p>
                    <Button className="bg-white/10 hover:bg-white/20 text-white">
                      <Download className="mr-2 h-4 w-4" />
                      Download Brand Guidelines
                    </Button>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white/90 mb-4">Product Screenshots</h3>
                    <p className="text-white/70 mb-6">High-resolution screenshots of our platform for media use.</p>
                    <Button className="bg-white/10 hover:bg-white/20 text-white">
                      <Download className="mr-2 h-4 w-4" />
                      Download Screenshots
                    </Button>
                  </div>
                </div>
              </section>

              {/* Press Kit */}
              <section className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold text-white/90 mb-4">Complete Press Kit</h2>
                  <p className="text-white/70 mb-6">
                    Download our complete press kit, including company information, executive bios, logos, product
                    images, and fact sheets.
                  </p>
                  <Button className="bg-white/10 hover:bg-white/20 text-white">
                    <Download className="mr-2 h-4 w-4" />
                    Download Press Kit
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </main>

      </div>

      <style jsx global>{`
                @keyframes float-particle {
                    0% {
                        transform: translateY(0) translateX(0);
                    }
                    25% {
                        transform: translateY(-20px) translateX(10px);
                    }
                    50% {
                        transform: translateY(-10px) translateX(20px);
                    }
                    75% {
                        transform: translateY(10px) translateX(-10px);
                    }
                    100% {
                        transform: translateY(0) translateX(0);
                    }
                }
                
                @keyframes fade-in {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    opacity: 0;
                    animation: fade-in 1s ease-out forwards;
                }
            `}</style>
    </div>
  )
}

