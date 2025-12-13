'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Facebook, Twitter, Instagram, BedDouble, Send, Star, ShieldCheck, Award } from 'lucide-react'

const footerLinks = {
  Explore: [
    { name: 'Rooms & Suites', href: '/rooms' },
    { name: 'Tours & Activities', href: '/tours' },
    { name: 'Dining', href: '/#dining' },
    { name: 'Gallery', href: '/#gallery' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Team', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press & Media', href: '/press' },
  ],
  Support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Cancellation Policy', href: '/policy' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

export default function Footer() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <footer className="bg-gray-950 text-white mt-0 pt-20 pb-10 border-t border-gray-900 relative">
      {/* Newsletter Section */}
      {isHomePage && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4">
          <div className="bg-primary-600 rounded-3xl p-8 md:p-10 shadow-2xl shadow-primary-900/50 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Join Our Exclusive List</h3>
              <p className="text-primary-100">Get 10% off your first booking and access to secret deals.</p>
            </div>
            <div className="flex-1 w-full relative">
              <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-transparent border-none outline-none text-white placeholder:text-primary-200 px-4 py-3 flex-grow w-full"
                />
                <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                  Join <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 mt-16 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="bg-primary-500/10 p-2 rounded-lg group-hover:bg-primary-500/20 transition-colors border border-primary-500/20">
                <BedDouble className="w-8 h-8 text-primary-400" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Booking Inn</span>
            </Link>
            <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
              Experience the pinnacle of luxury and comfort at our premier boutique inn.
              Where every stay becomes a cherished memory.
            </p>

            <div className="flex gap-4 justify-center md:justify-start">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300 border border-gray-800 hover:border-primary-500 hover:-translate-y-1">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-lg mb-6 text-gray-200">{category}</h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors text-sm hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Badges Row */}
        <div className="border-t border-gray-900 pt-12 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-green-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">Secure Booking</div>
                <div className="text-[10px] text-gray-400">SSL Encrypted</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-8 h-8 text-amber-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">5-Star Rated</div>
                <div className="text-[10px] text-gray-400">2000+ Reviews</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-8 h-8 text-blue-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">Best Luxury</div>
                <div className="text-[10px] text-gray-400">Award 2024</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble className="w-8 h-8 text-purple-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">Premium Rooms</div>
                <div className="text-[10px] text-gray-400">Top Quality</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Booking Inn. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}