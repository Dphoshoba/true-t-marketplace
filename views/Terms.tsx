
import React from 'react';
import { ShieldCheck, Scale, AlertOctagon, Info } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700 bg-[#FAF9F6] pb-32">
      <header className="py-24 border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#D4C4B5] uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Legal Framework</span>
          <h1 className="text-5xl md:text-6xl font-serif italic mb-6">The Handmade Charter</h1>
          <p className="text-gray-500 italic max-w-2xl mx-auto leading-relaxed">
            Our terms are designed to protect the value of human craftsmanship and ensure a transparent marketplace for intentional collectors.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-20">
          {/* Section 1 */}
          <section className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-10 bg-[#273134] text-white flex items-center justify-center rounded-sm">1</div>
              <h2 className="text-3xl font-serif italic">Definition of "Handmade" & Prohibited Products</h2>
            </div>
            <div className="prose prose-stone max-w-none text-gray-600 italic leading-loose">
              <p className="mb-4 font-bold text-[#273134] not-italic uppercase tracking-widest text-[10px]">Product Definition</p>
              <p className="mb-8">All products must be original and genuinely handmade or substantially altered and improved by the seller. We celebrate the marks of the maker, not the precision of the machine.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="p-8 bg-red-50/50 border border-red-100 rounded-sm">
                   <div className="flex items-center text-red-700 mb-4">
                     <AlertOctagon className="w-4 h-4 mr-2" />
                     <span className="text-[10px] uppercase tracking-widest font-bold">Strictly Prohibited</span>
                   </div>
                   <p className="text-sm text-red-900 leading-relaxed">Mass production, third-party manufacturing, and dropshipping are forbidden. Every item shipped must originate from the artisan's own studio.</p>
                </div>
                <div className="p-8 bg-amber-50/50 border border-amber-100 rounded-sm">
                   <div className="flex items-center text-amber-700 mb-4">
                     <ShieldCheck className="w-4 h-4 mr-2" />
                     <span className="text-[10px] uppercase tracking-widest font-bold">Zero AI Tolerance</span>
                   </div>
                   <p className="text-sm text-amber-900 leading-relaxed">The use of AI systems to generate visual artwork, designs, or patterns is forbidden. Sellers must not represent AI output as human-generated.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-10 bg-[#273134] text-white flex items-center justify-center rounded-sm">2</div>
              <h2 className="text-3xl font-serif italic">Seller Representations & Warranties</h2>
            </div>
            <ul className="space-y-6 text-gray-600 italic leading-relaxed">
              <li className="flex items-start">
                <span className="text-[#D4C4B5] mr-4 text-xl">/</span>
                Sellers warrant that all products listed are their own original, handmade work.
              </li>
              <li className="flex items-start">
                <span className="text-[#D4C4B5] mr-4 text-xl">/</span>
                Sellers confirm they own all necessary rights to distribute the products and that they do not infringe on any third-party intellectual property rights.
              </li>
              <li className="flex items-start">
                <span className="text-[#D4C4B5] mr-4 text-xl">/</span>
                Sellers agree that their listings and marketing materials are accurate, complete, and not misleading to the collector.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-10 bg-[#273134] text-white flex items-center justify-center rounded-sm">3</div>
              <h2 className="text-3xl font-serif italic">Marketplace Host Role & Liability</h2>
            </div>
            <div className="p-10 bg-white border border-gray-100 shadow-sm space-y-6">
              <p className="text-sm text-gray-500 italic leading-relaxed">
                True T Marketplace serves as a facilitator, not a party to the transactions between buyers and sellers.
              </p>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold flex items-center text-gray-400">
                  <Info className="w-3 h-3 mr-2" /> Limitation of Liability
                </p>
                <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
                  <li>We are not the manufacturer or seller of the goods.</li>
                  <li>We are not responsible for the quality, safety, or legality of advertised products.</li>
                  <li>Disputes regarding quality or delivery are strictly between buyer and seller.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 & 5 */}
          <section className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-serif italic underline decoration-[#D4C4B5] underline-offset-8">4. Account Suspension</h3>
              <p className="text-gray-600 italic text-sm leading-relaxed">
                We reserve the right to review, reject applications, or terminate any seller account at our absolute discretion—particularly if they breach the "handmade only" or "no AI" clauses. Prohibited items will result in immediate removal and potential forfeiture of fees.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-serif italic underline decoration-[#D4C4B5] underline-offset-8">5. Intellectual Property</h3>
              <p className="text-gray-600 italic text-sm leading-relaxed">
                Sellers retain IP rights to their products but grant True T Marketplace a non-exclusive license to use images and descriptions for platform promotion. Users are strictly prohibited from scraping data or copying content from the platform.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-32 pt-12 border-t border-gray-100 text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-300">Last Updated: May 20, 2024</p>
          <button className="mt-8 text-[10px] uppercase tracking-widest font-bold border-b border-black pb-1 hover:text-[#D4C4B5] hover:border-[#D4C4B5] transition-all">
            Download PDF Version
          </button>
        </div>
      </div>
    </div>
  );
};
