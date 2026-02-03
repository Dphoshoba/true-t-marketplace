
import React, { useState } from 'react';
import { useStore } from '../store';
import { ArrowUpRight } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const { projects } = useStore();
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(projects.map(p => p.category))];

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="animate-in fade-in duration-500">
      <header className="bg-white py-32 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-[#D4C4B5] uppercase tracking-[0.4em] text-xs font-bold mb-4 block">Case Studies</span>
          <h1 className="text-6xl md:text-8xl font-serif italic mb-12">The Work.</h1>
          
          <div className="flex flex-wrap gap-8">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs uppercase tracking-widest pb-1 transition-all border-b-2 ${filter === cat ? 'border-[#D4C4B5] text-black font-bold' : 'border-transparent text-gray-400 hover:text-black'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 gap-32">
          {filteredProjects.map((project, idx) => (
            <div key={project.id} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
              <div className="w-full lg:w-3/5 overflow-hidden bg-gray-50">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518005020251-582c788447da?q=80&w=1200&auto=format&fit=crop';
                  }}
                  className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              <div className="w-full lg:w-2/5 space-y-8">
                <div className="space-y-2">
                  <p className="text-[#D4C4B5] text-xs uppercase tracking-widest font-bold">{project.category} / {project.client}</p>
                  <h2 className="text-5xl font-serif italic leading-tight">{project.title}</h2>
                </div>
                <p className="text-gray-500 leading-relaxed text-lg">{project.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-2">The Challenge</h4>
                    <p className="text-sm italic">{project.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-2">The Outcome</h4>
                    <p className="text-sm italic">{project.outcome}</p>
                  </div>
                </div>
                <button className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold border-b border-black pb-1 hover:text-[#D4C4B5] hover:border-[#D4C4B5] transition-all">
                  <span>View Full Case Study</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
