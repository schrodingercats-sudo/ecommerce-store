import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/store';

export function Checkout() {
  const { user, cart, products, cartTotal, placeOrder } = useStore();
  const navigate = useNavigate();
  const [confirmedOrder, setConfirmedOrder] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
    card: '4242 4242 4242 4242',
    exp: '12/29',
    cvc: '123',
  });

  if (!user) return <Navigate to="/login?redirect=/checkout" replace />;
  if (cart.length === 0 && !confirmedOrder) return <Navigate to="/cart" replace />;

  const shipping = cartTotal > 150 ? 0 : 12;
  const tax = +(cartTotal * 0.08).toFixed(2);
  const total = cartTotal + shipping + tax;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    const order = await placeOrder({
        name: form.name,
        address: form.address,
        city: form.city,
        zip: form.zip,
        country: form.country,
      });
    setPlacing(false);
    if (order) setConfirmedOrder(order.id);
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <CheckCircle2 size={56} className="mx-auto text-green-600" />
        <h1 className="font-display text-4xl mt-6">Thank you for your order</h1>
        <p className="text-neutral-600 mt-3">
          Your order <span className="font-medium">{confirmedOrder}</span> has been placed.
        </p>
        <p className="text-neutral-500 text-sm mt-2">A confirmation has been sent to {form.email}.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={() => navigate('/orders')} className="bg-black text-white px-6 py-3 text-sm">
            Track my order
          </button>
          <Link to="/shop" className="underline text-sm">Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
      <h1 className="font-display text-4xl md:text-5xl mb-10">Checkout</h1>
      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_400px] gap-12">
        {/* Form */}
        <div className="space-y-10">
          <Section title="Contact">
            <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          </Section>
          <Section title="Shipping address">
            <Field label="Street address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
              <Field label="Postal code" value={form.zip} onChange={(v) => setForm({ ...form, zip: v })} required />
            </div>
            <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
          </Section>
          <Section title="Payment">
            <Field label="Card number" value={form.card} onChange={(v) => setForm({ ...form, card: v })} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry" value={form.exp} onChange={(v) => setForm({ ...form, exp: v })} />
              <Field label="CVC" value={form.cvc} onChange={(v) => setForm({ ...form, cvc: v })} />
            </div>
            <p className="text-xs text-neutral-500">Demo only - no real charges.</p>
          </Section>
        </div>

        {/* Summary */}
        <aside className="bg-cream p-8 h-fit sticky top-24">
          <h2 className="font-display text-2xl mb-6">Your order</h2>
          <div className="space-y-4 max-h-72 overflow-auto pr-1">
            {cart.map((ci) => {
              const p = products.find((pp) => pp.id === ci.productId)!;
              return (
                <div key={`${ci.productId}-${ci.size}-${ci.color}`} className="flex items-center gap-3">
                  <div className="w-14 h-16 bg-white overflow-hidden flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p>{p.name}</p>
                    <p className="text-xs text-neutral-500">{ci.color} - {ci.size} - x{ci.qty}</p>
                  </div>
                  <p className="text-sm">${(p.price * ci.qty).toFixed(2)}</p>
                </div>
              );
            })}
          </div>
          <div className="border-t border-neutral-300 mt-6 pt-4 space-y-1.5 text-sm">
            <Row label="Subtotal" value={`$${cartTotal.toFixed(2)}`} />
            <Row label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} />
            <Row label="Tax" value={`$${tax.toFixed(2)}`} />
          </div>
          <div className="flex items-center justify-between border-t border-neutral-300 mt-4 pt-4">
            <span className="font-medium">Total</span>
            <span className="font-display text-2xl">${total.toFixed(2)}</span>
          </div>
          <button
            type="submit"
            disabled={placing}
            className="w-full mt-6 bg-black text-white py-3.5 text-sm tracking-wide hover:bg-neutral-800 disabled:opacity-60"
          >
            {placing ? 'Placing order...' : 'Place order'}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
function Field({ label, value, onChange, type = 'text', required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs text-neutral-600">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-neutral-200 rounded px-3 py-2.5 text-sm focus:border-black outline-none"
      />
    </label>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-600">{label}</span>
      <span>{value}</span>
    </div>
  );
}
