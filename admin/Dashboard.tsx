
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  BookOpen,
  Settings,
  Inbox,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Briefcase,
  RotateCcw,
  ExternalLink,
  Database,
  ShieldCheck,
  AlertTriangle,
  Rocket,
  Key,
  CreditCard,
  Globe,
  TrendingUp,
  BarChart3,
  Server,
  Lock,
  ArrowLeft,
  Upload
} from 'lucide-react';
import { useStore } from '../store';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Product, BlogPost, Project } from '../types';

// High-quality placeholder for the graffiti art
const GRAFFITI_BG = "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&q=80&w=1920";

export const AdminDashboard: React.FC = () => {
  const {
    products,
    posts,
    projects,
    bookings,
    isAdmin,
    setAdminStatus,
    deleteProject,
    settings,
    updateSettings
  } = useStore();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'products' | 'posts' | 'bookings' | 'settings' | 'launch' | 'ledger'>('overview');
  const [password, setPassword] = useState('');
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'checking'>('checking');

  // Product Management State
  // Product Management State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  // Post Management State
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});

  // Project Management State
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});

  const [uploading, setUploading] = useState(false);
  const {
    addProduct, updateProduct, deleteProduct: removeProduct,
    addPost, updatePost, deletePost: removePost,
    addProject, updateProject, deleteProject: removeProject,
    connectStripe
  } = useStore(); // Destructure actions

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getUrl);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];

      // 1. Get Upload URL
      const postUrl = await generateUploadUrl();

      // 2. Post File
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      // 3. Get Public URL
      const url = await getFileUrl({ storageId });

      if (!url) throw new Error('Failed to get public URL');

      setCurrentProduct(prev => ({ ...prev, image: url || '' }));
    } catch (error) {
      alert('Error uploading image: ' + (error as any).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (!currentProduct.name || !currentProduct.price) return alert('Name and Price are required');

      const productData = {
        ...currentProduct,
        id: currentProduct.id || Math.random().toString(36).substr(2, 9),
        category: currentProduct.category || 'Jewellery',
        image: currentProduct.image || '', // No default AI image
        status: currentProduct.status || 'published',
        seo: currentProduct.seo || { title: currentProduct.name, description: currentProduct.description || '', slug: currentProduct.name.toLowerCase().replace(/ /g, '-') }
      } as Product;

      // Validate image is present
      if (!productData.image) {
        return alert('Please upload an image for the product.');
      }

      if (currentProduct.id) {
        await updateProduct(productData);
      } else {
        await addProduct(productData);
      }

      setIsEditingProduct(false);
      setCurrentProduct({});
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleSavePost = async () => {
    try {
      if (!currentPost.title) return alert('Title is required');

      const postData = {
        ...currentPost,
        id: currentPost.id || Math.random().toString(36).substr(2, 9),
        date: currentPost.date || new Date().toISOString(),
        author: currentPost.author || 'David George',
        category: currentPost.category || 'Journal',
        status: currentPost.status || 'published',
        image: currentPost.image || '',
        readingTime: currentPost.readingTime || '5 min read',
        content: currentPost.content || '',
        excerpt: currentPost.excerpt || '',
        seo: currentPost.seo || { title: currentPost.title, description: currentPost.excerpt || '', slug: currentPost.title.toLowerCase().replace(/ /g, '-') }
      } as BlogPost;

      if (!postData.image) return alert('Please upload an image for the post.');

      if (currentPost.id) {
        await updatePost(postData);
      } else {
        await addPost(postData);
      }

      setIsEditingPost(false);
      setCurrentPost({});
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    }
  };

  const handleSaveProject = async () => {
    try {
      if (!currentProject.title) return alert('Title is required');

      const projectData = {
        ...currentProject,
        id: currentProject.id || Math.random().toString(36).substr(2, 9),
        client: currentProject.client || 'Private Client',
        category: currentProject.category || 'Bespoke',
        year: currentProject.year || new Date().getFullYear().toString(),
        description: currentProject.description || '',
        image: currentProject.image || '',
        challenge: currentProject.challenge || '',
        outcome: currentProject.outcome || ''
      } as Project;

      if (!projectData.image) return alert('Please upload an image for the project.');

      if (currentProject.id) {
        await updateProject(projectData);
      } else {
        await addProject(projectData);
      }

      setIsEditingProject(false);
      setCurrentProject({});
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  useEffect(() => {
    setDbStatus('connected');

    // Check for Stripe Connect callback
    const params = new URLSearchParams(window.location.search);
    const stripeConnected = params.get('stripe_connected');
    const accountId = params.get('account_id');

    if (stripeConnected && accountId) {
      updateSettings({ ...settings, stripeAccountId: accountId })
        .then(() => {
          alert('Stripe Account Connected Successfully!');
          // Clear URL params
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(err => alert('Failed to save Stripe Account: ' + err.message));
    }
  }, [settings]);

  const handleReset = () => {
    if (confirm('This will reset all your local changes. Continue?')) {
      localStorage.removeItem('atelier_comprehensive_state');
      localStorage.removeItem('atelier_project_briefs');
      window.location.reload();
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2D2926] px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={GRAFFITI_BG}
            className="w-full h-full object-cover"
            alt="Graffiti Background"
          />
        </div>
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl p-12 shadow-2xl border border-white/20 relative z-10 rounded-sm">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif italic mb-2 tracking-widest">Atelier Access</h1>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Expect Nothing. Create Everything.</p>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Link to="/" className="flex items-center text-[9px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-2">
                <ArrowLeft className="w-3 h-3 mr-1" /> Back to Home
              </Link>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Administrator Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hint: admin"
                onKeyDown={(e) => e.key === 'Enter' && (password === 'admin' ? setAdminStatus(true) : alert('Invalid Password'))}
                className="w-full bg-[#FAF9F6] border-none p-4 focus:outline-none focus:ring-1 focus:ring-[#D4C4B5] text-center font-mono"
              />
            </div>
            <button
              onClick={() => password === 'admin' ? setAdminStatus(true) : alert('Invalid Password')}
              className="w-full bg-[#2D2926] text-white py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-black transition-all"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const SidebarLink: React.FC<{ tab: typeof activeTab; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center space-x-4 px-8 py-5 transition-all ${activeTab === tab
        ? 'bg-white/10 text-white backdrop-blur-md'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
    >
      {icon}
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen relative flex">
      {/* Immersive Skeleton Graffiti Background */}
      <div className="fixed inset-0 z-0 bg-[#1A1C1E]">
        <img
          src={GRAFFITI_BG}
          className="w-full h-full object-cover opacity-60"
          alt="Graffiti Background"
        />
        <div className="absolute inset-0 bg-[#1A1C1E]/80 backdrop-blur-[1px]"></div>
      </div>

      {/* Sidebar - Glassmorphic */}
      <aside className="w-80 border-r border-white/5 h-screen sticky top-0 flex flex-col z-20 bg-black/50 backdrop-blur-2xl">
        <div className="p-10 border-b border-white/5 bg-black/20 text-center">
          <h2 className="text-2xl font-serif italic tracking-widest text-white">{settings.brandName}</h2>
          <p className="text-[9px] text-[#D4C4B5] uppercase tracking-[0.4em] font-bold mt-2">Expect Nothing.</p>
        </div>

        <nav className="flex-grow py-6 overflow-y-auto">
          <SidebarLink tab="overview" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" />
          <SidebarLink tab="ledger" icon={<TrendingUp className="w-4 h-4 text-green-400" />} label="Project Ledger" />
          <SidebarLink tab="launch" icon={<Rocket className="w-4 h-4 text-amber-500" />} label="Launch Readiness" />
          <SidebarLink tab="projects" icon={<Briefcase className="w-4 h-4" />} label="Portfolio" />
          <SidebarLink tab="products" icon={<Package className="w-4 h-4" />} label="Shop Items" />
          <SidebarLink tab="posts" icon={<BookOpen className="w-4 h-4" />} label="Journal" />
          <SidebarLink tab="bookings" icon={<Inbox className="w-4 h-4" />} label="Inquiries" />
          <SidebarLink tab="settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
        </nav>

        <div className="p-8 border-t border-white/5 space-y-4">
          <div className="px-2 mb-4">
            <div className={`flex items-center space-x-2 p-3 rounded-sm text-[9px] uppercase tracking-widest font-bold ${dbStatus === 'connected' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
              {dbStatus === 'connected' ? <Database className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              <span>Cloud DB: {dbStatus}</span>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center justify-center space-x-3 bg-[#D4C4B5] text-[#2D2926] py-4 w-full uppercase tracking-widest text-[10px] font-bold hover:bg-white transition-all shadow-xl">
            <ExternalLink className="w-4 h-4" />
            <span>Public Site</span>
          </button>
          <button onClick={() => setAdminStatus(false)} className="flex items-center space-x-3 text-gray-500 hover:text-red-400 transition-colors w-full px-2">
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-16 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#D4C4B5] mb-2">Studio Command</p>
              <h1 className="text-5xl font-serif italic text-white">Management Dashboard</h1>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                {[
                  { label: 'Studio Projects', val: projects.length },
                  { label: 'Shop Volume', val: `$${products.reduce((acc, p) => acc + p.price, 0)}` },
                  { label: 'Active Inquiries', val: bookings.length },
                  { label: 'Journal Entries', val: posts.length },
                ].map((stat, i) => (
                  <div key={i} className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl group hover:border-[#D4C4B5]/50 transition-all">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-4 font-bold">{stat.label}</p>
                    <p className="text-4xl font-serif italic text-white group-hover:text-[#D4C4B5] transition-colors">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'ledger' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-serif italic text-white flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    Developer Ledger
                  </h2>
                  <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">Revenue Streams & Financial Health</p>
                </div>
                <div className="bg-green-400/10 border border-green-400/20 px-6 py-3 rounded-sm">
                  <p className="text-[9px] uppercase tracking-widest text-green-400 font-bold mb-1">Total Contract Value</p>
                  <p className="text-xl font-serif italic text-white">$12,500 <span className="text-xs text-gray-500 not-italic">+ $450/mo</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Stream 1: Implementation */}
                <div className="bg-[#2D2926] border border-white/5 p-8 relative overflow-hidden group hover:border-[#D4C4B5]/30 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Database className="w-24 h-24 text-white" />
                  </div>
                  <h3 className="text-lg font-serif italic text-white mb-2">1. Implementation Fee</h3>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-6">The Build & Architecture</p>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-300">Base Architecture</span>
                      <span className="text-white font-mono">$8,500</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-300">AI Integration</span>
                      <span className="text-white font-mono">$3,000</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-300">Launch Suite</span>
                      <span className="text-white font-mono">$1,000</span>
                    </div>
                    <div className="pt-2 text-right">
                      <span className="text-green-400 font-serif italic text-xl">$12,500</span>
                      <p className="text-[8px] uppercase tracking-widest text-gray-500 mt-1">Paid Upon Completion</p>
                    </div>
                  </div>
                </div>

                {/* Stream 2: Infrastructure */}
                <div className="bg-[#2D2926] border border-white/5 p-8 relative overflow-hidden group hover:border-[#D4C4B5]/30 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Server className="w-24 h-24 text-white" />
                  </div>
                  <h3 className="text-lg font-serif italic text-white mb-2">2. Infrastructure Mgmt</h3>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-6">The Retainer (Monthly)</p>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-300">Hosting Markup</span>
                      <span className="text-white font-mono">$150/mo</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-300">AI Access Fee</span>
                      <span className="text-white font-mono">$100/mo</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-300">Security Audit</span>
                      <span className="text-white font-mono">$200/mo</span>
                    </div>
                    <div className="pt-2 text-right">
                      <span className="text-[#D4C4B5] font-serif italic text-xl">$450/mo</span>
                      <p className="text-[8px] uppercase tracking-widest text-gray-500 mt-1">Recurring Revenue</p>
                    </div>
                  </div>
                </div>

                {/* Stream 3: White Label */}
                <div className="bg-[#2D2926] border border-white/5 p-8 relative overflow-hidden group hover:border-[#D4C4B5]/30 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Copy className="w-24 h-24 text-white" />
                  </div>
                  <h3 className="text-lg font-serif italic text-white mb-2">3. White-Label Multiplier</h3>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-6">IP Replication Value</p>
                  <p className="text-gray-400 text-xs italic leading-relaxed mb-6">
                    This "Atelier Engine" can be deployed for other verticals (Florists, Woodworkers) at 10% cost for 100% value.
                  </p>
                  <div className="bg-white/5 p-4 rounded-sm border border-white/5">
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-2">Projected Resale Value</p>
                    <p className="text-white font-serif italic text-lg">$8,500 <span className="text-gray-500 text-xs">per instance</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-black/20 border border-white/5 p-8 rounded-sm">
                <h3 className="text-lg font-serif italic text-white mb-6">Monthly Maintenance Checklist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {['Convex DB Backup', 'Gemini API Cost Audit', 'Stripe Connect Log Review', 'Security Headers Scan'].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 bg-white/5 p-4 rounded-sm border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="w-4 h-4 rounded-full border border-gray-500 group-hover:border-[#D4C4B5] transition-colors"></div>
                      <span className="text-gray-300 text-xs group-hover:text-white transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'products' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-serif italic text-white flex items-center gap-3">
                    <Package className="w-6 h-6 text-[#D4C4B5]" />
                    Shop Inventory
                  </h2>
                  <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">Manage your collection</p>
                </div>
                <button
                  onClick={() => { setCurrentProduct({}); setIsEditingProduct(true); }}
                  className="bg-[#D4C4B5] text-[#2D2926] px-6 py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-white transition-all flex items-center gap-2 rounded-sm"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white/5 border border-white/10 group hover:border-[#D4C4B5]/50 transition-all">
                    <div className="relative aspect-video overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }}
                          className="bg-white/90 p-2 hover:bg-[#D4C4B5] transition-colors rounded-sm"
                        >
                          <Edit className="w-3 h-3 text-[#2D2926]" />
                        </button>
                        <button
                          onClick={() => { if (confirm('Are you sure?')) removeProduct(product.id); }}
                          className="bg-white/90 p-2 hover:bg-red-400 transition-colors rounded-sm"
                        >
                          <Trash2 className="w-3 h-3 text-[#2D2926]" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-1 ${product.status === 'published' ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400'}`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-serif italic text-white">{product.name}</h3>
                        <span className="text-[#D4C4B5] font-mono">${product.price}</span>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-4">{product.description}</p>
                      <div className="text-[9px] uppercase tracking-widest text-gray-400">
                        {product.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Modal */}
              {isEditingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="bg-[#2D2926] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                      <h3 className="text-xl font-serif italic text-white">
                        {currentProduct.id ? 'Edit Product' : 'New Product'}
                      </h3>
                      <button onClick={() => setIsEditingProduct(false)} className="text-gray-500 hover:text-white">
                        <div className="uppercase tracking-widest text-[9px] font-bold">Close</div>
                      </button>
                    </div>

                    <div className="p-8 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Product Name</label>
                          <input
                            type="text"
                            value={currentProduct.name || ''}
                            onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Price ($)</label>
                          <input
                            type="number"
                            value={currentProduct.price || ''}
                            onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Description</label>
                        <textarea
                          value={currentProduct.description || ''}
                          onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Category</label>
                          <select
                            value={currentProduct.category || 'Jewellery'}
                            onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors"
                          >
                            <option value="Jewellery">Jewellery</option>
                            <option value="Woodwork">Woodwork</option>
                            <option value="Ceramics">Ceramics</option>
                            <option value="Art">Art</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Status</label>
                          <div className="flex gap-4 pt-2">
                            {['draft', 'published'].map(status => (
                              <button
                                key={status}
                                onClick={() => setCurrentProduct({ ...currentProduct, status: status as 'draft' | 'published' })}
                                className={`px-4 py-2 text-[9px] uppercase tracking-widest font-bold border transition-colors ${currentProduct.status === status ? 'bg-[#D4C4B5] text-[#2D2926] border-[#D4C4B5]' : 'border-white/10 text-gray-400 hover:border-white'}`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Product Image</label>
                        <div className="border border-dashed border-white/20 p-8 text-center hover:bg-white/5 transition-colors relative group">
                          {currentProduct.image ? (
                            <div className="relative inline-block">
                              <img src={currentProduct.image} alt="Preview" className="h-32 object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs">Click to change</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                              <Upload className="w-8 h-8 opacity-50" />
                              <span className="text-xs">Drag and drop or click to upload</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading}
                          />
                        </div>
                        {uploading && <p className="text-[#D4C4B5] text-xs text-center animate-pulse">Uploading to Cloud Storage...</p>}
                      </div>

                      <div className="space-y-2 pt-4 border-t border-white/5">
                        <h4 className="text-white font-serif italic mb-4">SEO Metadata</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            placeholder="SEO Title"
                            value={currentProduct.seo?.title || ''}
                            onChange={e => setCurrentProduct({ ...currentProduct, seo: { ...currentProduct.seo!, title: e.target.value } })}
                            className="bg-white/5 border border-white/10 p-3 text-white text-xs"
                          />
                          <input
                            placeholder="SEO Slug"
                            value={currentProduct.seo?.slug || ''}
                            onChange={e => setCurrentProduct({ ...currentProduct, seo: { ...currentProduct.seo!, slug: e.target.value } })}
                            className="bg-white/5 border border-white/10 p-3 text-white text-xs"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleSaveProduct}
                        disabled={uploading}
                        className="w-full bg-[#D4C4B5] text-[#2D2926] py-4 uppercase tracking-widest text-[10px] font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Processing...' : 'Save Product'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {activeTab === 'posts' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-serif italic text-white flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-[#D4C4B5]" />
                    Journal Entries
                  </h2>
                  <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">Manage your blog posts</p>
                </div>
                <button
                  onClick={() => { setCurrentPost({}); setIsEditingPost(true); }}
                  className="bg-[#D4C4B5] text-[#2D2926] px-6 py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-white transition-all flex items-center gap-2 rounded-sm"
                >
                  <Plus className="w-4 h-4" /> New Entry
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white/5 border border-white/10 group hover:border-[#D4C4B5]/50 transition-all">
                    <div className="relative aspect-video overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setCurrentPost(post); setIsEditingPost(true); }}
                          className="bg-white/90 p-2 hover:bg-[#D4C4B5] transition-colors rounded-sm"
                        >
                          <Edit className="w-3 h-3 text-[#2D2926]" />
                        </button>
                        <button
                          onClick={() => { if (confirm('Are you sure?')) removePost(post.id); }}
                          className="bg-white/90 p-2 hover:bg-red-400 transition-colors rounded-sm"
                        >
                          <Trash2 className="w-3 h-3 text-[#2D2926]" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-serif italic text-white">{post.title}</h3>
                        <span className="text-[9px] uppercase tracking-widest text-[#D4C4B5]">{post.category}</span>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-400">
                        <Clock className="w-3 h-3" /> {post.readingTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Post Edit Modal */}
              {isEditingPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="bg-[#2D2926] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                      <h3 className="text-xl font-serif italic text-white">
                        {currentPost.id ? 'Edit Entry' : 'New Entry'}
                      </h3>
                      <button onClick={() => setIsEditingPost(false)} className="text-gray-500 hover:text-white">
                        <div className="uppercase tracking-widest text-[9px] font-bold">Close</div>
                      </button>
                    </div>

                    <div className="p-8 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Title</label>
                        <input
                          type="text"
                          value={currentPost.title || ''}
                          onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Excerpt</label>
                        <textarea
                          value={currentPost.excerpt || ''}
                          onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Content</label>
                        <textarea
                          value={currentPost.content || ''}
                          onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
                          rows={6}
                          className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Category</label>
                          <select
                            value={currentPost.category || 'Journal'}
                            onChange={e => setCurrentPost({ ...currentPost, category: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors"
                          >
                            <option value="Journal">Journal</option>
                            <option value="News">News</option>
                            <option value="Process">Process</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Reading Time</label>
                          <input
                            type="text"
                            value={currentPost.readingTime || '5 min read'}
                            onChange={e => setCurrentPost({ ...currentPost, readingTime: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Cover Image</label>
                        <div className="border border-dashed border-white/20 p-8 text-center hover:bg-white/5 transition-colors relative group">
                          {currentPost.image ? (
                            <div className="relative inline-block">
                              <img src={currentPost.image} alt="Preview" className="h-32 object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs">Click to change</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                              <Upload className="w-8 h-8 opacity-50" />
                              <span className="text-xs">Drag and drop or click to upload</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              // Re-using handleImageUpload logic but setting currentPost
                              try {
                                setUploading(true);
                                if (!e.target.files || e.target.files.length === 0) throw new Error('No file selected');
                                const file = e.target.files[0];
                                const postUrl = await generateUploadUrl();
                                const result = await fetch(postUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
                                const { storageId } = await result.json();
                                const url = await getFileUrl({ storageId });
                                if (!url) throw new Error('Failed to get public URL');
                                setCurrentPost(prev => ({ ...prev, image: url || '' }));
                              } catch (err) { alert('Error uploading: ' + (err as any).message); } finally { setUploading(false); }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading}
                          />
                        </div>
                        {uploading && <p className="text-[#D4C4B5] text-xs text-center animate-pulse">Uploading to Cloud Storage...</p>}
                      </div>

                      <button
                        onClick={handleSavePost}
                        disabled={uploading}
                        className="w-full bg-[#D4C4B5] text-[#2D2926] py-4 uppercase tracking-widest text-[10px] font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Processing...' : 'Save Entry'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-serif italic text-white flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-[#D4C4B5]" />
                    Portfolio Projects
                  </h2>
                  <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">Manage your showcase</p>
                </div>
                <button
                  onClick={() => { setCurrentProject({}); setIsEditingProject(true); }}
                  className="bg-[#D4C4B5] text-[#2D2926] px-6 py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-white transition-all flex items-center gap-2 rounded-sm"
                >
                  <Plus className="w-4 h-4" /> New Project
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white/5 border border-white/10 group hover:border-[#D4C4B5]/50 transition-all">
                    <div className="relative aspect-video overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { if (confirm('Are you sure?')) removeProject(project.id); }}
                          className="bg-white/90 p-2 hover:bg-red-400 transition-colors rounded-sm"
                        >
                          <Trash2 className="w-3 h-3 text-[#2D2926]" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-serif italic text-white">{project.title}</h3>
                        <span className="text-[9px] uppercase tracking-widest text-[#D4C4B5]">{project.category}</span>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-4">{project.description}</p>
                      <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-400">
                        {project.client} • {project.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Project Edit Modal */}
              {isEditingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="bg-[#2D2926] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                      <h3 className="text-xl font-serif italic text-white">
                        {currentProject.id ? 'Edit Project' : 'New Project'}
                      </h3>
                      <button onClick={() => setIsEditingProject(false)} className="text-gray-500 hover:text-white">
                        <div className="uppercase tracking-widest text-[9px] font-bold">Close</div>
                      </button>
                    </div>

                    <div className="p-8 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Project Title</label>
                        <input
                          type="text"
                          value={currentProject.title || ''}
                          onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Description</label>
                        <textarea
                          value={currentProject.description || ''}
                          onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Client</label>
                          <input
                            type="text"
                            value={currentProject.client || ''}
                            onChange={e => setCurrentProject({ ...currentProject, client: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Category</label>
                          <select
                            value={currentProject.category || 'Bespoke'}
                            onChange={e => setCurrentProject({ ...currentProject, category: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors"
                          >
                            <option value="Bespoke">Bespoke</option>
                            <option value="Restoration">Restoration</option>
                            <option value="Commercial">Commercial</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Project Image</label>
                        <div className="border border-dashed border-white/20 p-8 text-center hover:bg-white/5 transition-colors relative group">
                          {currentProject.image ? (
                            <div className="relative inline-block">
                              <img src={currentProject.image} alt="Preview" className="h-32 object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs">Click to change</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                              <Upload className="w-8 h-8 opacity-50" />
                              <span className="text-xs">Drag and drop or click to upload</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              // Re-using handleImageUpload logic but setting currentProject
                              try {
                                setUploading(true);
                                if (!e.target.files || e.target.files.length === 0) throw new Error('No file selected');
                                const file = e.target.files[0];
                                const postUrl = await generateUploadUrl();
                                const result = await fetch(postUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
                                const { storageId } = await result.json();
                                const url = await getFileUrl({ storageId });
                                if (!url) throw new Error('Failed to get public URL');
                                setCurrentProject(prev => ({ ...prev, image: url || '' }));
                              } catch (err) { alert('Error uploading: ' + (err as any).message); } finally { setUploading(false); }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading}
                          />
                        </div>
                        {uploading && <p className="text-[#D4C4B5] text-xs text-center animate-pulse">Uploading to Cloud Storage...</p>}
                      </div>

                      <button
                        onClick={handleSaveProject}
                        disabled={uploading}
                        className="w-full bg-[#D4C4B5] text-[#2D2926] py-4 uppercase tracking-widest text-[10px] font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Processing...' : 'Save Project'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
              <h2 className="text-2xl font-serif italic text-white flex items-center gap-3 mb-2">
                <Settings className="w-6 h-6 text-[#D4C4B5]" />
                Studio Settings
              </h2>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-10">Configure your platform</p>

              <div className="space-y-8">
                {/* Visual Identity Section */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                  <h3 className="text-lg font-serif italic text-white mb-6">Visual Identity</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Brand Name</label>
                      <input
                        type="text"
                        value={settings.brandName || ''}
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#D4C4B5] transition-colors"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Payments Section */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CreditCard className="w-32 h-32 text-[#D4C4B5]" />
                  </div>

                  <h3 className="text-2xl font-serif italic text-white mb-2">Payment Architecture</h3>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-2xl mb-8">
                    Configure your payout settings. This platform uses Stripe Connect to automatically split payments:
                    <br />
                    <span className="text-[#D4C4B5] font-bold">90% to Seller</span> • <span className="text-gray-300">5% to Marketplace</span> • <span className="text-gray-300">5% to Platform</span>
                  </p>

                  <div className="flex items-center justify-between bg-black/20 p-6 border border-white/5 rounded-sm">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${settings.stripeAccountId ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold tracking-wide">
                          {settings.stripeAccountId ? 'Stripe Connected' : 'Stripe Not Connected'}
                        </p>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                          {settings.stripeAccountId ? `Account ID: ${settings.stripeAccountId}` : 'Accept payments & receives payouts'}
                        </p>
                      </div>
                    </div>

                    {!settings.stripeAccountId ? (
                      <button
                        onClick={async () => {
                          try {
                            const url = await connectStripe();
                            if (url) window.location.href = url;
                          } catch (e) {
                            alert("Failed to start onboarding: " + (e as any).message);
                          }
                        }}
                        className="bg-[#635BFF] hover:bg-[#5851E1] text-white px-6 py-3 uppercase tracking-widest text-[10px] font-bold transition-all flex items-center gap-2 rounded-sm shadow-lg shadow-[#635BFF]/20"
                      >
                        Connect with Stripe <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest bg-green-500/5 px-4 py-2 rounded-full border border-green-500/20">
                        <CheckCircle className="w-4 h-4" /> Active
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <button
                    onClick={handleReset}
                    className="text-red-400 hover:text-red-300 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Remaining tabs placeholders */}
        </div>
      </main >
    </div >
  );
};
