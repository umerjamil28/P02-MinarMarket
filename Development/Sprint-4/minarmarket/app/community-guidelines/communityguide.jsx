"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Shield, MessageSquare, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function CommunityGuidelines() {
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

  const lastUpdated = "March 1, 2024"

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
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 animate-fade-in">
              <Link href="/">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="space-y-12">
              <div className="animate-fade-in">
                <h1 className="text-4xl font-bold text-white/90 mb-4">Community Guidelines</h1>
                <p className="text-white/60">Last updated: {lastUpdated}</p>
              </div>

              <div
                className="prose prose-invert prose-lg max-w-none space-y-8 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <p>
                  At MinarMarket, we&apos;re committed to creating a safe, respectful, and productive community for all
                  users. These guidelines outline the behaviors and standards we expect from everyone who uses our
                  platform.
                </p>

                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-white/80" />
                    <h2 className="text-2xl font-semibold text-white/90">Our Community Values</h2>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <ul className="space-y-3 text-white/70">
                      <li>
                        <strong className="text-white/90">Respect:</strong> Treat all community members with courtesy
                        and respect.
                      </li>
                      <li>
                        <strong className="text-white/90">Honesty:</strong> Be truthful in your listings,
                        communications, and transactions.
                      </li>
                      <li>
                        <strong className="text-white/90">Safety:</strong> Prioritize the safety and security of
                        yourself and others.
                      </li>
                      <li>
                        <strong className="text-white/90">Inclusivity:</strong> Embrace diversity and be inclusive of
                        all backgrounds and perspectives.
                      </li>
                      <li>
                        <strong className="text-white/90">Responsibility:</strong> Take responsibility for your actions
                        and their impact on the community.
                      </li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-white/80" />
                    <h2 className="text-2xl font-semibold text-white/90">Prohibited Content & Behavior</h2>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <p className="text-white/70 mb-4">The following are not allowed on MinarMarket:</p>
                    <ul className="space-y-3 text-white/70">
                      <li>Illegal goods, services, or activities</li>
                      <li>Harassment, hate speech, or discrimination</li>
                      <li>Violent or threatening content</li>
                      <li>Fraudulent listings or scams</li>
                      <li>Spam, phishing, or malware</li>
                      <li>Adult content or services</li>
                      <li>Invasion of privacy or sharing personal information without consent</li>
                      <li>Intellectual property violations</li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-white/80" />
                    <h2 className="text-2xl font-semibold text-white/90">Communication Guidelines</h2>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <ul className="space-y-3 text-white/70">
                      <li>Communicate clearly and professionally</li>
                      <li>Respond to inquiries in a timely manner</li>
                      <li>Be transparent about product/service details</li>
                      <li>Avoid offensive language or personal attacks</li>
                      <li>Respect boundaries and privacy in all communications</li>
                      <li>Keep communication within the platform for safety</li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-white/80" />
                    <h2 className="text-2xl font-semibold text-white/90">Enforcement & Reporting</h2>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <p className="text-white/70 mb-4">
                      We take violations of our community guidelines seriously. Depending on the severity and frequency
                      of violations, we may take the following actions:
                    </p>
                    <ul className="space-y-3 text-white/70 mb-6">
                      <li>Warning the user</li>
                      <li>Removing content</li>
                      <li>Temporarily suspending account access</li>
                      <li>Permanently banning users from the platform</li>
                      <li>Reporting illegal activity to appropriate authorities</li>
                    </ul>
                    <p className="text-white/70">
                      If you see content or behavior that violates these guidelines, please report it immediately using
                      the reporting tools within the platform or by contacting our support team.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white/90">Changes to Guidelines</h2>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <p className="text-white/70">
                      We may update these guidelines from time to time to reflect changes in our community, platform, or
                      legal requirements. We will notify users of significant changes through our website or email
                      communications.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white/90">Contact Us</h2>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <p className="text-white/70">
                      If you have questions about these guidelines or need to report a violation, please contact us at:
                    </p>
                    <p className="text-white/70 mt-4">
                      Email:{" "}
                      <a href="mailto:community@minarmarket.com" className="text-white hover:underline">
                        community@minarmarket.com
                      </a>
                    </p>
                  </div>
                </section>
              </div>
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

