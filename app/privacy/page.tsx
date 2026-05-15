import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Cloudy Unicorn",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to Cloudy Unicorn. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. The Data We Collect</h2>
        <p>
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
          <li><strong>Usage Data</strong> includes information about how you use our website.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. How We Use Your Data</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To use data analytics to improve our website, products/services, marketing, customer relationships and experiences.</li>
          <li>To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance, support, reporting and hosting of data).</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Affiliate Links and Cookies</h2>
        <p>
          Cloudy Unicorn participates in various affiliate marketing programs, which means we may get paid commissions on editorially chosen products purchased through our links to retailer sites. Our affiliate networks and partners may use cookies to track these sales.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Third-Party Links</h2>
        <p>
          This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:cloudyunicorn90@gmail.com" className="text-blue-500 hover:underline">cloudyunicorn90@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
