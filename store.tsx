
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Product, BlogPost, Booking, Testimonial, SiteSettings, Project, PricingPlan } from './types';
import { INITIAL_STATE } from './constants';


interface ProjectBrief {
  id: string;
  title: string;
  description: string;
  status: 'In Queue' | 'Design' | 'Review' | 'Complete';
  priority: boolean;
  submittedAt: string;
}

interface StoreContextType extends AppState {
  isLoading: boolean;
  userPlan: string | null;
  projectBriefs: ProjectBrief[];
  updateSettings: (settings: SiteSettings) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addBooking: (booking: Booking) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  addPost: (post: BlogPost) => Promise<void>;
  updatePost: (post: BlogPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  connectStripe: () => Promise<string>;
  checkout: (args: { productId: any; price: number; name: string; stripeAccountId: string }) => Promise<string>;
  setAdminStatus: (status: boolean) => void;
  setSelectedPlan: (planId: string | null) => void;
  submitBrief: (brief: Omit<ProjectBrief, 'id' | 'status' | 'submittedAt'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

import { api } from "./convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPlan, setUserPlan] = useState<string | null>(() => localStorage.getItem('atelier_user_plan'));
  const [projectBriefs, setProjectBriefs] = useState<ProjectBrief[]>(() => {
    const saved = localStorage.getItem('atelier_project_briefs');
    return saved ? JSON.parse(saved) : [];
  });

  // Convex Data
  const convexProducts = useQuery(api.products.get) || [];
  const convexPosts = useQuery(api.posts.get) || [];
  const convexProjects = useQuery(api.projects.get) || [];

  // Mapped Products (Convex _id to string id)
  const products: Product[] = convexProducts.map((p: any) => ({ ...p, id: p._id }));
  const posts: BlogPost[] = convexPosts.map((p: any) => ({ ...p, id: p._id }));
  const projects: Project[] = convexProjects.map((p: any) => ({ ...p, id: p._id }));

  // Local state for other items (implementing real backend for these is next step)
  const [state, setState] = useState<AppState>(() => {
    const savedSettings = localStorage.getItem('atelier_settings');
    return {
      ...INITIAL_STATE,
      settings: savedSettings ? JSON.parse(savedSettings) : INITIAL_STATE.settings
    };
  });

  // Sync Products to State for compatibility
  // In a real refactor, we'd use 'products' directly, but here we merge.
  const combinedState = {
    ...state,
    products: products.length > 0 ? products : state.products, // Prefer Convex data
    posts: posts.length > 0 ? posts : state.posts,
    projects: projects.length > 0 ? projects : state.projects,
  };

  const addProductMutation = useMutation(api.products.add);
  const updateProductMutation = useMutation(api.products.update);
  const deleteProductMutation = useMutation(api.products.remove);

  const addPostMutation = useMutation(api.posts.add);
  const updatePostMutation = useMutation(api.posts.update);
  const deletePostMutation = useMutation(api.posts.remove);

  const addProjectMutation = useMutation(api.projects.add);
  const updateProjectMutation = useMutation(api.projects.update);
  const deleteProjectMutation = useMutation(api.projects.remove);

  useEffect(() => {
    localStorage.setItem('atelier_project_briefs', JSON.stringify(projectBriefs));
    if (userPlan) localStorage.setItem('atelier_user_plan', userPlan);
    localStorage.setItem('atelier_settings', JSON.stringify(state.settings));
  }, [projectBriefs, userPlan, state.settings]);

  const updateSettings = async (settings: SiteSettings) => {
    setState(prev => ({ ...prev, settings }));
  };

  const addProduct = async (product: Product) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = product;
    await addProductMutation(rest);
  };

  const updateProduct = async (product: Product) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = product;

    // Remove system fields that shouldn't be sent to the mutation
    // @ts-ignore
    const { _id, _creationTime, ...cleanProduct } = rest;

    // We need the ID to be an Id<"products">, which it is if it came from the DB
    await updateProductMutation({ id: id as any, ...cleanProduct });
  };

  const deleteProduct = async (id: string) => {
    await deleteProductMutation({ id: id as any });
  };

  const addBooking = async (booking: Booking) => {
    setState(prev => ({ ...prev, bookings: [booking, ...prev.bookings] }));
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    setState(prev => ({ ...prev, bookings: prev.bookings.map(b => b.id === id ? { ...b, status } : b) }));
  };

  const addPost = async (post: BlogPost) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = post;
    await addPostMutation(rest);
  };

  const updatePost = async (post: BlogPost) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = post;
    // @ts-ignore
    const { _id, _creationTime, ...cleanPost } = rest;
    await updatePostMutation({ id: id as any, ...cleanPost });
  };

  const deletePost = async (id: string) => {
    await deletePostMutation({ id: id as any });
  };

  const addProject = async (project: Project) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = project;
    await addProjectMutation(rest);
  };

  const deleteProject = async (id: string) => {
    await deleteProjectMutation({ id: id as any });
  };

  const updateProject = async (project: Project) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = project;
    // @ts-ignore
    const { _id, _creationTime, ...cleanProject } = rest;
    await updateProjectMutation({ id: id as any, ...cleanProject });
  };

  const connectStripe = useAction(api.payments.createStripeConnectAccount);
  const checkout = useAction(api.payments.createCheckoutSession);

  const setAdminStatus = (status: boolean) => setState(prev => ({ ...prev, isAdmin: status }));
  const setSelectedPlan = (planId: string | null) => setUserPlan(planId);

  const submitBrief = (brief: Omit<ProjectBrief, 'id' | 'status' | 'submittedAt'>) => {
    const newBrief: ProjectBrief = {
      ...brief,
      id: Math.random().toString(36).substr(2, 9),
      status: 'In Queue',
      submittedAt: new Date().toISOString()
    };
    setProjectBriefs(prev => [newBrief, ...prev]);
  };

  return (
    <StoreContext.Provider value={{
      ...combinedState,
      isLoading: convexProducts === undefined, // Simple loading state
      userPlan,
      projectBriefs,
      updateSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      addProject,
      deleteProject,
      addBooking,
      updateBookingStatus,
      addPost,
      updatePost,
      deletePost,
      updateProject,
      connectStripe: async () => { const res = await connectStripe(); return res.url; },
      checkout: async (args) => { const res = await checkout(args); return res.url; },
      setAdminStatus,
      setSelectedPlan,
      submitBrief
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
