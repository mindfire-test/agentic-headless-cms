import { create } from 'zustand';

// ─── Type Definitions ───

export interface HeroSettings {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  backgroundColor: string;
  textColor: string;
  titleColor: string;
  subtitleColor: string;
  buttonColor: string;
  buttonTextColor: string;
  showButton: boolean;
  alignment: 'left' | 'center' | 'right';
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeatureGridSettings {
  title: string;
  subtitle: string;
  columns: 2 | 3 | 4;
  features: FeatureItem[];
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  cardBackgroundColor: string;
  cardBorderColor: string;
  cardBorderRadius: number;
  showIcons: boolean;
  iconColor: string;
}

export interface CtaBannerSettings {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  alignment: 'left' | 'center' | 'right';
  showButton: boolean;
}

export interface TestimonialSettings {
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  authorImageUrl: string;
  rating: 1 | 2 | 3 | 4 | 5;
  backgroundColor: string;
  quoteColor: string;
  authorColor: string;
  roleColor: string;
  showRating: boolean;
  starColor: string;
  borderRadius: number;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
}

export interface PricingTableSettings {
  title: string;
  subtitle: string;
  plans: PricingPlan[];
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  highlightedPlanColor: string;
  buttonColor: string;
  buttonTextColor: string;
  cardBorderRadius: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionSettings {
  title: string;
  subtitle: string;
  items: FaqItem[];
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  questionColor: string;
  answerColor: string;
  borderColor: string;
  activeColor: string;
}

// ─── Default Values ───

export const HERO_DEFAULTS: HeroSettings = {
  title: 'Build Something Amazing',
  subtitle:
    'Create stunning pages with our drag-and-drop builder. No coding required.',
  buttonText: 'Get Started',
  buttonUrl: '#',
  backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  textColor: '#ffffff',
  titleColor: '#ffffff',
  subtitleColor: 'rgba(255,255,255,0.9)',
  buttonColor: '#ffffff',
  buttonTextColor: '#667eea',
  showButton: true,
  alignment: 'center',
};

export const FEATURE_GRID_DEFAULTS: FeatureGridSettings = {
  title: 'Powerful Features',
  subtitle: 'Everything you need to succeed',
  columns: 3,
  features: [
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance',
    },
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
      title: 'Secure',
      description: 'Enterprise-grade security built in',
    },
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
      title: 'Scalable',
      description: 'Grows with your business needs',
    },
  ],
  backgroundColor: '#ffffff',
  titleColor: '#1a202c',
  subtitleColor: '#718096',
  cardBackgroundColor: '#ffffff',
  cardBorderColor: '#e2e8f0',
  cardBorderRadius: 12,
  showIcons: true,
  iconColor: '#667eea',
};

export const CTA_BANNER_DEFAULTS: CtaBannerSettings = {
  title: 'Ready to Get Started?',
  subtitle: 'Join thousands of satisfied customers today',
  buttonText: 'Start Free Trial',
  buttonUrl: '#',
  backgroundColor: '#667eea',
  textColor: '#ffffff',
  buttonColor: '#ffffff',
  buttonTextColor: '#667eea',
  alignment: 'center',
  showButton: true,
};

export const TESTIMONIAL_DEFAULTS: TestimonialSettings = {
  quote: '"This product has transformed how we work. Highly recommended!"',
  authorName: 'John Doe',
  authorRole: 'CEO',
  authorCompany: 'Tech Corp',
  authorImageUrl: '',
  rating: 5,
  backgroundColor: '#f7fafc',
  quoteColor: '#2d3748',
  authorColor: '#1a202c',
  roleColor: '#718096',
  showRating: true,
  starColor: '#f6ad55',
  borderRadius: 16,
};

export const PRICING_TABLE_DEFAULTS: PricingTableSettings = {
  title: 'Simple, Transparent Pricing',
  subtitle: 'Choose the plan that fits your needs',
  plans: [
    {
      name: 'Basic',
      price: '$9',
      period: '/month',
      features: ['5 Pages', 'Basic Analytics', 'Email Support'],
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      features: [
        'Unlimited Pages',
        'Advanced Analytics',
        'Priority Support',
        'Custom Domains',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      features: [
        'Everything in Pro',
        'Dedicated Account Manager',
        'Custom Integrations',
        'SLA',
      ],
      highlighted: false,
    },
  ],
  backgroundColor: '#ffffff',
  titleColor: '#1a202c',
  subtitleColor: '#718096',
  highlightedPlanColor: '#667eea',
  buttonColor: '#667eea',
  buttonTextColor: '#ffffff',
  cardBorderRadius: 12,
};

export const FAQ_DEFAULTS: FaqAccordionSettings = {
  title: 'Frequently Asked Questions',
  subtitle: 'Got questions? We have answers',
  items: [
    {
      question: 'How do I get started?',
      answer:
        'Simply sign up for an account and start building your pages with our intuitive drag-and-drop editor.',
    },
    {
      question: 'Can I use my own domain?',
      answer:
        'Yes! You can connect any custom domain to your pages on our Pro and Enterprise plans.',
    },
    {
      question: 'Is there a free trial?',
      answer:
        'Yes, we offer a 14-day free trial on all plans. No credit card required.',
    },
  ],
  backgroundColor: '#ffffff',
  titleColor: '#1a202c',
  subtitleColor: '#718096',
  questionColor: '#2d3748',
  answerColor: '#4a5568',
  borderColor: '#e2e8f0',
  activeColor: '#667eea',
};

// ─── Store Types ───

interface ComponentState {
  hero: Record<string, HeroSettings>;
  featureGrid: Record<string, FeatureGridSettings>;
  ctaBanner: Record<string, CtaBannerSettings>;
  testimonial: Record<string, TestimonialSettings>;
  pricingTable: Record<string, PricingTableSettings>;
  faq: Record<string, FaqAccordionSettings>;
}

interface ComponentActions {
  // Hero
  setHero: (id: string, patch: Partial<HeroSettings>) => void;
  clearHero: (id: string) => void;

  // Feature Grid
  setFeatureGrid: (id: string, patch: Partial<FeatureGridSettings>) => void;
  clearFeatureGrid: (id: string) => void;

  // CTA Banner
  setCtaBanner: (id: string, patch: Partial<CtaBannerSettings>) => void;
  clearCtaBanner: (id: string) => void;

  // Testimonial
  setTestimonial: (id: string, patch: Partial<TestimonialSettings>) => void;
  clearTestimonial: (id: string) => void;

  // Pricing Table
  setPricingTable: (id: string, patch: Partial<PricingTableSettings>) => void;
  clearPricingTable: (id: string) => void;

  // FAQ
  setFaq: (id: string, patch: Partial<FaqAccordionSettings>) => void;
  clearFaq: (id: string) => void;

  // Reset entirely
  resetStore: () => void;
}

export type PageBuilderStore = ComponentState & ComponentActions;

// ─── Store ───

export const usePageBuilderStore = create<PageBuilderStore>((set) => ({
  // Initial state
  hero: {},
  featureGrid: {},
  ctaBanner: {},
  testimonial: {},
  pricingTable: {},
  faq: {},

  // Reset Entire Store
  resetStore: () =>
    set({
      hero: {},
      featureGrid: {},
      ctaBanner: {},
      testimonial: {},
      pricingTable: {},
      faq: {},
    }),

  // Hero
  setHero: (id, patch) =>
    set((state) => ({
      hero: {
        ...state.hero,
        [id]: { ...(state.hero[id] ?? HERO_DEFAULTS), ...patch },
      },
    })),
  clearHero: (id) =>
    set((state) => {
      const hero = { ...state.hero };
      delete hero[id];
      return { hero };
    }),

  // Feature Grid
  setFeatureGrid: (id, patch) =>
    set((state) => ({
      featureGrid: {
        ...state.featureGrid,
        [id]: { ...(state.featureGrid[id] ?? FEATURE_GRID_DEFAULTS), ...patch },
      },
    })),
  clearFeatureGrid: (id) =>
    set((state) => {
      const featureGrid = { ...state.featureGrid };
      delete featureGrid[id];
      return { featureGrid };
    }),

  // CTA Banner
  setCtaBanner: (id, patch) =>
    set((state) => ({
      ctaBanner: {
        ...state.ctaBanner,
        [id]: { ...(state.ctaBanner[id] ?? CTA_BANNER_DEFAULTS), ...patch },
      },
    })),
  clearCtaBanner: (id) =>
    set((state) => {
      const ctaBanner = { ...state.ctaBanner };
      delete ctaBanner[id];
      return { ctaBanner };
    }),

  // Testimonial
  setTestimonial: (id, patch) =>
    set((state) => ({
      testimonial: {
        ...state.testimonial,
        [id]: { ...(state.testimonial[id] ?? TESTIMONIAL_DEFAULTS), ...patch },
      },
    })),
  clearTestimonial: (id) =>
    set((state) => {
      const testimonial = { ...state.testimonial };
      delete testimonial[id];
      return { testimonial };
    }),

  // Pricing Table
  setPricingTable: (id, patch) =>
    set((state) => ({
      pricingTable: {
        ...state.pricingTable,
        [id]: {
          ...(state.pricingTable[id] ?? PRICING_TABLE_DEFAULTS),
          ...patch,
        },
      },
    })),
  clearPricingTable: (id) =>
    set((state) => {
      const pricingTable = { ...state.pricingTable };
      delete pricingTable[id];
      return { pricingTable };
    }),

  // FAQ
  setFaq: (id, patch) =>
    set((state) => ({
      faq: {
        ...state.faq,
        [id]: { ...(state.faq[id] ?? FAQ_DEFAULTS), ...patch },
      },
    })),
  clearFaq: (id) =>
    set((state) => {
      const faq = { ...state.faq };
      delete faq[id];
      return { faq };
    }),
}));

// ─── Component Removal Cleanup ───

document.addEventListener('pb:component-removed', (e: Event) => {
  const { componentId } = (e as CustomEvent<{ componentId: string }>).detail;
  const store = usePageBuilderStore.getState();
  store.clearHero(componentId);
  store.clearFeatureGrid(componentId);
  store.clearCtaBanner(componentId);
  store.clearTestimonial(componentId);
  store.clearPricingTable(componentId);
  store.clearFaq(componentId);
});

// ─── Auto-save: trigger canvas state save on settings change ───

let _saveTimer: ReturnType<typeof setTimeout> | undefined;
usePageBuilderStore.subscribe(() => {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    window.dispatchEvent(new CustomEvent('table-design-change'));
  }, 150);
});
