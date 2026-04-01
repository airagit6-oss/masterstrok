import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const RecentPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Recently Viewed</h1>
      <div className="flex flex-col items-center py-24 text-center">
        <Clock className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="text-lg font-medium text-foreground">No recent activity</p>
        <p className="mt-1 text-sm text-muted-foreground">Products you view will appear here</p>
        <Link to="/" className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Explore Apps
        </Link>
      </div>
    </div>
  );
};

export default RecentPage;
