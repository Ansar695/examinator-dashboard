"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, Menu, X } from "lucide-react"

export const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const pathname = usePathname()

  const navLinks = [
    { name: "Home", href: "#home", isSection: true },
    { name: "About", href: "#about", isSection: true },
    { name: "How It Works", href: "#how-it-works", isSection: true },
    { name: "Features", href: "#features", isSection: true },
    { name: "Contact Us", href: "#contact", isSection: true },
  ]

  // Handle smooth scrolling
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        const offset = 80 // Navbar height
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        })
      }
      setIsOpen(false)
    }
  }

  // Track active section on scroll
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = navLinks
        .filter(link => link.isSection)
        .map(link => link.href.substring(1))

      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScrollSpy)
    handleScrollSpy() // Initial check

    return () => window.removeEventListener("scroll", handleScrollSpy)
  }, [])

  const isActive = (href: string) => {
    if (href.startsWith("#")) {
      return activeSection === href.substring(1)
    }
    return pathname === href
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleScroll(e, "#home")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ExamGen Pro
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className={`relative font-medium transition-colors hover:text-primary cursor-pointer ${
                  isActive(link.href) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary animate-scale-in" />
                )}
              </a>
            ))}
            <Link href="/plans">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className={`font-medium transition-colors hover:text-primary cursor-pointer ${
                    isActive(link.href) ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <Link href="/select-board" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}