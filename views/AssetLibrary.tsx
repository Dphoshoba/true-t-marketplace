
import React, { useState } from 'react';
import { useStore } from '../store';
import { Download, Lock, Search, Box, Type, Paintbrush, ShieldCheck, Zap, FileText, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Asset {
  id: string;
  name: string;
  category: string;
  type: string;
  preview: string;
  size: string;
  tier: 'Standard' | 'White-label' | 'Public';
}

const ASSETS: Asset[] = [
  {
    id: '0',
    name: 'The Handmade Charter',
    category: 'Legal & Brand',
    type: 'PDF Document',
    preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
    size: '1.2 MB',
    tier: 'Public'
  },
  {
    id: '1',
    name: 'Artisan Portfolio UI Kit',
    category: 'Design Systems',
    type: 'Figma File',
    preview: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
    size: '124 MB',
    tier: 'Standard'
  },
  {
    id: '2',
    name: 'Cormorant Studio Display',
    category: 'Typography',
    type: 'OTF Font',
    preview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    size: '2.4 MB',
    tier: 'Standard'
  },
  {
    id: '3',
    name: 'Matte Texture SVG Pack',
    category: 'Artisan Patterns',
    type: 'SVG Collection',
    preview: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
    size: '45 MB',
    tier: 'Standard'
  }
];

export const AssetLibrary: React.FC = () => {
  const { userPlan } = useStore();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [viewingCharter, setViewingCharter] = useState(false);

  const isSubscribed = userPlan !== null;
  const hasWhiteLabelAccess = userPlan === '2' || userPlan === '3';
  
  const categories = ['All', 'Legal & Brand', 'Design Systems', 'Typography', 'Artisan Patterns'];

  const filteredAssets = ASSETS.filter(asset => {
    const matchesFilter = filter === 'All' || asset.category === filter;
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const canDownload = (assetTier: string) => {
    if (assetTier === 'Public') return true;
    if (!isSubscribed) return false;
    if (assetTier === 'Standard') return true;
    return hasWhiteLabelAccess;
  };

  return (
    <div className="animate-in fade-in duration-500 min-h-screen pb-32 bg-[#FAF9F6]">
      <header className="bg-white pt-32 pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#D4C4B5] uppercase tracking-[0.4em] text-xs font-bold block">Proprietary Resources</span>
            {isSubscribed && (
              <div className="flex items-center space-x-2 bg-[#273134] text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold">
                <ShieldCheck className="w-4 h-4 text-[#D4C4B5]" />
                <span>Partner Access Active</span>
              </div>
            )}
          </div>
          <h1 className="text-6xl font-serif italic mb-8">Asset Library.</h1>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between mt-12">
            <div className="flex flex-wrap gap-6">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-[10px] uppercase tracking-widest pb-1 transition-all border-b-2 ${
                    filter === cat ? 'border-[#D4C4B5] text-black font-bold' : 'border-transparent text-gray-400 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type="text" 
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-gray-100 py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4C4B5] rounded-sm"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredAssets.map((asset) => {
            const hasAccess = canDownload(asset.tier);
            
            return (
              <div key={asset.id} className="group border border-gray-100 bg-white hover:border-[#D4C4B5] transition-all duration-500 flex flex-col relative shadow-sm">
                <div className="aspect-[16/10] overflow-hidden bg-[#FAF9F6] relative">
                  <img 
                    src={asset.preview} 
                    alt={asset.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                  />
                  <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 text-[8px] uppercase tracking-widest font-bold flex items-center shadow-sm">
                    {asset.tier === 'White-label' && <Zap className="w-3 h-3 mr-1 text-[#D4C4B5]" />}
                    {asset.tier}
                  </div>
                  {!hasAccess && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-8 text-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Lock className="w-8 h-8 mb-4 text-[#D4C4B5]" />
                      <p className="text-[10px] uppercase tracking-widest font-bold">Requires Subscription</p>
                      <Link to="/professional" className="mt-4 text-[8px] underline tracking-widest uppercase">Upgrade Access</Link>
                    </div>
                  )}
                </div>
                <div className="p-8 space-y-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#D4C4B5] font-bold block mb-1">{asset.category}</span>
                      <h3 className="text-xl font-serif italic">{asset.name}</h3>
                    </div>
                    <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">{asset.size}</span>
                  </div>
                  
                  <div className="pt-4 flex justify-between items-center border-t border-gray-50">
                    {asset.id === '0' ? (
                      <button 
                        onClick={() => setViewingCharter(true)}
                        className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-[#273134] hover:text-[#D4C4B5] transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Document</span>
                      </button>
                    ) : (
                      <div className="text-gray-300">
                        {asset.category === 'Design Systems' && <Box className="w-4 h-4" />}
                        {asset.category === 'Typography' && <Type className="w-4 h-4" />}
                      </div>
                    )}
                    
                    {hasAccess && (
                      <button 
                        onClick={() => alert(`Download initiated: ${asset.name}`)}
                        className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold hover:text-[#D4C4B5] transition-colors"
                      >
                        <span>Download</span>
                        <Download className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charter Modal */}
      {viewingCharter && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#273134]/90 backdrop-blur-sm" onClick={() => setViewingCharter(false)}></div>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl rounded-sm p-10 sm:p-20">
            <button 
              onClick={() => setViewingCharter(false)}
              className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col items-center text-center mb-16">
                 <div className="w-16 h-16 border border-[#D4C4B5] rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl font-serif italic text-[#D4C4B5]">T</span>
                 </div>
                 <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2">The True T Marketplace</span>
                 <h2 className="text-4xl sm:text-5xl font-serif italic">The Handmade Charter</h2>
              </div>
              
              <div className="prose prose-stone prose-lg italic text-gray-600 leading-loose">
                <p className="mb-8">This Charter establishes the foundational principles of the True T Marketplace, a sanctuary dedicated to human creation and slow commerce.</p>
                
                <h4 className="font-serif italic text-2xl text-[#273134] mt-12 mb-4">I. The Primacy of the Hand</h4>
                <p>We believe that art is an extension of the soul. Every product listed must be forged, thrown, carved, or stitched by human hands. We strictly prohibit mass-manufactured items or dropshipping.</p>
                
                <h4 className="font-serif italic text-2xl text-[#273134] mt-12 mb-4">II. Zero AI Tolerance</h4>
                <p>In a world of synthetic generation, we remain intentionally primitive. We prohibit the use of AI-generated visuals, prompts, or computational designs disguised as manual craft. True T is a purely organic ecosystem.</p>
                
                <h4 className="font-serif italic text-2xl text-[#273134] mt-12 mb-4">III. The Fair Fee Standard</h4>
                <p>We reject the extractive pricing models of legacy platforms. A flat $5 commission ensures that the value created in the studio remains with the artisan, supporting the continuation of traditional skills.</p>
                
                <h4 className="font-serif italic text-2xl text-[#273134] mt-12 mb-4">IV. Radical Transparency</h4>
                <p>Collectors deserve the truth. Every listing must honestly represent its materials, process, and origin. No deception. No noise. Just pure provenance.</p>
              </div>
              
              <div className="mt-20 pt-12 border-t border-gray-100 flex justify-between items-center text-[9px] uppercase tracking-widest font-bold text-gray-400">
                <span>EST. 2024 / AUTHENTICATED ARTISAN NETWORK</span>
                <span className="text-[#D4C4B5]">MARCUS K. / ARCHITECT</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
