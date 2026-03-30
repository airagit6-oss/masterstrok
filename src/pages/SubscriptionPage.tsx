import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, Rocket, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';

const plans = [
  {
    name: 'Basic',
    icon: Zap,
    monthly: 29,
    yearly: 290,
    description: 'Perfect for individuals and small teams getting started.',
    features: [
      'Access to 5 apps',
      '1 user seat',
      'Basic analytics',
      'Email support',
      'Community access',
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    icon: Crown,
    monthly: 79,
    yearly: 790,
    description: 'For growing teams that need full power and priority support.',
    features: [
      'Access to all apps',
      '10 user seats',
      'Advanced analytics & reports',
      'Priority support (24h)',
      'API access',
      'Custom branding',
      'Team management',
    ],
    highlight: true,
  },
  {
    name: 'Unlimited',
    icon: Rocket,
    monthly: 149,
    yearly: 1490,
    description: 'Enterprise-grade with unlimited everything and dedicated support.',
    features: [
      'Access to all apps',
      'Unlimited user seats',
      'Real-time analytics',
      'Dedicated account manager',
      'White-label solution',
      'Custom integrations',
      'SLA guarantee (99.9%)',
      'On-premise deployment option',
    ],
    highlight: false,
  },
];

const SubscriptionPage = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const navigate = useNavigate();

  const handleSubscribe = (planName: string) => {
    navigate(`/subscribe-checkout?plan=${planName.toLowerCase()}&billing=${billing}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-[1100px] px-6 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Choose Your Plan</h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            Unlock the full power of our SaaS marketplace. Cancel or change anytime.
          </p>

          {/* Billing Toggle */}
          <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-colors ${billing === 'monthly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-colors ${billing === 'yearly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Yearly <span className="text-[10px] opacity-80">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map(plan => {
            const price = billing === 'monthly' ? plan.monthly : plan.yearly;
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 transition-all ${
                  plan.highlight
                    ? 'border-primary bg-card shadow-lg shadow-primary/5 scale-[1.02]'
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-bold text-primary-foreground uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${plan.highlight ? 'bg-primary/15' : 'bg-secondary'}`}>
                    <Icon className={`h-5 w-5 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                  </div>
                </div>

                <div className="mb-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-foreground">${price}</span>
                  <span className="text-sm text-muted-foreground">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">{plan.description}</p>

                <button
                  onClick={() => handleSubscribe(plan.name)}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border text-foreground hover:bg-accent'
                  }`}
                >
                  Subscribe <ArrowRight className="h-4 w-4" />
                </button>

                <ul className="mt-6 space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-primary' : 'text-mp-success'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <p className="text-xs text-muted-foreground">
            All plans include a 14-day free trial · No credit card required to start · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
