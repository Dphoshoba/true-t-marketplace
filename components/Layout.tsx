
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Instagram, Facebook, Globe, LayoutDashboard } from 'lucide-react';
import { useStore } from '../store';

const HallmarkLogo = () => (
  <div className="relative flex items-center justify-center w-12 h-12">
    <div className="absolute inset-0 border border-[#D4C4B5]/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
    <div className="absolute inset-1 border border-dotted border-[#D4C4B5]/50 rounded-full"></div>
    <span className="text-2xl font-serif italic text-[#D4C4B5] translate-y-[-1px]">T</span>
  </div>
);

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings, userPlan } = useStore();

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Professional', path: '/professional' },
    { name: 'The Journal', path: '/journal' },
    { name: 'Authenticity', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-[#273134]/95 backdrop-blur-md border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4 group">
              <HallmarkLogo />
              <div className="hidden sm:block">
                <span className="text-xl font-serif tracking-[0.2em] uppercase group-hover:text-[#D4C4B5] transition-colors">
                  True T
                </span>
                <p className="text-[8px] tracking-[0.4em] uppercase text-gray-400 font-bold">Marketplace</p>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex space-x-12 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[10px] uppercase tracking-[0.3em] transition-colors hover:text-[#D4C4B5] font-bold ${isActive(link.path) ? 'text-[#D4C4B5]' : 'text-gray-400'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            {userPlan && (
              <Link to="/dashboard" className="flex items-center space-x-2 bg-[#D4C4B5]/10 text-[#D4C4B5] px-4 py-2 rounded-full hover:bg-[#D4C4B5]/20 transition-all border border-[#D4C4B5]/20">
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Studio</span>
              </Link>
            )}
            <Link to="/admin" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
              <User className="w-5 h-5" />
            </Link>
            <button className="lg:hidden p-2 text-gray-400" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-[#273134] border-b border-white/5 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-6 py-4 text-xs font-bold tracking-[0.3em] uppercase text-gray-400 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="block px-6 py-4 text-xs font-bold tracking-[0.3em] uppercase text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Admin Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => {
  const { settings } = useStore();
  return (
    <footer className="bg-[#1D2527] text-white pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <HallmarkLogo />
              <h3 className="text-2xl font-serif italic tracking-widest">True T</h3>
            </div>
            <p className="text-gray-400 text-sm italic leading-relaxed">
              Find * Create * Buy * Sell. A sanctuary for handmade art and human-only commerce.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#D4C4B5] transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#D4C4B5] transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#D4C4B5] transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-white/30">The Marketplace</h4>
            <ul className="space-y-6 text-sm text-gray-400 italic">
              <li><Link to="/shop" className="hover:text-white">Shop Handmade</Link></li>
              <li><Link to="/professional" className="hover:text-white">Become a Seller</Link></li>
              <li><Link to="/journal" className="hover:text-white">The Human Journal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-white/30">Connect</h4>
            <ul className="space-y-6 text-sm text-gray-400 italic">
              <li><a href="mailto:true.t.marketplace@gmail.com" className="hover:text-white">Contact Curator</a></li>
              <li><Link to="/bookings" className="hover:text-white">Apply to Join</Link></li>
              <li><Link to="/admin" className="hover:text-white">Admin Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-white/30">Updates</h4>
            <form className="flex border-b border-white/10 pb-2">
              <input type="email" placeholder="Artist Email" className="bg-transparent border-none text-sm w-full focus:outline-none placeholder-gray-600" />
              <button className="text-[10px] uppercase tracking-widest font-bold hover:text-[#D4C4B5]">Join</button>
            </form>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 text-[9px] text-gray-600 uppercase tracking-[0.4em] flex justify-between items-center">
          <span>&copy; {new Date().getFullYear()} True T Marketplace. No Bots. No AI. Just Humans.</span>
          <div className="flex space-x-8">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[#D4C4B5] selection:text-[#273134]">
      <Navbar />
      <main className="flex-grow pt-24 bg-[#FAF9F6]">
        {children}
      </main>
      <Footer />
    </div>
  );
};
