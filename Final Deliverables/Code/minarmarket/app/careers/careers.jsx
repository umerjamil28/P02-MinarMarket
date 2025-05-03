"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Briefcase, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Careers() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [openJobId, setOpenJobId] = useState(null)

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

  const toggleJob = (id) => {
    setOpenJobId(openJobId === id ? null : id)
  }

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Lahore (Remote Available)",
      type: "Full-time",
      description:
        "We're looking for an experienced Full Stack Developer to join our engineering team. You'll be responsible for developing and maintaining our marketplace platform, implementing new features, and ensuring optimal performance.",
      requirements: [
        "5+ years of experience in full stack development",
        "Proficiency in React, Node.js, and MongoDB",
        "Experience with RESTful APIs and microservices",
        "Strong problem-solving skills and attention to detail",
        "Bachelor's degree in Computer Science or related field",
      ],
    },
    {
      id: 2,
      title: "UX/UI Designer",
      department: "Design",
      location: "Islamabad (Remote Available)",
      type: "Full-time",
      description:
        "Join our design team to create intuitive and engaging user experiences for our marketplace platform. You'll collaborate with product managers and developers to design user-centered interfaces that delight our customers.",
      requirements: [
        "3+ years of experience in UX/UI design",
        "Proficiency in Figma, Sketch, or similar design tools",
        "Strong portfolio demonstrating user-centered design process",
        "Experience with design systems and component libraries",
        "Excellent communication and collaboration skills",
      ],
    },
    {
      id: 3,
      title: "Product Marketing Manager",
      department: "Marketing",
      location: "Lahore ",
      type: "Full-time",
      description:
        "We're seeking a Product Marketing Manager to develop and execute marketing strategies for our marketplace platform. You'll work closely with product, sales, and design teams to communicate our value proposition to customers.",
      requirements: [
        "4+ years of experience in product marketing",
        "Experience in e-commerce or marketplace businesses",
        "Strong analytical skills and data-driven approach",
        "Excellent written and verbal communication",
        "Bachelor's degree in Marketing, Business, or related field",
      ],
    },
    {
      id: 4,
      title: "Customer Success Specialist",
      department: "Customer Support",
      location: "Remote",
      type: "Full-time",
      description:
        "Help our customers succeed on our platform by providing exceptional support and guidance. You'll be responsible for onboarding new users, resolving issues, and ensuring customer satisfaction.",
      requirements: [
        "2+ years of experience in customer support or success",
        "Strong communication and interpersonal skills",
        "Problem-solving mindset and ability to work independently",
        "Experience with CRM software and support ticketing systems",
        "Bachelor's degree preferred but not required",
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
                <h1 className="text-4xl md:text-5xl font-bold text-white/90">Join Our Team</h1>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">
                  At MinarMarket, we&apos;re building the future of online marketplaces. Join us in our mission to connect
                  buyers and sellers in a more personalized way.
                </p>
              </section>

              {/* Why Join Us */}
              <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-3xl font-bold text-white/90 mb-8">Why Join MinarMarket?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white/90 mb-2">Innovative Work</h3>
                    <p className="text-white/70">
                      Work on cutting-edge technology and help shape the future of e-commerce and online marketplaces.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white/90 mb-2">Great Culture</h3>
                    <p className="text-white/70">
                      Join a diverse and inclusive team that values collaboration, creativity, and personal growth.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white/90 mb-2">Competitive Benefits</h3>
                    <p className="text-white/70">
                      Enjoy competitive salary, health benefits, flexible work options, and professional development
                      opportunities.
                    </p>
                  </div>
                </div>
              </section>

              {/* Open Positions */}
              <section className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <h2 className="text-3xl font-bold text-white/90 mb-8">Open Positions</h2>
                <div className="space-y-4">
                  {jobOpenings.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                    >
                      <div
                        className="p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
                        onClick={() => toggleJob(job.id)}
                      >
                        <div>
                          <h3 className="text-xl font-semibold text-white/90">{job.title}</h3>
                          <p className="text-white/60">{job.department}</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
                          <div className="flex items-center text-white/60">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center text-white/60">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="text-sm">{job.type}</span>
                          </div>
                          <Button variant="ghost" className="p-2 h-auto">
                            {openJobId === job.id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {openJobId === job.id && (
                        <div className="p-6 pt-0 border-t border-white/10">
                          <p className="text-white/70 mb-4">{job.description}</p>
                          <h4 className="text-lg font-medium text-white/90 mb-2">Requirements:</h4>
                          <ul className="list-disc pl-5 text-white/70 space-y-1">
                            {job.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                          <div className="mt-6">
                            <Button className="bg-white/10 hover:bg-white/20 text-white">
                              <Briefcase className="mr-2 h-4 w-4" />
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Benefits */}
              <section className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <h2 className="text-3xl font-bold text-white/90 mb-8">Our Benefits</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white/90 mb-4">Health & Wellness</h3>
                    <ul className="space-y-2 text-white/70">
                      <li>Comprehensive health, dental, and vision insurance</li>
                      <li>Mental health resources and support</li>
                      <li>Wellness stipend for gym memberships or fitness classes</li>
                      <li>Healthy snacks and meals in the office</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white/90 mb-4">Work-Life Balance</h3>
                    <ul className="space-y-2 text-white/70">
                      <li>Flexible work hours and remote work options</li>
                      <li>Generous paid time off and holidays</li>
                      <li>Parental leave for all parents</li>
                      <li>Sabbatical program for long-term employees</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white/90 mb-4">Financial Benefits</h3>
                    <ul className="space-y-2 text-white/70">
                      <li>Competitive salary packages</li>
                      <li>401(k) matching program</li>
                      <li>Stock options and equity grants</li>
                      <li>Commuter benefits and transportation allowance</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white/90 mb-4">Growth & Development</h3>
                    <ul className="space-y-2 text-white/70">
                      <li>Professional development budget</li>
                      <li>Learning and education reimbursement</li>
                      <li>Mentorship and coaching programs</li>
                      <li>Regular feedback and career planning</li>
                    </ul>
                  </div>
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

