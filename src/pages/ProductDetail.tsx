import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useStore } from '../store/store';
import { ProductCard } from '../components/ProductCard';

export function ProductDetail() {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, wishlist } = useStore();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

  const [size, setSize] = useState(product?.sizes[1] || product?.sizes[0] || 'M');
  const [color, setColor] = useState(product?.colors[0]?.name || '');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes[1] || product.sizes[0] || 'M');
    setColor(product.colors[0]?.name || '');
    setQty(1);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-32 text-center">
        <h2 className="font-display text-3xl mb-4">Product not found</h2>
        <Link to="/shop" className="underline">Back to shop</Link>
      </div>
    );
  }

  const liked = wishlist.includes(product.id);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        <p className="text-xs text-neutral-500 mb-6">
          <Link to="/" className="hover:text-black">Home</Link> &gt;{' '}
          <Link to="/shop" className="hover:text-black">Shop</Link> &gt; <span>{product.name}</span>
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-cream aspect-[4/5] overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
          </div>

          {/* Info */}
          <div>
            <p className="text-xs tracking-widest text-neutral-500 mb-3">{product.brand.toUpperCase()}</p>
            <h1 className="font-display text-4xl md:text-5xl">{product.name}</h1>
            <p className="text-2xl mt-4">${product.price.toFixed(2)}</p>
            <p className="text-sm text-neutral-600 mt-6 leading-relaxed max-w-md">{product.description}</p>

            {/* Color */}
            <div className="mt-8">
              <p className="text-sm mb-3">
                Color: <span className="text-neutral-500">{color}</span>
              </p>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    className={`w-8 h-8 rounded-full ring-2 transition ${
                      color === c.name ? 'ring-black' : 'ring-neutral-200'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-6">
              <p className="text-sm mb-3">Size: <span className="text-neutral-500">{size}</span></p>
              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 h-11 px-4 border text-sm transition ${
                      size === s ? 'border-black bg-black text-white' : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add */}
            <div className="mt-8 flex items-stretch gap-3">
              <div className="flex items-center border border-neutral-200">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-12 grid place-items-center hover:bg-neutral-50">
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-11 h-12 grid place-items-center hover:bg-neutral-50">
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => {
                  addToCart({ productId: product.id, size, color, qty });
                  navigate('/cart');
                }}
                className="flex-1 bg-black text-white text-sm tracking-wide hover:bg-neutral-800 transition flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} /> Add to cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 grid place-items-center border border-neutral-200 ${liked ? 'text-red-500' : 'text-neutral-700'}`}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p className="text-xs text-neutral-500 mt-4">
              {product.stock} in stock - Ships within 1-2 business days
            </p>

            <div className="border-t border-neutral-100 mt-8 pt-6 grid grid-cols-3 gap-4 text-xs text-neutral-600">
              <span className="flex items-center gap-2"><Truck size={14} /> Free shipping over $150</span>
              <span className="flex items-center gap-2"><RefreshCw size={14} /> 30-day returns</span>
              <span className="flex items-center gap-2"><ShieldCheck size={14} /> Secure payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20">
          <h2 className="font-display text-3xl md:text-4xl mb-10">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
