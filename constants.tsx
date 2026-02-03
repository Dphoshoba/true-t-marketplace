
import { AppState, Product, BlogPost, Testimonial, Project, PricingPlan, TeamMember, Service } from './types';
import silverBangleImg from './assets/products/silver-bangle-set.png';
import turquoiseRingImg from './assets/products/turquoise-oval-ring.png';
import jasperRingImg from './assets/products/jasper-shield-ring.png';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Orbit Silver Bangle Set',
    price: 85,
    category: 'Jewellery',
    description: 'A set of three heavy-gauge sterling silver bangles, hand-hammered for a unique celestial texture. Features subtle star-stamp detailing.',
    image: silverBangleImg,
    status: 'published',
    seo: { title: 'Silver Bangles', description: 'Handmade silver bangle set.', slug: 'orbit-silver-bangles' }
  },
  {
    id: '2',
    name: 'Earth & Sky Turquoise Oval',
    price: 145,
    category: 'Jewellery',
    description: 'Genuine Royston turquoise with a rich brown matrix, set in a custom scalloped sterling silver bezel. Size 7.',
    image: turquoiseRingImg,
    status: 'published',
    seo: { title: 'Turquoise Ring', description: 'Handmade turquoise jewelry.', slug: 'earth-sky-turquoise' }
  },
  {
    id: '3',
    name: 'Zebra Monolith Shield Ring',
    price: 165,
    category: 'Jewellery',
    description: 'A striking vertical Jasper stone with natural black and white banding. Set on a wide, comfortable distressed silver band.',
    image: jasperRingImg,
    status: 'published',
    seo: { title: 'Jasper Ring', description: 'Bold statement stone ring.', slug: 'zebra-monolith' }
  },
  {
    id: '4',
    name: 'Sacred Heart Turquoise Pendant',
    price: 195,
    category: 'Jewellery',
    description: 'An intricate heart-shaped turquoise stone encased in a blackened silver frame with hand-balled copper accents. Includes an oxidized sterling chain.',
    image: 'https://images.unsplash.com/photo-1535633302703-b0703af78518?auto=format&fit=crop&q=80&w=800',
    status: 'published',
    seo: { title: 'Heart Pendant', description: 'Artisan heart jewelry.', slug: 'sacred-heart-pendant' }
  },
  {
    id: '5',
    name: 'Tethered Spirits Necklace Duo',
    price: 240,
    category: 'Jewellery',
    description: 'A curated pairing of two handcrafted pendants: one geometric silver cross and one organic oval stone. Designed for layered wear.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    status: 'published',
    seo: { title: 'Pendant Duo', description: 'Layered handmade necklaces.', slug: 'tethered-spirits' }
  },
  {
    id: '6',
    name: 'Desert Teardrop Turquoise',
    price: 130,
    category: 'Jewellery',
    description: 'A high-grade teardrop turquoise with deep black webbing. The bezel features a rope-twist border for a classic Southwestern finish.',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800',
    status: 'published',
    seo: { title: 'Teardrop Ring', description: 'Classic turquoise teardrop ring.', slug: 'desert-teardrop' }
  }
];

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Human Cost of AI in Art',
    excerpt: 'Why True T Marketplace bans AI-generated work to protect creator value.',
    content: 'Long form content about the philosophy of craftsmanship...',
    author: 'True T Team',
    date: '2024-05-15',
    category: 'Philosophy',
    readingTime: '5 min',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    seo: { title: 'Human Art Only', description: 'Ethics of art.', slug: 'human-art' }
  },
  {
    id: '2',
    title: 'New Drop: The Sterling & Stone Series',
    excerpt: 'Exploring the latest collection of hand-forged jewelry from the studio.',
    content: 'A deep dive into the Royston turquoise used in this months release...',
    author: 'Tanya',
    date: '2024-05-20',
    category: 'Process',
    readingTime: '4 min',
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    seo: { title: 'Jewellery Release', description: 'Behind the scenes of the new drop.', slug: 'jewelry-drop' }
  }
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'The Woodworker Series',
    client: 'Featured Seller',
    category: 'Woodwork',
    year: '2024',
    description: 'A documentary series on the makers behind our woodwork collection.',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200',
    challenge: 'Highlighting the manual effort behind the $5 fee.',
    outcome: 'Increased seller visibility by 40%.'
  }
];

const INITIAL_PLANS: PricingPlan[] = [
  {
    id: '1',
    name: 'The Maker',
    price: '5',
    interval: 'month',
    features: ['Flat $5 Fee per Sale', 'Handmade Guarantee', 'Basic Storefront', 'Global Shipping Support']
  },
  {
    id: '2',
    name: 'The Collective',
    price: '25',
    interval: 'month',
    features: ['Unlimited Listings', 'Featured Homepage Spot', 'Custom Domain Support', 'Advanced Analytics'],
    isPopular: true
  }
];

const INITIAL_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Marcus K.',
    role: 'Marketplace Architect',
    bio: 'Dedicated to ensuring fair fees and human-first commerce.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
  }
];

const INITIAL_SERVICES: Service[] = [
  { id: '1', title: 'Curation', description: 'We manually review every product for handmade authenticity.', icon: 'Check' },
  { id: '2', title: 'Fair Fee Structure', description: 'Only $5 per sale goes to True T. The rest is yours.', icon: 'DollarSign' }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'James L.',
    role: 'Woodworker',
    content: 'True T is the only platform that respects the labor hours I put into my work.',
    rating: 5
  }
];

export const INITIAL_STATE: AppState = {
  products: INITIAL_PRODUCTS,
  posts: INITIAL_POSTS,
  projects: INITIAL_PROJECTS,
  plans: INITIAL_PLANS,
  team: INITIAL_TEAM,
  services: INITIAL_SERVICES,
  bookings: [],
  testimonials: INITIAL_TESTIMONIALS,
  settings: {
    brandName: 'True T Marketplace',
    primaryColor: '#273134',
    fontFamily: 'Cormorant Garamond',
    logoUrl: 'https://i.imgur.com/your-t-hallmark-proxy.png',
    socialLinks: {
      instagram: 'https://instagram.com/truetmarketplace',
      pinterest: 'https://pinterest.com/truetmarketplace',
      facebook: 'https://facebook.com/truetmarketplace',
      linkedin: 'https://linkedin.com/company/truetmarketplace'
    }
  },
  isAdmin: false
};
