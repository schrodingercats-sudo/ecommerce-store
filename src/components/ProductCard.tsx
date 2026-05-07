import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/seed';
import { useStore } from '../store/store';

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist } = useStore();
  const liked = wishlist.includes(product.id);

  return (
    <div className="group">
      <Link to={`/product/${product.id}`} className="block relative bg-[#f4f1ec] aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center bg-white/90 backdrop-blur transition ${
            liked ? 'text-red-500' : 'text-neutral-700 hover:text-black'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>
        {product.featured && (
          <span className="absolute top-3 left-3 bg-black text-white text-[10px] tracking-widest px-2 py-1">
            FEATURED
          </span>
        )}
      </Link>
      <div className="pt-4">
        <Link to={`/product/${product.id}`} className="text-[15px] hover:text-amber-700 transition">
          {product.name}
        </Link>
        <p className="text-sm mt-1">${product.price.toFixed(2)}</p>
        <div className="flex items-center gap-1.5 mt-3">
          {product.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="w-3.5 h-3.5 rounded-full ring-1 ring-neutral-200"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
