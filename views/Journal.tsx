
import React from 'react';
import { useStore } from '../store';
import { Clock, User, ChevronRight } from 'lucide-react';

export const Journal: React.FC = () => {
  const { posts } = useStore();

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <header className="bg-[#FAF9F6] py-32 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[#D4C4B5] uppercase tracking-[0.4em] text-xs font-bold mb-6 block">Thoughts & Process</span>
          <h1 className="text-6xl md:text-8xl font-serif italic mb-8">The Journal.</h1>
          <p className="text-gray-500 text-xl italic max-w-2xl mx-auto">Exploring the intersections of digital strategy, hand-craft, and the philosophy of slow creation.</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 gap-24">
          {posts.map((post, idx) => (
            <article key={post.id} className={`flex flex-col ${idx === 0 ? 'md:flex-row' : 'md:grid md:grid-cols-3'} gap-12`}>
              <div className={`${idx === 0 ? 'md:w-1/2' : 'md:col-span-1'} overflow-hidden aspect-[16/10]`}>
                <img 
                  src={post.image} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                  alt={post.title} 
                />
              </div>
              <div className={`${idx === 0 ? 'md:w-1/2 flex flex-col justify-center' : 'md:col-span-2 flex flex-col justify-center'} space-y-6`}>
                <div className="flex items-center space-x-6 text-[10px] uppercase tracking-widest font-bold text-[#D4C4B5]">
                  <span>{post.category}</span>
                  <div className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.readingTime}</div>
                  <div className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.author}</div>
                </div>
                <h2 className={`${idx === 0 ? 'text-5xl' : 'text-3xl'} font-serif italic leading-tight group-hover:text-[#D4C4B5] transition-colors`}>
                  {post.title}
                </h2>
                <p className="text-gray-500 leading-relaxed text-lg italic">{post.excerpt}</p>
                <button className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-black border-b border-black pb-1 self-start hover:text-[#D4C4B5] hover:border-[#D4C4B5] transition-all">
                  <span>Read Full Entry</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
