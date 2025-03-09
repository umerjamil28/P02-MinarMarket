"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Target, Award, Briefcase, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutUsPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeSection, setActiveSection] = useState("mission")

  // Track mouse position for subtle interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 text-white/80 relative overflow-hidden">
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-5 mix-blend-soft-light">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Subtle animated particles */}
      <div className="absolute inset-0 overflow-hidden">
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

      {/* Very subtle light effect that follows mouse */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)",
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          transition: "left 1s ease-out, top 1s ease-out",
        }}
      ></div>

      {/* Slow moving gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-20 animate-slide-right-slow"></div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white/90">MinarMarket</span>
          </Link>

          <Link href="/">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold text-white/90 mb-6 animate-fade-in"
            style={{ animationDuration: "1.5s" }}
          >
            About MinarMarket
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-400 to-transparent mb-12 animate-width-expand-slow"></div>

          <p
            className="text-xl text-white/70 mb-12 leading-relaxed animate-fade-in"
            style={{ animationDuration: "2s", animationDelay: "0.5s" }}
          >
            MinarMarket is revolutionizing how buyers and sellers connect in the digital marketplace. Founded in 2024,
            we've been on a mission to create a more personalized and efficient trading experience for everyone.
          </p>

          {/* Section Navigation */}
          <div
            className="flex flex-wrap gap-4 mb-12 animate-fade-in"
            style={{ animationDuration: "2s", animationDelay: "0.8s" }}
          >
            {[
              { id: "mission", label: "Our Mission", icon: <Target className="h-4 w-4" /> },
              { id: "values", label: "Core Values", icon: <Award className="h-4 w-4" /> },
              { id: "team", label: "Our Team", icon: <Users className="h-4 w-4" /> },
              { id: "history", label: "Our Journey", icon: <Briefcase className="h-4 w-4" /> },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === section.id
                    ? "bg-white/10 text-white"
                    : "bg-transparent text-white/60 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          {/* Content Sections */}
          <div
            className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 animate-fade-in"
            style={{ animationDuration: "2s", animationDelay: "1s" }}
          >
            {activeSection === "mission" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white/90 flex items-center">
                  <Target className="mr-3 h-5 w-5" />
                  Our Mission
                </h2>
                <p className="text-white/70 leading-relaxed">
                  At MinarMarket, our mission is to transform the traditional marketplace model by putting the power
                  back in the hands of buyers. We believe that commerce should be driven by actual needs rather than
                  just available inventory.
                </p>
                <p className="text-white/70 leading-relaxed">
                  We're building a platform where buyers can clearly articulate what they're looking for, and sellers
                  can respond with personalized offers that precisely match those needs. This approach eliminates wasted
                  time browsing through irrelevant listings and creates more meaningful connections between buyers and
                  sellers.
                </p>
                <div className="pt-4">
                  <div className="flex items-center space-x-2 text-white/60">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <span>Empowering buyers to drive the marketplace</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/60 mt-3">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <span>Creating personalized connections between buyers and sellers</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/60 mt-3">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <span>Eliminating wasted time and resources in the buying process</span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "values" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white/90 flex items-center">
                  <Award className="mr-3 h-5 w-5" />
                  Core Values
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-lg p-5">
                    <h3 className="text-lg font-medium text-white/90 mb-3">Transparency</h3>
                    <p className="text-white/70">
                      We believe in complete transparency in all transactions and communications, building trust between
                      all parties.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-5">
                    <h3 className="text-lg font-medium text-white/90 mb-3">Innovation</h3>
                    <p className="text-white/70">
                      We're constantly looking for new ways to improve the buying and selling experience through
                      technology.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-5">
                    <h3 className="text-lg font-medium text-white/90 mb-3">Community</h3>
                    <p className="text-white/70">
                      We foster a supportive community where buyers and sellers can connect, communicate, and
                      collaborate.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-5">
                    <h3 className="text-lg font-medium text-white/90 mb-3">Efficiency</h3>
                    <p className="text-white/70">
                      We strive to make the marketplace as efficient as possible, saving time and resources for everyone
                      involved.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "team" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white/90 flex items-center">
                  <Users className="mr-3 h-5 w-5" />
                  Our Team
                </h2>
                <p className="text-white/70 leading-relaxed">
                  MinarMarket is powered by a diverse team of experts in technology, business, and customer experience.
                  Our leadership team brings decades of combined experience from top tech companies and marketplaces.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  {[
                    { name: "Abdul Ahad Bin Ali", role: "CEO & Co-Founder", image: "/placeholder.svg?height=100&width=100" },
                    { name: "Hasan Malik", role: "CFO & Co-Founder", image: "/placeholder.svg?height=100&width=100" },
                    { name: "Khurrum Chaudhary", role: "Mentor", image: "/placeholder.svg?height=100&width=100" },
                    {
                      name: "Umer Jamil",
                      role: "Head of Marketing",
                      image: "/placeholder.svg?height=100&width=100",
                    },
                    { name: "Aniqa Aqeel", role: "Lead Designer", image: "/placeholder.svg?height=100&width=100" },
                    { name: "Saad Ilyas", role: "Customer Success", image: "/placeholder.svg?height=100&width=100" },
                  ].map((member, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-5 flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-white/10">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-medium text-white/90">{member.name}</h3>
                      <p className="text-white/60 text-sm">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "history" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white/90 flex items-center">
                  <Briefcase className="mr-3 h-5 w-5" />
                  Our Journey
                </h2>
                <div className="relative border-l border-white/20 pl-8 py-2 space-y-10">
                  <div className="relative">
                    <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-white/20"></div>
                    <h3 className="text-lg font-medium text-white/90">October 2024- Foundation</h3>
                    <p className="text-white/70 mt-2">
                      MinarMarket was founded with a vision to revolutionize how buyers and sellers connect online.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-white/20"></div>
                    <h3 className="text-lg font-medium text-white/90">January 2025 - Growth & Expansion</h3>
                    <p className="text-white/70 mt-2">
                      We expanded our team and secured our first round of funding to accelerate platform development.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-white/20"></div>
                    <h3 className="text-lg font-medium text-white/90">March 2025 - Platform Launch</h3>
                    <p className="text-white/70 mt-2">
                      We officially launched our platform to the public, introducing our unique buyer-driven marketplace
                      model.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-white/20"></div>
                    <h3 className="text-lg font-medium text-white/90">2025 - Looking Forward</h3>
                    <p className="text-white/70 mt-2">
                      We're focused on expanding our user base and introducing new features to enhance the marketplace
                      experience.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-medium text-white/90 mb-4">MinarMarket</h3>
              <p className="text-white/60 text-sm">
                A smarter way to buy and sell online. Connect with the right people for your needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white/90 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <Link href="/" className="hover:text-white/80">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white/80">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white/80">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white/80">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white/90 mb-4">Legal</h3>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <Link href="/terms" className="hover:text-white/80">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white/80">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white/80">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white/90 mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
            © {new Date().getFullYear()} MinarMarket. All rights reserved.
          </div>
        </div>
      </footer>

      {/* CSS Animations - Same as login page */}
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
                    }
                    100% {
                        opacity: 1;
                    }
                }
                
                @keyframes width-expand-slow {
                    0% {
                        width: 0;
                        opacity: 0;
                    }
                    100% {
                        width: 24px;
                        opacity: 1;
                    }
                }
                
                @keyframes slide-right-slow {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                
                .animate-fade-in {
                    opacity: 0;
                    animation: fade-in ease-out forwards;
                }
                
                .animate-width-expand-slow {
                    animation: width-expand-slow 2.5s ease-out forwards;
                }
                
                .animate-slide-right-slow {
                    animation: slide-right-slow 20s linear infinite;
                }
            `}</style>
    </div>
  )
}

