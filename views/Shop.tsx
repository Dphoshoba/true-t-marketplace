
import React, { useState } from 'react';
import { useStore } from '../store';
import { Search, X, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../types';

const ArtisanSeal = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full text-current" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M50 10 C 25 10, 10 25, 10 50 C 10 75, 25 90, 50 90 C 75 90, 90 75, 90 50 C 90 25, 75 10, 50 10" strokeLinecap="round" />
      <path d="M50 20 C 35 20, 25 30, 25 50 C 25 70, 35 80, 50 80 C 65 80, 75 70, 75 50 C 75 30, 65 20, 50 20" strokeLinecap="round" />
    </svg>
  </div>
);

export const Shop: React.FC = () => {
  const { products, checkout, settings } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    if (!selectedProduct) return;
    try {
      setIsProcessing(true);
      if (!settings.stripeAccountId) {
        alert("This artist hasn't connected their bank account yet. Please contact support.");
        return;
      }

      const url = await checkout({
        productId: selectedProduct.id as any,
        price: selectedProduct.price,
        name: selectedProduct.name,
        stripeAccountId: settings.stripeAccountId
      });

      if (url) window.location.href = url;
    } catch (error) {
      alert("Checkout Failed: " + (error as any).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const categories = ['All', 'Ceramics', 'Jewellery', 'Artwork', 'Photography', 'Woodwork', 'Clothing'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-in fade-in duration-500 pb-20 bg-[#FAF9F6]">
      <header className="py-24 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-serif italic mb-6">The Curation</h1>
          <p className="text-gray-500 italic max-w-lg mx-auto leading-relaxed">
            Every piece here is verified handmade. No AI, no mass production. Just pure human creation from our verified artisan studios.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="flex items-center space-x-6 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] uppercase tracking-widest whitespace-nowrap pb-2 transition-all border-b-2 ${activeCategory === cat
                    ? 'border-[#273134] text-[#273134] font-bold'
                    : 'text-gray-400 hover:text-[#273134] border-transparent'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search by product or artisan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 p-4 pl-12 text-xs italic focus:outline-none focus:ring-1 focus:ring-[#273134] shadow-sm rounded-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white mb-8 border border-gray-100 shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute bottom-4 right-4 w-12 h-12 text-white/40 group-hover:text-[#D4C4B5] transition-colors">
                  <ArtisanSeal />
                </div>
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-[#273134] text-white px-3 py-1 text-[8px] uppercase tracking-widest font-bold flex items-center shadow-sm">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                  {product.category === 'Jewellery' && (
                    <div className="bg-[#D4C4B5] text-[#273134] px-3 py-1 text-[8px] uppercase tracking-widest font-bold flex items-center shadow-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Studio Selection
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 font-bold">{product.category}</p>
                <h3 className="text-2xl font-serif mb-3 group-hover:text-[#D4C4B5] transition-colors">{product.name}</h3>
                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                  <p className="font-serif italic text-xl text-[#273134]">${product.price}</p>
                  <button className="text-[10px] uppercase tracking-widest font-bold border-b border-[#273134] pb-1 hover:text-[#D4C4B5] hover:border-[#D4C4B5] transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-32">
            <p className="text-gray-400 italic text-xl">The studio is quiet. Try another search.</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#273134]/90 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl rounded-sm flex flex-col md:flex-row">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 z-20 p-2 bg-white/50 backdrop-blur-md hover:bg-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full md:w-1/2 aspect-square md:aspect-auto overflow-hidden bg-gray-50">
              <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
            </div>

            <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center overflow-y-auto">
              <div className="mb-10">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#D4C4B5]">{selectedProduct.category}</span>
                  <ArtisanSeal className="w-6 h-6 text-[#D4C4B5]" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-serif italic mb-4">{selectedProduct.name}</h2>
                <p className="text-3xl font-serif italic text-[#273134]">${selectedProduct.price}</p>
              </div>

              <div className="space-y-6 mb-12">
                <p className="text-gray-500 italic leading-relaxed">{selectedProduct.description}</p>
                <div className="flex items-center space-x-3 p-4 bg-[#FAF9F6] border-l-2 border-[#D4C4B5]">
                  <ShieldCheck className="w-5 h-5 text-[#D4C4B5]" />
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Verified No-AI / 100% Tactile Origin</p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full bg-[#273134] text-white py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-black transition-all shadow-lg disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Acquire Work'}
                </button>
                <div className="flex items-center justify-center space-x-2 text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                  <Info className="w-3 h-3" />
                  <span>Ships in 3-5 business days from artisan studio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
