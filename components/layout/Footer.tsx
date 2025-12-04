import Link from 'next/link'
import { Facebook, Twitter, Instagram, BedDouble } from 'lucide-react'

const footerLinks = {
  Explore: [
    { name: 'Rooms', href: '/rooms' },
    { name: 'Tours', href: '/tours' },
    { name: 'Amenities', href: '/#amenities' },
    { name: 'Gallery', href: '/#gallery' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  Support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Cancellation Policy', href: '/policy' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BedDouble className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold">Booking Inn</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Experience luxury and comfort at our premier boutique inn. 
              Perfect stays and unforgettable memories await.
            </p>
            
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Booking Inn. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              123 El Nido, Puerto Princesa City, Palawan
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}