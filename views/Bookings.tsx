
import React, { useState } from 'react';
import { useStore } from '../store';
import { Send, Calendar, Scissors, Paintbrush } from 'lucide-react';

export const Bookings: React.FC = () => {
  const { addBooking } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Custom Ceramics',
    message: '',
    date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBooking({
      id: Date.now().toString(),
      customerName: formData.name,
      email: formData.email,
      service: formData.service,
      date: formData.date,
      message: formData.message,
      status: 'pending',
      timestamp: new Date().toISOString()
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="bg-[#D4C4B5]/10 p-12 rounded-full mb-8">
          <Send className="w-12 h-12 text-[#D4C4B5]" />
        </div>
        <h2 className="text-4xl font-serif mb-4">Request Received</h2>
        <p className="text-gray-500 italic max-w-md mx-auto mb-8">
          Thank you for reaching out. We will review your vision and get back to you within 2-3 business days to discuss the details.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-[#D4C4B5] hover:border-[#D4C4B5]"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <header className="py-24 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#D4C4B5] mb-4 block">Bespoke Design</span>
          <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">Create Something Unique</h1>
          <p className="text-gray-500 italic text-lg leading-relaxed max-w-2xl mx-auto">
            From heirloom ceramics to custom textile art, we collaborate with you to bring personal stories to life through handcrafted objects.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-3xl font-serif mb-8">The Process</h2>
            <div className="space-y-12">
              <div className="flex space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#2D2926] text-white flex items-center justify-center font-serif italic text-xl">1</div>
                <div>
                  <h4 className="text-lg font-serif mb-2 italic font-bold">Inspiration & Inquiry</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Fill out the form with your initial ideas, preferred timeline, and any specific materials you're interested in.</p>
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D4C4B5] text-white flex items-center justify-center font-serif italic text-xl">2</div>
                <div>
                  <h4 className="text-lg font-serif mb-2 italic font-bold">Consultation</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">We schedule a brief call or email exchange to refine the concept, choose colors, and finalize dimensions.</p>
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="flex-shrink-0 w-12 h-12 border border-[#D4C4B5] text-[#D4C4B5] flex items-center justify-center font-serif italic text-xl">3</div>
                <div>
                  <h4 className="text-lg font-serif mb-2 italic font-bold">Crafting Period</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Once the deposit is made, the slow crafting process begins. You'll receive photo updates along the way.</p>
                </div>
              </div>
            </div>

            <div className="mt-20 p-8 border border-[#D4C4B5]/20 bg-[#FAF9F6] italic rounded-lg">
              <p className="text-gray-500 text-sm leading-relaxed">
                "My commission was more than just a purchase; it was a conversation. Tanya translated my memories into a beautiful ceramic form."
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-widest font-bold">— Sarah J., New York</p>
            </div>
          </div>

          <div className="bg-white shadow-2xl p-8 md:p-12 border border-gray-50 rounded-lg">
            <h3 className="text-2xl font-serif mb-8 italic">Commission Request</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Your Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border-gray-100 p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4C4B5]" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border-gray-100 p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4C4B5]" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Service Interest</label>
                <select 
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                  className="w-full bg-gray-50 border-gray-100 p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4C4B5]"
                >
                  <option>Custom Ceramics</option>
                  <option>Textile Commissions</option>
                  <option>Large Scale Art Installations</option>
                  <option>Event/Wedding Decor</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Desired Delivery Date</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-gray-50 border-gray-100 p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4C4B5]" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Vision & Details</label>
                <textarea 
                  rows={5} 
                  placeholder="Tell me about your vision, colors, and the story behind this request..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-gray-50 border-gray-100 p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4C4B5]"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-[#2D2926] text-white py-5 uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-lg"
              >
                Submit Inquiry
              </button>
              <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                Protected by secure artisan encryption.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
