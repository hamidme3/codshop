"use client";

import { Puck, Button } from "@measured/puck";
import "@measured/puck/puck.css";
import { getPuckConfig, defaultThemeConfig } from "@/lib/puck-config";
import { useState, useEffect } from "react";
import { ArrowDownToLine } from "lucide-react";

export function PuckEditor({ initialData, storeSlug }: { initialData: any, storeSlug: string }) {
  const [themeConfig, setThemeConfig] = useState(defaultThemeConfig);
  const [puckData, setPuckData] = useState(initialData);

  useEffect(() => {
    fetch(`/api/stores/${storeSlug}/theme`)
      .then(res => res.json())
      .then(data => {
        if (data.themeConfig) {
          setThemeConfig(data.themeConfig);
        }
      })
      .catch(console.error);
  }, [storeSlug]);

  const handlePublish = async (data: any) => {
    try {
      const response = await fetch(`/api/stores/${storeSlug}/puck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        alert("Storefront layout published successfully!");
      } else {
        alert("Error publishing layout.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const loadThemeTemplate = () => {
    if (confirm("This will replace your current layout with the default template for your active theme. Are you sure?")) {
      const themeTemplate = {
        content: [
          { type: "AnnouncementBar", props: { id: "ann-1", text: "Free Fast Delivery over 400 MAD", bgColor: themeConfig.accentColor || "#c59b27" } },
          { type: "HeroBanner", props: { id: "hero-1", headline: "Welcome to our store", subheadline: "Check out our best offers", ctaText: "Shop Now", badgeText: "New" } },
          { type: "FeaturesGrid", props: { id: "feat-1" } },
          { type: "ProductGrid", props: { id: "prod-1", title: "Trending Products", category: "" } },
          { type: "Testimonials", props: { id: "test-1", title: "Customer Reviews", subtitle: "What they say about us", reviewsSummary: "Verified" } },
          { type: "WhatsAppBar", props: { id: "wa-1", phone: "+212600000000", message: "Hello", buttonText: "Order via WhatsApp" } }
        ],
        root: {},
        zones: {}
      };
      setPuckData(themeTemplate);
    }
  };

  const config = getPuckConfig(themeConfig);

  return (
    <div className="h-full flex flex-col">
      <Puck headerTitle="Storefront Builder" headerPath="#" 
        key={JSON.stringify(puckData)} 
        config={config} 
        data={puckData} 
        onPublish={handlePublish}
        overrides={{
          headerActions: ({ children }) => (
            <div className="flex items-center gap-4">
              <button 
                onClick={loadThemeTemplate}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-black transition-colors"
                title="Load default layout for your active theme"
              >
                <ArrowDownToLine className="w-4 h-4" />
                Load Theme Template
              </button>
              {children}
            </div>
          )
        }}
      />
    </div>
  );
}
