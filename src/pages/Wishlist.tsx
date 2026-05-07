import { Link } from 'react-router-dom';
import { useStore } from '../store/store';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';

export function Wishlist() {
  const { wishlist, products } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
      <h1 className="font-display text-4xl md:text-5xl mb-10">Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-20 bg-cream">
          <Heart size={40} className="mx-auto text-neutral-400" />
          <p className="mt-4 text-neutral-600">Your wishlist is empty.</p>
          <Link to="/shop" className="inline-block mt-6 bg-black text-white px-6 py-3 text-sm">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
