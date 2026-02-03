
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Award, Shield, UserCheck, HandMetal, Sparkles } from 'lucide-react';
import { useStore } from '../store';

const ArtisanSeal = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
     <svg viewBox="0 0 100 100" className="w-full h-full text-current opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
       <path d="M50 10 C 25 10, 10 25, 10 50 C 10 75, 25 90, 50 90 C 75 90, 90 75, 90 50 C 90 25, 75 10, 50 10" strokeLinecap="round" />
       <path d="M50 20 C 35 20, 25 30, 25 50 C 25 70, 35 80, 50 80 C 65 80, 75 70, 75 50 C 75 30, 65 20, 50 20" strokeLinecap="round" />
     </svg>
     <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-serif italic uppercase tracking-widest translate-y-[-1px]">Pure</span>
     </div>
  </div>
);

export const Home: React.FC = () => {
  const { products } = useStore();
  const featuredProducts = products.filter(p => p.status === 'published').slice(0, 3);

  return (
    <div className="animate-in fade-in duration-700 bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#273134]">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=1920" 
            alt="Human Workspace" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-6 mb-8">
              <ArtisanSeal className="w-16 h-16 text-[#D4C4B5]" />
              <span className="text-[#D4C4B5] uppercase tracking-[0.4em] text-xs font-bold block">Found in the Studio, Not the Prompt</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white leading-tight mb-8">
              Find * Create <br /><span className="italic serif text-[#D4C4B5]">Buy * Sell</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-xl italic">
              True T is a marketplace built by humans, for humans. No AI products, no hidden fees—just $5 commission for sellers.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link 
                to="/shop" 
                className="bg-white text-[#273134] px-12 py-5 uppercase tracking-widest text-xs font-bold hover:bg-[#D4C4B5] transition-all flex items-center justify-center group"
              >
                Shop Collection 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/professional" 
                className="border border-white/20 text-white px-12 py-5 uppercase tracking-widest text-xs font-bold hover:bg-white/10 transition-all text-center"
              >
                Sell with True T
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rules of Engagement */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-[#273134] text-white flex items-center justify-center rounded-full">
                <HandMetal className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-serif italic">100% Handmade</h3>
              <p className="text-gray-500 italic text-sm leading-relaxed">
                Every item is vetted for tactile origin. We strictly prohibit AI-generated products or computer-synthesized imagery.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-[#D4C4B5] text-[#273134] flex items-center justify-center rounded-full">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-serif italic">Fair $5 Fee</h3>
              <p className="text-gray-500 italic text-sm leading-relaxed">
                Creators keep their profits. We take a flat $5 per sale to power the platform. No complicated percentages.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-gray-100 text-[#273134] flex items-center justify-center rounded-full">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-serif italic">Human Only</h3>
              <p className="text-gray-500 italic text-sm leading-relaxed">
                Connecting you directly to the studio. Shop.truetmarketplace.com is a sanctuary for the intentional collector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Artisan Spotlight - NEW SECTION to find Tanya's products */}
      <section className="py-32 bg-[#FAF9F6] border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-[4/5] bg-white border border-gray-100 shadow-2xl relative z-10 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                  alt="Tanya, Jewelry Artisan" 
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#D4C4B5] -z-0 opacity-20 rounded-full blur-3xl"></div>
            </div>
            <div className="w-full lg:w-1/2 space-y-10">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-5 h-5 text-[#D4C4B5]" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#D4C4B5]">Artisan Spotlight</span>
                </div>
                <h2 className="text-6xl font-serif italic text-[#273134]">Tanya’s Studio.</h2>
              </div>
              <p className="text-xl text-gray-500 italic leading-relaxed">
                "Jewelry shouldn't just be worn; it should be felt. Every hammer strike on my sterling bangles is a deliberate conversation between the metal and the maker."
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-400 italic">Based in Sedona, Tanya specializes in hand-hammered sterling silver and high-grade American turquoise.</p>
                <Link 
                  to="/shop" 
                  className="inline-block border-b-2 border-[#273134] pb-2 text-xs uppercase tracking-[0.3em] font-bold hover:text-[#D4C4B5] hover:border-[#D4C4B5] transition-all"
                >
                  Browse Her Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-serif italic">Current Curations</h2>
            <Link to="/shop" className="text-xs uppercase tracking-widest font-bold border-b border-black pb-1 hover:text-[#D4C4B5] hover:border-[#D4C4B5] transition-all">
              Browse All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden bg-white mb-6 border border-gray-100 shadow-sm">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 right-4 w-12 h-12 text-white/40 group-hover:text-white transition-colors">
                    <ArtisanSeal />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">{product.category}</p>
                <h3 className="text-2xl font-serif mb-2">{product.name}</h3>
                <p className="font-serif italic text-lg">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-32 bg-[#273134] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-4xl font-serif italic leading-snug mb-10">
            "In an age of digital noise, True T is the quiet corner where craftsmanship still speaks the loudest."
          </p>
          <div className="flex flex-col items-center">
             <ArtisanSeal className="w-12 h-12 text-[#D4C4B5] mb-4" />
             <span className="text-[#D4C4B5] uppercase tracking-[0.4em] text-[10px] font-bold">The Maker Manifesto</span>
          </div>
        </div>
      </section>
    </div>
  );
};
