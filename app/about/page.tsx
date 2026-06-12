import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Cloudy Unicorn's mission to simplify SaaS discovery. Discover how our AI-powered, data-driven comparison platform helps you find the right tools.",
  alternates: {
    canonical: "https://www.cloudyunicorn.com/about",
  },
  openGraph: {
    title: "About Us | Cloudy Unicorn",
    description: "Learn about Cloudy Unicorn's mission to simplify SaaS discovery. Discover how our AI-powered, data-driven comparison platform helps you find the right tools.",
    url: "https://www.cloudyunicorn.com/about",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "About Cloudy Unicorn",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
      <h1 className="text-4xl font-bold tracking-tight text-ink mb-8">About Cloudy Unicorn</h1>
      
      <div className="prose max-w-none text-charcoal space-y-6">
        <p className="text-xl text-ink font-medium leading-relaxed">
          Cloudy Unicorn is an AI-powered SaaS comparison platform designed to help teams find the perfect tools.
        </p>

        <h2 className="text-2xl font-semibold text-ink mt-12 mb-4">Our Mission</h2>
        <p className="leading-relaxed">
          The B2B software landscape is overwhelming. With thousands of tools across hundreds of categories, 
          finding the right software for your team often means spending hours reading biased reviews, 
          deciphering complex pricing pages, and scheduling unnecessary sales calls.
        </p>
        <p className="leading-relaxed">
          We built Cloudy Unicorn to change that. Our mission is to provide transparent, data-driven, 
          and AI-powered insights to simplify the software discovery process. We analyze features, 
          pricing, and real-world performance so you can make informed decisions quickly.
        </p>

        <h2 className="text-2xl font-semibold text-ink mt-12 mb-4">How We Work</h2>
        <p className="leading-relaxed">
          We leverage advanced AI models and automated data extraction pipelines to continuously monitor 
          the SaaS ecosystem. This allows us to provide up-to-date, side-by-side comparisons of the most 
          popular tools in project management, developer tools, AI, design, and analytics.
        </p>

        <h2 className="text-2xl font-semibold text-ink mt-12 mb-4">Why &quot;Cloudy Unicorn&quot;?</h2>
        <p className="leading-relaxed">
          In the tech world, a &quot;Unicorn&quot; is a startup valued at over $1 billion. We believe that with 
          the right cloud-based tools, any team can achieve unicorn-level productivity and scale. 
          We're here to help you navigate the &quot;clouds&quot; of software options to find your perfect match.
        </p>

        <div className="bg-surface border border-hairline rounded-lg p-6 mt-12">
          <h3 className="text-lg font-semibold text-ink mb-2">Transparency Note</h3>
          <p className="text-sm text-slate leading-relaxed">
            To keep our platform free, we use affiliate links. This means we may earn a commission if you 
            click a link and make a purchase. However, this never influences our comparisons or reviews. 
            Our AI pipelines evaluate tools based strictly on their features, pricing, and capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}
