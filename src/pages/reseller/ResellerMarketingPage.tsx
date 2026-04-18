import { ImageIcon, Link2, Mail, Copy } from 'lucide-react';

const ResellerMarketingPage = () => (
  <div>
    <h1 className="text-2xl font-bold mb-1" style={{ color: '#1a1a1a' }}>Marketing assets</h1>
    <p className="text-sm mb-6" style={{ color: '#6d7175' }}>Banners, email templates, and your referral link.</p>
    <div className="rounded-lg bg-white border p-5 mb-4" style={{ borderColor: '#e1e3e5' }}>
      <div className="flex items-center gap-2 mb-2">
        <Link2 className="h-4 w-4" style={{ color: '#008060' }} />
        <h2 className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>Your referral link</h2>
      </div>
      <div className="flex gap-2">
        <input
          readOnly
          value="https://saashub.app/?ref=partner-2847"
          className="flex-1 px-3 py-2 text-sm rounded border bg-gray-50"
          style={{ borderColor: '#e1e3e5', color: '#1a1a1a' }}
        />
        <button className="px-3 py-2 rounded text-sm font-medium text-white flex items-center gap-1.5" style={{ background: '#008060' }}>
          <Copy className="h-3.5 w-3.5" /> Copy
        </button>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[
        { icon: ImageIcon, name: 'Banner pack (12 sizes)', desc: 'PNG + JPG, 970×250 to 728×90' },
        { icon: Mail, name: 'Email templates', desc: '5 ready-to-use HTML templates' },
        { icon: ImageIcon, name: 'Social media kit', desc: 'Instagram, Twitter, LinkedIn' },
        { icon: Mail, name: 'Cold outreach scripts', desc: '8 proven sequences' },
      ].map(a => (
        <div key={a.name} className="rounded-lg bg-white border p-4 flex items-start justify-between" style={{ borderColor: '#e1e3e5' }}>
          <div className="flex gap-3">
            <a.icon className="h-8 w-8" style={{ color: '#008060' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{a.name}</p>
              <p className="text-xs" style={{ color: '#6d7175' }}>{a.desc}</p>
            </div>
          </div>
          <button className="text-xs font-medium" style={{ color: '#008060' }}>Download</button>
        </div>
      ))}
    </div>
  </div>
);
export default ResellerMarketingPage;
