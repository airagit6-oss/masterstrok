import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Mail } from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-6 pt-24 pb-16" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-mp-success/10">
            <CheckCircle className="h-10 w-10 text-mp-success" />
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground">Payment Successful!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your purchase is complete. You now have full access to your products.
          </p>

          <div className="mt-6 rounded-xl border border-border bg-card p-5 text-left space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-medium text-foreground">Confirmation email sent</p>
                <p className="text-[10px] text-muted-foreground">Check your inbox for receipt and access details</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Download className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-medium text-foreground">Instant access granted</p>
                <p className="text-[10px] text-muted-foreground">Your apps are ready to use from your dashboard</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              to="/"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              Browse More Apps
            </Link>
          </div>

          <p className="mt-6 text-[10px] text-muted-foreground">
            Order #SH-{Math.random().toString(36).substring(2, 10).toUpperCase()} · {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
