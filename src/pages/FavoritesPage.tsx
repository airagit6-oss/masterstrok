import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
      <div className="flex flex-col items-center py-24 text-center">
        <Heart className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="text-lg font-medium text-foreground">No favorites yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Save apps you love by clicking the heart icon</p>
        <Link to="/" className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Browse Apps
        </Link>
      </div>
    </div>
  );
};

export default FavoritesPage;
