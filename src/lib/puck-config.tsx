import { Config } from "@measured/puck";
import React from "react";
import { 
  AnnouncementBarSection, 
  HeroSection, 
  FeaturesGridSection, 
  UrgencyTimerSection, 
  CodCheckoutSection, 
  ReviewsSection, 
  VideoShowcaseSection, 
  FaqSection, 
  WhatsAppBarSection,
  ProductGridSection,
  TrustBadgesSection,
  StickyBuyBarSection
} from "@/components/builder/Sections";

export type Props = {
  AnnouncementBar: { text: string; bgColor: string };
  HeroBanner: { headline: string; subheadline: string; ctaText: string; badgeText: string };
  FeaturesGrid: { title?: string };
  UrgencyTimer: { title: string; stockRemaining: number };
  CodCheckout: { productId: string; productTitle: string; price: number; comparePrice: number; packDuoDiscount: number; packTrioDiscount: number };
  Testimonials: { title: string; subtitle: string; reviewsSummary: string };
  VideoShowcase: { title: string; subtitle: string; badgeText: string; thumbnailUrl: string };
  Faq: { title?: string };
  WhatsAppBar: { phone: string; message: string; buttonText: string };
  ProductGrid: { title: string; category: string; selectedProducts?: string[] };
  TrustBadges: { title: string; align: 'left' | 'center' };
  StickyBuyBar: { productId: string; buttonText: string; price: number };
};

// We create a mock theme config to pass to the components for preview if none is provided
export const defaultThemeConfig = {
  primaryColor: '#09090b',
  accentColor: '#c59b27',
  bgPage: '#ffffff',
  buttonRadius: 'rounded',
  fontFamily: 'sans'
};

export const normalizeThemeConfig = (config: any) => {
  if (!config) return defaultThemeConfig;
  
  // If it's a THEMES object (from useTheme)
  if (config.colors) {
    return {
      ...defaultThemeConfig,
      primaryColor: config.colors.primary || defaultThemeConfig.primaryColor,
      accentColor: config.colors.accent || defaultThemeConfig.accentColor,
      bgPage: config.colors.bgPage || defaultThemeConfig.bgPage,
    };
  }
  
  // If it's already a flat DB config or fallback
  return {
    ...defaultThemeConfig,
    ...config
  };
};

export const getPuckConfig = (rawConfig: any = defaultThemeConfig, initialProducts: any[] = []): Config<Props, any> => {
  const themeConfig = normalizeThemeConfig(rawConfig);
  
  const productOptions = initialProducts.map((p: any) => ({
    label: p.title || 'Untitled Product',
    value: p.id
  }));
  productOptions.unshift({ label: 'Select a product...', value: '' });
  
  return {
    root: {
      render: ({ children }) => {
        const fontClass = themeConfig.fontFamily === 'serif' ? 'font-serif' : themeConfig.fontFamily === 'monospace' ? 'font-mono' : 'font-sans';
        return (
          <div 
            style={{ 
              backgroundColor: themeConfig.bgPage, 
              color: themeConfig.textPrimary || '#111827', 
              minHeight: "100vh",
              // Inject CSS variables for deep theming support
              '--theme-primary': themeConfig.primaryColor,
              '--theme-accent': themeConfig.accentColor,
            } as React.CSSProperties}
            className={fontClass}
          >
            {children}
          </div>
        );
      }
    },
    components: {
      AnnouncementBar: {
        fields: {
          text: { type: "text" },
          bgColor: { type: "text" }
        },
        defaultProps: {
          text: "Free Fast Delivery over 400 MAD • Cash on Delivery",
          bgColor: ""
        },
        render: ({ text, bgColor }) => (
          <AnnouncementBarSection settings={{ text, bgColor }} themeConfig={themeConfig} />
        )
      },
      HeroBanner: {
        fields: {
          badgeText: { type: "text" },
          headline: { type: "text" },
          subheadline: { type: "textarea" },
          ctaText: { type: "text" }
        },
        defaultProps: {
          headline: "New Exceptional Offer",
          subheadline: "Enjoy our exclusive discount today with cash on delivery.",
          ctaText: "Order Now",
          badgeText: "Special Offer"
        },
        render: (props) => (
          <HeroSection settings={props} themeConfig={themeConfig} />
        )
      },
      FeaturesGrid: {
        fields: {},
        defaultProps: {},
        render: (props) => (
          <FeaturesGridSection settings={props} themeConfig={themeConfig} />
        )
      },
      UrgencyTimer: {
        fields: {
          title: { type: "text" },
          stockRemaining: { type: "number" }
        },
        defaultProps: {
          title: "Limited Flash Sale",
          stockRemaining: 12
        },
        render: (props) => (
          <UrgencyTimerSection settings={props} themeConfig={themeConfig} />
        )
      },
      TrustBadges: {
        fields: {
          title: { type: "text" },
          align: { 
            type: "radio", 
            options: [
              { label: "Center", value: "center" },
              { label: "Left", value: "left" }
            ] 
          }
        },
        defaultProps: {
          title: "Guaranteed Satisfaction",
          align: "center"
        },
        render: (props) => (
          <TrustBadgesSection settings={props} themeConfig={themeConfig} />
        )
      },
      CodCheckout: {
        fields: {
          productId: { 
            type: "select", 
            options: productOptions 
          },
          productTitle: { type: "text" },
          price: { type: "number" },
          comparePrice: { type: "number" },
          packDuoDiscount: { type: "number" },
          packTrioDiscount: { type: "number" }
        },
        defaultProps: {
          productId: "",
          productTitle: "Featured Item - Special Edition",
          price: 349,
          comparePrice: 590,
          packDuoDiscount: 100,
          packTrioDiscount: 200
        },
        render: (props) => (
          <CodCheckoutSection settings={props} themeConfig={themeConfig} products={initialProducts} />
        )
      },
      StickyBuyBar: {
        fields: {
          productId: { 
            type: "select", 
            options: productOptions 
          },
          buttonText: { type: "text" },
          price: { type: "number" }
        },
        defaultProps: {
          productId: "",
          buttonText: "Commander Maintenant",
          price: 349
        },
        render: (props) => (
          <StickyBuyBarSection settings={props} themeConfig={themeConfig} products={initialProducts} />
        )
      },
      VideoShowcase: {
        fields: {
          badgeText: { type: "text" },
          title: { type: "text" },
          subtitle: { type: "text" },
          thumbnailUrl: { type: "text" }
        },
        defaultProps: {
          title: "Discover the Product in Action",
          subtitle: "Watch the real demonstration before ordering.",
          badgeText: "Video Demonstration",
          thumbnailUrl: ""
        },
        render: (props) => (
          <VideoShowcaseSection settings={props} themeConfig={themeConfig} />
        )
      },
      Testimonials: {
        fields: {
          reviewsSummary: { type: "text" },
          title: { type: "text" },
          subtitle: { type: "text" }
        },
        defaultProps: {
          title: "What Our Customers Across Morocco Say",
          subtitle: "Verified reviews after inspection and cash on delivery.",
          reviewsSummary: "Verified reviews after receipt"
        },
        render: (props) => (
          <ReviewsSection settings={props} themeConfig={themeConfig} />
        )
      },
      Faq: {
        fields: {},
        defaultProps: {},
        render: (props) => (
          <FaqSection settings={props} themeConfig={themeConfig} />
        )
      },
      ProductGrid: {
        fields: {
          title: { type: "text" },
          category: { type: "text" },
        },
        defaultProps: {
          title: "Our Products",
          category: "",
          selectedProducts: []
        },
        render: (props) => (
          <ProductGridSection settings={props} themeConfig={themeConfig} products={initialProducts} />
        )
      },
      WhatsAppBar: {
        fields: {
          phone: { type: "text" },
          message: { type: "textarea" },
          buttonText: { type: "text" }
        },
        defaultProps: {
          phone: "+212661000000",
          message: "Salam, I want to ask about this item and order",
          buttonText: "Order via WhatsApp"
        },
        render: (props) => (
          <WhatsAppBarSection settings={props} themeConfig={themeConfig} />
        )
      }
    }
  };
};

export const puckConfig = getPuckConfig(defaultThemeConfig, []);
