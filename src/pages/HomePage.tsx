import { useState } from 'react';
import { Navbar } from '@/components/marketplace/Navbar';
import { MarketplaceSidebar } from '@/components/marketplace/MarketplaceSidebar';
import { HeroBanner } from '@/components/marketplace/HeroBanner';
import { ProductRow } from '@/components/marketplace/ProductRow';
import { products, sections } from '@/lib/marketplaceData';

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <MarketplaceSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-56' : 'lg:pl-16'}`}>
        <HeroBanner />
        <div className="py-4">
          {sections.map(section => {
            const filtered = products.filter(section.filter);
            return (
              <ProductRow
                key={section.title}
                title={section.title}
                products={filtered}
              />
            );
          })}
        </div>

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="mx-auto max-w-[1440px] px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <h4 className="mb-3 font-display text-sm font-bold text-foreground">Platform</h4>
                <div className="space-y-2">
                  {['Browse Apps', 'Categories', 'Pricing', 'Enterprise'].map(l => (
                    <p key={l} className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">{l}</p>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-display text-sm font-bold text-foreground">Resources</h4>
                <div className="space-y-2">
                  {['Documentation', 'API Reference', 'Tutorials', 'Blog'].map(l => (
                    <p key={l} className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">{l}</p>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-display text-sm font-bold text-foreground">Company</h4>
                <div className="space-y-2">
                  {['About', 'Careers', 'Partners', 'Contact'].map(l => (
                    <p key={l} className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">{l}</p>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-display text-sm font-bold text-foreground">Legal</h4>
                <div className="space-y-2">
                  {['Privacy', 'Terms', 'Security', 'Compliance'].map(l => (
                    <p key={l} className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">{l}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-border pt-6 text-center">
              <p className="text-xs text-muted-foreground">© 2026 SaaSHub. All rights reserved. Ultra Premium Software Marketplace.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
