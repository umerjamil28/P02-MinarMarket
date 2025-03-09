"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactUsPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [formStatus, setFormStatus] = useState({ submitted: false, error: false })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ submitted: true, error: false })
    }, 1000)
  }

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

          <div className="flex space-x-4">
            <Link href="/about-us">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                About Us
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold text-white/90 mb-6 animate-fade-in"
            style={{ animationDuration: "1.5s" }}
          >
            Contact Us
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-400 to-transparent mb-12 animate-width-expand-slow"></div>

          <p
            className="text-xl text-white/70 mb-12 leading-relaxed animate-fade-in"
            style={{ animationDuration: "2s", animationDelay: "0.5s" }}
          >
            Have questions or feedback? We'd love to hear from you. Fill out the form below or use our contact
            information to get in touch.
          </p>

          <div
            className="grid lg:grid-cols-2 gap-12 animate-fade-in"
            style={{ animationDuration: "2s", animationDelay: "0.8s" }}
          >
            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 h-fit">
              <h2 className="text-2xl font-semibold text-white/90 mb-6 flex items-center">
                <MessageSquare className="mr-3 h-5 w-5" />
                Send Us a Message
              </h2>

              {formStatus.submitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-white/90 mb-2">Thank You!</h3>
                  <p className="text-white/70">
                    Your message has been sent successfully. We'll get back to you as soon as possible.
                  </p>
                  <Button
                    className="mt-6 bg-white/10 hover:bg-white/20 text-white"
                    onClick={() => {
                      setFormStatus({ submitted: false, error: false })
                      setFormData({ name: "", email: "", subject: "", message: "" })
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white/80">
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/80">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-white/80">
                      Subject
                    </Label>
                    <Select value={formData.subject} onValueChange={handleSelectChange}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white/80">
                      Your Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[150px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-semibold text-white/90 mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="h-5 w-5 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white/90 mb-1">Our Location</h3>
                      <p className="text-white/70">
                        Lahore University of Management Sciences
                        <br />
                        DHA Phase V
                        <br />
                        Punjab
                        <br />
                        Pakistan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Mail className="h-5 w-5 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white/90 mb-1">Email Us</h3>
                      <p className="text-white/70">
                        <a href="mailto:info@minarmarket.com" className="hover:text-white transition-colors">
                          info@minarmarket.com
                        </a>
                        <br />
                        <a href="mailto:support@minarmarket.com" className="hover:text-white transition-colors">
                          support@minarmarket.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Phone className="h-5 w-5 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white/90 mb-1">Call Us</h3>
                      <p className="text-white/70">
                        <a href="tel:+923207504366" className="hover:text-white transition-colors">
                          +92 (320) 7504366
                        </a>
                        <br />
                        <a href="tel:+923119696781" className="hover:text-white transition-colors">
                          +92 (311) 9696781
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="h-5 w-5 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white/90 mb-1">Business Hours</h3>
                      <p className="text-white/70">
                        Monday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 4:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-semibold text-white/90 mb-6">Find Us</h2>
                <div className="rounded-lg overflow-hidden h-[300px] bg-white/10 relative">
                  {/* Placeholder for map - in a real implementation, you would use Google Maps or similar */}
                  <div className="absolute inset-0 bg-slate-800 opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-10 w-10 text-white/60 mx-auto mb-2" />
                      <p className="text-white/80">Interactive map would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-xl font-semibold text-white/90 mb-4">Connect With Us</h2>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-colors"
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
                    className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-colors"
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
                    className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-colors"
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
                    className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-colors"
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
                  <Link href="/about-us" className="hover:text-white/80">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white/80">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="hover:text-white/80">
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

