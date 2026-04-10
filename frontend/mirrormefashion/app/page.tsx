// app/page.tsx (server component)
import React from "react";
import HomeClient from "@/components/HomeClient";

import { products } from "@/data/products";

export const metadata = {
  title: "Mirror Me Fashion — AI styling & body modeler",
  description:
    "Mirror Me Fashion — personalized styling assistant, professional & retailer tools, and an AI body modeler for tailored fits.",
  keywords: ["Mirror Me", "fashion", "styling", "body modeler", "AI", "retail"],
  openGraph: {
    title: "Mirror Me Fashion",
    description:
      "AI-powered styling assistant and body modeler — personalized fits and recommendations.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mirror Me Fashion",
  url: "https://your-domain.example",
  description:
    "Mirror Me Fashion — personalized styling assistant and AI body modeler to help shoppers, stylists and retailers.",
};

export default function Page() {
  return (
    <>
      {/* JSON-LD for crawlers (server component so it's static) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        {/* Pass the products as a serializable prop to the client component */}
        <HomeClient products={products} />
      </main>
    </>
  );
}
