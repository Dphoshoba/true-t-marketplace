
export interface SeoData {
  title: string;
  description: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  status: 'published' | 'draft';
  seo: SeoData;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  readingTime: string;
  status: 'published' | 'draft';
  seo: SeoData;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  image: string;
  challenge: string;
  outcome: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  service: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed';
  message: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface SiteSettings {
  brandName: string;
  primaryColor: string;
  fontFamily: string;
  logoUrl: string;
  socialLinks: {
    instagram: string;
    pinterest: string;
    facebook: string;
    linkedin: string;
  };
}

export interface AppState {
  products: Product[];
  posts: BlogPost[];
  projects: Project[];
  plans: PricingPlan[];
  team: TeamMember[];
  services: Service[];
  bookings: Booking[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  isAdmin: boolean;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }

  interface ImportMeta {
    readonly env: {
      readonly [key: string]: any;
      readonly VITE_GEMINI_API_KEY: string;
      readonly VITE_CONVEX_URL: string;
    };
  }
}
