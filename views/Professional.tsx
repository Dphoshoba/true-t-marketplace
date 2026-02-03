
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  Loader2,
  Sparkles,
  Zap,
  HandMetal,
  ShieldAlert,
  Coins,
  Scale,
  FileText,
  Eye,
  X
} from 'lucide-react';
import { useStore } from '../store';

export const Professional: React.FC = () => {
  const { plans, setSelectedPlan, userPlan } = useStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showCharter, setShowCharter] = useState(false);

  const handleSelectPlan = (planId: string, planName: string) => {
    if (!agreedToTerms) {
      alert("Please review and agree to the Handmade Charter before joining.");
      return;
    }
    setIsProcessing(planId);
    setTimeout(() => {
      setSelectedPlan(planId);
      setIsProcessing(null);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 bg-[#FAF9F6]">
      {/* Hero */}
      <header className="bg-[#273134] text-white py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-[#D4C4B5] uppercase tracking-[0.4em] text-xs font-bold mb-6 block">Seller Portal</span>
          <h1 className="text-6xl md:text-8xl font-serif italic mb-8 leading-tight">
            Protect Your <span className="text-[#D4C4B5]">Craft.</span> <br />Simplify Your Sales.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl italic font-light leading-relaxed">
            The only marketplace where your $100 sale results in $95 in your pocket. No AI, no hidden percentages, just honest trade.
          </p>
        </div>
      </header>

      {/* The Seller Protocol */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div>
              <span className="text-[#D4C4B5] uppercase tracking-[0.4em] text-xs font-bold mb-6 block">The Marketplace Protocol</span>
              <h2 className="text-5xl font-serif italic mb-10 leading-snug">
                Transparent Trade for <br />
                <span className="text-gray-300">Modern Artisans.</span>
              </h2>

              <div className="space-y-12">
                <div className="flex space-x-6 group">
                  <div className="w-12 h-12 flex-shrink-0 bg-[#FAF9F6] border border-gray-100 flex items-center justify-center rounded-full">
                    <HandMetal className="w-5 h-5 text-[#273134]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif italic mb-2">1. The Handmade Vetting</h4>
                    <p className="text-sm text-gray-500 italic leading-relaxed">
                      We manually review every listing. If it was created by an AI prompt, it doesn't belong here.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-6 group">
                  <div className="w-12 h-12 flex-shrink-0 bg-[#FAF9F6] border border-gray-100 flex items-center justify-center rounded-full">
                    <Coins className="w-5 h-5 text-[#273134]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif italic mb-2">2. The Flat 10% Fee</h4>
                    <p className="text-sm text-gray-500 italic leading-relaxed">
                      Most platforms take 15-20%. We take a transparent 10% commission. Period. No subscription costs.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-6 group">
                  <div className="w-12 h-12 flex-shrink-0 bg-[#FAF9F6] border border-gray-100 flex items-center justify-center rounded-full">
                    <ShieldAlert className="w-5 h-5 text-[#D4C4B5]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif italic mb-2">3. Stripe Integration</h4>
                    <p className="text-sm text-gray-500 italic leading-relaxed">
                      Secure payouts via True T Marketplace. Connect your account: <code className="bg-gray-100 px-2 py-0.5 text-[10px]">acct_1SjGuQC0JO40R9i4</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#273134] p-16 relative overflow-hidden text-white border-l-4 border-[#D4C4B5]">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#D4C4B5] mb-12">Earnings Comparison</h4>

              <div className="space-y-10 relative z-10">
                <div className="pb-10 border-b border-white/10">
                  <h5 className="text-2xl font-serif italic mb-2">Legacy Platforms (Etsy/Others)</h5>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    Typical Sale: $100<br />
                    Fee: 15% + Listing Fee + Ads<br />
                    <span className="text-red-400">Net Profit: ~$82.00</span>
                  </p>
                </div>

                <div>
                  <h5 className="text-2xl font-serif italic mb-2">True T Marketplace</h5>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    Typical Sale: $100<br />
                    Fixed Commission: $10.00<br />
                    <span className="text-green-400">Net Profit: $90.00</span>
                  </p>
                  <div className="mt-6 flex items-center text-[10px] font-bold uppercase tracking-widest text-[#D4C4B5]">
                    <Zap className="w-4 h-4 mr-2" /> 15% Higher Profits
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-32 bg-[#FAF9F6] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[#D4C4B5] uppercase tracking-[0.4em] text-xs font-bold mb-4 block">Seller Memberships</span>
            <h2 className="text-5xl font-serif italic mb-6">Choose Your Scale</h2>
            <p className="text-gray-500 italic">Join the movement to return art to the artists.</p>
          </div>

          <div className="max-w-xl mx-auto mb-16 bg-white p-8 border border-gray-100 flex items-center space-x-6">
            <div className="p-4 bg-[#FAF9F6] rounded-full text-[#D4C4B5]"><Scale className="w-6 h-6" /></div>
            <div className="flex-grow">
              <p className="text-xs italic text-gray-500 leading-relaxed mb-4">
                By selecting a plan, you agree to our <button onClick={() => setShowCharter(true)} className="text-black font-bold underline decoration-[#D4C4B5]">Handmade Charter</button>, warranting that your work is original and free from AI generation.
              </p>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 accent-[#273134]"
                />
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#273134]">I agree to the Handmade Protocol</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {plans.slice(0, 2).map((plan) => (
              <div key={plan.id} className={`p-16 bg-white border transition-all duration-500 relative flex flex-col ${plan.isPopular ? 'border-[#D4C4B5] shadow-2xl scale-105 z-10' : 'border-gray-100'} ${userPlan === plan.id ? 'ring-2 ring-black ring-offset-4' : ''}`}>
                <h3 className="text-3xl font-serif italic mb-4">{plan.name}</h3>
                <div className="mb-10">
                  <span className="text-5xl font-serif italic">${plan.price}</span>
                  <span className="text-gray-400 text-sm italic">/{plan.interval}</span>
                </div>
                <ul className="space-y-5 mb-12 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-500 italic">
                      <Check className="w-4 h-4 text-[#D4C4B5] mr-3 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={isProcessing !== null || userPlan === plan.id}
                  onClick={() => handleSelectPlan(plan.id, plan.name)}
                  className={`w-full py-6 uppercase tracking-[0.2em] text-[10px] font-bold transition-all ${userPlan === plan.id
                      ? 'bg-green-600 text-white'
                      : !agreedToTerms
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#273134] text-white hover:bg-black shadow-lg'
                    }`}
                >
                  {isProcessing === plan.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : userPlan === plan.id ? 'Active Partner' : 'Start Selling'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charter Modal Overlay */}
      {showCharter && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#273134]/95 backdrop-blur-sm" onClick={() => setShowCharter(false)}></div>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl rounded-sm p-10 sm:p-20">
            <button
              onClick={() => setShowCharter(false)}
              className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col items-center text-center mb-16">
                <div className="w-16 h-16 border border-[#D4C4B5] rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl font-serif italic text-[#D4C4B5]">T</span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2">Official Document</span>
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

      {/* CTA */}
      <section className="py-32 bg-[#273134] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-5xl font-serif italic mb-8">No Prompts. No Bots.</h2>
          <p className="text-gray-400 text-lg mb-12 italic">Email our curator at true.t.marketplace@gmail.com for bulk seller integration or custom gallery requests.</p>
          <Link
            to="/bookings"
            className="inline-block bg-[#D4C4B5] text-[#273134] px-12 py-5 uppercase tracking-[0.3em] text-xs font-bold hover:bg-white transition-all"
          >
            Apply to Join
          </Link>
        </div>
      </section>
    </div>
  );
};
