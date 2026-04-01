import { Link } from 'react-router-dom';
import { Headset, Mail, MessageSquare, BookOpen } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { q: 'How do I access my purchased apps?', a: 'Go to Dashboard → My Apps and click on any app to launch it.' },
  { q: 'Can I cancel my subscription?', a: 'Yes, go to Dashboard → Subscription and click Cancel. You retain access until the billing period ends.' },
  { q: 'Is there a free trial?', a: 'Yes, all plans come with a 14-day free trial. No credit card required.' },
  { q: 'How does the reseller program work?', a: 'Apply at /reseller-apply, get your referral link, and earn 30% commission on every sale.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, PayPal, and UPI.' },
];

const SupportPage = () => {
  const [open, setOpen] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const inputClass = 'w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-foreground">SaaSHub</Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Home</Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">Support Center</h1>
          <p className="text-lg text-muted-foreground">We're here to help. Browse FAQs or send us a message.</p>
        </div>

        {/* Contact options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Mail, title: 'Email Support', desc: 'support@saashub.io', action: 'mailto:support@saashub.io' },
            { icon: MessageSquare, title: 'Live Chat', desc: 'Available 9am–6pm IST', action: '#' },
            { icon: BookOpen, title: 'Documentation', desc: 'Browse our docs', action: '#' },
          ].map(c => (
            <a key={c.title} href={c.action}
              className="rounded-xl border border-border bg-card p-5 flex flex-col items-center text-center hover:bg-accent transition-colors">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <c.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
            </a>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent transition-colors"
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <span className="text-muted-foreground ml-4 shrink-0">{open === i ? '−' : '+'}</span>
                </button>
                {open === i && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground border-t border-border pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Send Us a Message</h2>
          {sent ? (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-8 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="font-semibold text-foreground">Message sent!</p>
              <p className="text-sm text-muted-foreground mt-1">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                <input type="text" required placeholder="Your name" className={inputClass}
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input type="email" required placeholder="email@domain.com" className={inputClass}
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                <textarea rows={4} required placeholder="How can we help?" className={`${inputClass} resize-none`}
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <button type="submit"
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
