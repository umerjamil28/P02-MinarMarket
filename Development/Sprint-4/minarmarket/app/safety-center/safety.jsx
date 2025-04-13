"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Shield, AlertTriangle, Lock, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SafetyCenter() {
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

  const safetyTips = [
    {
      id: "account",
      title: "Account Security",
      icon: <Lock className="h-5 w-5" />,
      tips: [
        "Use a strong, unique password for your MinarMarket account",
        "Enable two-factor authentication for added security",
        "Never share your login credentials with anyone",
        "Log out when using shared or public computers",
        "Regularly check your account activity for any suspicious behavior",
        "Update your password periodically",
      ],
    },
    {
      id: "transactions",
      title: "Safe Transactions",
      icon: <Shield className="h-5 w-5" />,
      tips: [
        "Always use MinarMarket's secure payment system",
        "Never pay or accept payment outside the platform",
        "Be wary of deals that seem too good to be true",
        "Verify seller/buyer ratings and reviews before transacting",
        "Keep all communication within the platform",
        "Document all transaction details and save receipts",
      ],
    },
    {
      id: "scams",
      title: "Avoiding Scams",
      icon: <AlertTriangle className="h-5 w-5" />,
      tips: [
        "Be suspicious of urgent requests or pressure tactics",
        "Never share personal financial information via messages",
        "Watch out for vague listings with limited details",
        "Be cautious of sellers who refuse to use secure payment methods",
        "Research market prices to identify suspiciously low prices",
        "Report suspicious activity immediately",
      ],
    },
    {
      id: "meetups",
      title: "In-Person Safety",
      icon: <HelpCircle className="h-5 w-5" />,
      tips: [
        "Meet in public, well-lit places for item exchanges",
        "Bring a friend or tell someone where you're going",
        "Consider meeting at safe exchange zones (police stations, etc.)",
        "Inspect items thoroughly before completing the transaction",
        "Trust your instincts - if something feels wrong, walk away",
        "Don't share your home address unnecessarily",
      ],
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
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/10 mb-4">
                  <Shield className="h-10 w-10 text-white/80" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white/90">Safety Center</h1>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">
                  Your safety is our priority. Learn how to stay safe while using MinarMarket.
                </p>
              </section>

              {/* Emergency Contact */}
              <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-white/80" />
                    <h2 className="text-2xl font-bold text-white/90">Emergency Contact</h2>
                  </div>
                  <p className="text-white/70 mb-6">
                    If you&apos;re in immediate danger, please contact your local emergency services:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white font-medium mb-1">Emergency Services:</p>
                      <p className="text-white/80 text-xl">911</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white font-medium mb-1">MinarMarket Safety Team:</p>
                      <p className="text-white/80">
                        <a href="mailto:safety@minarmarket.com" className="hover:underline">
                          safety@minarmarket.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Safety Tips */}
              <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h2 className="text-3xl font-bold text-white/90 mb-8">Safety Tips</h2>
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="bg-white/5 border border-white/10 p-1 mb-8">
                    {safetyTips.map((tip) => (
                      <TabsTrigger
                        key={tip.id}
                        value={tip.id}
                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
                      >
                        <span className="flex items-center gap-2">
                          {tip.icon}
                          {tip.title}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {safetyTips.map((tip) => (
                    <TabsContent key={tip.id} value={tip.id}>
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h3 className="text-2xl font-semibold text-white/90 mb-6 flex items-center gap-3">
                          {tip.icon}
                          {tip.title}
                        </h3>
                        <ul className="space-y-4">
                          {tip.tips.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-sm">{index + 1}</span>
                              </div>
                              <p className="text-white/70">{item}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </section>

              {/* Reporting Issues */}
              <section className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <h2 className="text-3xl font-bold text-white/90 mb-8">Reporting Issues</h2>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <p className="text-white/70 mb-6">
                    If you encounter any safety concerns or suspicious activity on MinarMarket, please report it
                    immediately:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-white/90 mb-2">In-App Reporting</h3>
                      <p className="text-white/70">
                        Use the &apos;Report&apos; button on any listing, message, or user profile to flag suspicious content.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-white/90 mb-2">Email Reporting</h3>
                      <p className="text-white/70">
                        Send details to{" "}
                        <a href="mailto:safety@minarmarket.com" className="text-white hover:underline">
                          safety@minarmarket.com
                        </a>{" "}
                        including screenshots and any relevant information.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-white/90 mb-2">Customer Support</h3>
                      <p className="text-white/70">
                        Contact our support team through the Help Center for assistance with safety concerns.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Safety Resources */}
              <section className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <h2 className="text-3xl font-bold text-white/90 mb-8">Additional Resources</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white/90 mb-4">Internet Safety</h3>
                    <ul className="space-y-2 text-white/70">
                      <li>
                        <a href="#" className="hover:underline flex items-center">
                          <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                          Online Safety Guide
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline flex items-center">
                          <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                          Protecting Your Personal Information
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline flex items-center">
                          <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                          Recognizing Phishing Attempts
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white/90 mb-4">Safe Transactions</h3>
                    <ul className="space-y-2 text-white/70">
                      <li>
                        <a href="#" className="hover:underline flex items-center">
                          <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                          Secure Payment Methods
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline flex items-center">
                          <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                          How to Verify Sellers
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline flex items-center">
                          <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                          Safe Meeting Locations
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <h2 className="text-3xl font-bold text-white/90 mb-8">Frequently Asked Questions</h2>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white/90 mb-2">
                      How does MinarMarket protect my personal information?
                    </h3>
                    <p className="text-white/70">
                      We use industry-standard encryption and security measures to protect your data. We never share
                      your personal information with other users without your consent, and we have strict data
                      protection policies in place.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white/90 mb-2">
                      What should I do if I receive suspicious messages?
                    </h3>
                    <p className="text-white/70">
                      Don&apos;t respond to the message, and report it immediately using the report button. Never share
                      personal or financial information with someone you don&apos;t trust.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white/90 mb-2">
                      How can I verify a seller is legitimate?
                    </h3>
                    <p className="text-white/70">
                      Check their profile for reviews and ratings from other users, how long they&apos;ve been on the
                      platform, and their response rate. Be cautious of new accounts with no history.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white/90 mb-2">
                      What payment methods are safest to use?
                    </h3>
                    <p className="text-white/70">
                      Always use MinarMarket&apos;s secure payment system. It provides protection for both buyers and sellers
                      and allows us to help resolve disputes if necessary.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Safety Team */}
              <section className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
                  <h2 className="text-2xl font-bold text-white/90 mb-4">Need More Help?</h2>
                  <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                    Our dedicated safety team is available to assist you with any safety concerns or questions you may
                    have about using MinarMarket safely.
                  </p>
                  <Button className="bg-white/10 hover:bg-white/20 text-white">Contact Safety Team</Button>
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

