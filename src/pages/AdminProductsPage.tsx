import { Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, Package } from 'lucide-react';
import { products } from '@/lib/marketplaceData';

const AdminProductsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          + Add Product
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Users</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rating</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={p.thumbnail} alt={p.name} className="h-8 w-8 rounded object-cover" />
                    <span className="font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground capitalize">{p.category}</td>
                <td className="px-4 py-3 text-foreground">${p.price}</td>
                <td className="px-4 py-3 text-foreground">{p.users.toLocaleString()}</td>
                <td className="px-4 py-3 text-foreground">⭐ {p.rating}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    p.status === 'trending' ? 'bg-primary/20 text-primary' :
                    p.status === 'new' ? 'bg-green-500/20 text-green-400' :
                    p.status === 'popular' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/product/${p.id}`} className="text-xs text-primary hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsPage;
