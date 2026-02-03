
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ConvexClientProvider } from './components/ConvexClientProvider';
import { StoreProvider } from './store';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { Shop } from './views/Shop';
import { Bookings } from './views/Bookings';
import { Portfolio } from './views/Portfolio';
import { Journal } from './views/Journal';
import { Professional } from './views/Professional';
import { AssetLibrary } from './views/AssetLibrary';
import { ClientDashboard } from './views/ClientDashboard';
import { AdminDashboard } from './admin/Dashboard';
import { Terms } from './views/Terms';
import { Success } from './views/Success';
import { Cancel } from './views/Cancel';

// Placeholder for About and Contact to keep code clean but functional
const About = () => (
  <Layout>
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <span className="text-[#D4C4B5] uppercase tracking-[0.4em] text-xs font-bold mb-4 block">Our Collective</span>
      <h1 className="text-6xl font-serif italic mb-12">Atelier & Agency.</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-20">
        <p className="text-gray-600 text-lg leading-relaxed italic">
          We began as a small pottery studio in 2018. As our passion for tactile creation grew, we realized that the same intentionality required for throwing clay applies to building digital ecosystems.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed italic">
          Today, we are a multi-disciplinary collective of artists, strategists, and engineers dedicated to brands that want to exist at the intersection of heritage and innovation.
        </p>
      </div>
      <img src="https://images.unsplash.com/photo-1596706502758-28314948842c?auto=format&fit=crop&q=80&w=1200" className="w-full h-[500px] object-cover shadow-2xl mb-24" alt="Studio" />
    </div>
  </Layout>
);

const App: React.FC = () => {
  return (
    <ConvexClientProvider>
      <StoreProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/shop" element={<Layout><Shop /></Layout>} />
            <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
            <Route path="/journal" element={<Layout><Journal /></Layout>} />
            <Route path="/bookings" element={<Layout><Bookings /></Layout>} />
            <Route path="/professional" element={<Layout><Professional /></Layout>} />
            <Route path="/library" element={<Layout><AssetLibrary /></Layout>} />
            <Route path="/dashboard" element={<Layout><ClientDashboard /></Layout>} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Layout><Terms /></Layout>} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/success" element={<Layout><Success /></Layout>} />
            <Route path="/cancel" element={<Layout><Cancel /></Layout>} />
          </Routes>
        </Router>
      </StoreProvider>
    </ConvexClientProvider>
  );
};

export default App;
