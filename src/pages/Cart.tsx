import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/store';

export function Cart() {
  const { cart, products, updateCartQty, removeFromCart, cartTotal } = useStore();
  const navigate = useNavigate();

  const items = cart
    .map((ci) => ({ ci, product: products.find((p) => p.id === ci.productId) }))
    .filter((x) => x.product);

  const shipping = cartTotal > 150 || cartTotal === 0 ? 0 : 12;
  const tax = +(cartTotal * 0.08).toFixed(2);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-5xl">Your cart is empty</h1>
        <p className="text-neutral-500 mt-4">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="inline-block mt-8 bg-black text-white px-6 py-3 text-sm">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
      <h1 className="font-display text-4xl md:text-5xl mb-10">Shopping cart</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        {/* Items */}
        <div>
          <div className="hidden md:grid grid-cols-[1fr_120px_120px_40px] text-xs uppercase text-neutral-500 tracking-widest pb-4 border-b border-neutral-200">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
            <span />
          </div>
          {items.map(({ ci, product }) => (
            <div
              key={`${ci.productId}-${ci.size}-${ci.color}`}
              className="grid grid-cols-[80px_1fr] md:grid-cols-[1fr_120px_120px_40px] gap-4 py-6 border-b border-neutral-100 items-center"
            >
              <div className="md:col-span-1 col-span-2 flex items-center gap-4">
                <Link to={`/product/${product!.id}`} className="block w-20 h-24 bg-cream overflow-hidden flex-shrink-0">
                  <img src={product!.image} alt={product!.name} className="w-full h-full object-cover mix-blend-multiply" />
                </Link>
                <div>
                  <Link to={`/product/${product!.id}`} className="font-medium hover:text-amber-700">{product!.name}</Link>
                  <p className="text-xs text-neutral-500 mt-1">{ci.color} - Size {ci.size}</p>
                  <p className="md:hidden text-sm mt-1">${product!.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center border border-neutral-200">
                  <button
                    onClick={() => updateCartQty(ci.productId, ci.size, ci.color, ci.qty - 1)}
                    className="w-9 h-9 grid place-items-center hover:bg-neutral-50"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-9 text-center text-sm">{ci.qty}</span>
                  <button
                    onClick={() => updateCartQty(ci.productId, ci.size, ci.color, ci.qty + 1)}
                    className="w-9 h-9 grid place-items-center hover:bg-neutral-50"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <p className="text-right">${(product!.price * ci.qty).toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(ci.productId, ci.size, ci.color)}
                className="text-neutral-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="bg-cream p-8 h-fit sticky top-24">
          <h2 className="font-display text-2xl mb-6">Order summary</h2>
          <Row label="Subtotal" value={`$${cartTotal.toFixed(2)}`} />
          <Row label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} />
          <Row label="Tax (est.)" value={`$${tax.toFixed(2)}`} />
          <div className="border-t border-neutral-300 mt-4 pt-4 flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className="font-display text-2xl">${(cartTotal + shipping + tax).toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-6 bg-black text-white py-3.5 text-sm tracking-wide hover:bg-neutral-800"
          >
            Checkout
          </button>
          <Link to="/shop" className="block mt-3 text-center text-sm text-neutral-600 hover:text-black underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5">
      <span className="text-neutral-600">{label}</span>
      <span>{value}</span>
    </div>
  );
}
