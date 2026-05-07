import { Link, Navigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { Package } from 'lucide-react';

export function Orders() {
  const { user, orders } = useStore();
  if (!user) return <Navigate to="/login?redirect=/orders" replace />;

  const myOrders = orders.filter((o) => o.userId === user.id);

  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">My orders</h1>
          <p className="text-neutral-500 text-sm mt-2">Hi {user.name}, here's everything you've ordered.</p>
        </div>
        {user.role === 'admin' && (
          <Link to="/admin" className="text-sm underline">Go to admin dashboard -&gt;</Link>
        )}
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-20 bg-cream">
          <Package size={40} className="mx-auto text-neutral-400" />
          <p className="mt-4 text-neutral-600">You haven't placed any orders yet.</p>
          <Link to="/shop" className="inline-block mt-6 bg-black text-white px-6 py-3 text-sm">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => (
            <div key={order.id} className="border border-neutral-200">
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-cream/60 border-b border-neutral-200">
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-xs text-neutral-500">Order</p>
                    <p className="font-medium">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Placed</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Total</p>
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="p-6 space-y-4">
                {order.items.map((it) => (
                  <div key={`${it.productId}-${it.size}-${it.color}`} className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-cream overflow-hidden flex-shrink-0">
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{it.name}</p>
                      <p className="text-xs text-neutral-500">{it.color} - Size {it.size} - Qty {it.qty}</p>
                    </div>
                    <p className="text-sm">${(it.price * it.qty).toFixed(2)}</p>
                  </div>
                ))}

                {/* Status timeline */}
                <Timeline status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Processing: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-purple-100 text-purple-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full ${map[status] || 'bg-neutral-100'}`}>{status}</span>;
}

function Timeline({ status }: { status: string }) {
  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const idx = steps.indexOf(status);
  if (status === 'Cancelled') {
    return <p className="text-xs text-red-600 mt-4">Order cancelled.</p>;
  }
  return (
    <div className="mt-4 pt-4 border-t border-neutral-100">
      <div className="flex items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex items-center">
            <div className={`w-3 h-3 rounded-full ${i <= idx ? 'bg-black' : 'bg-neutral-200'}`} />
            {i < steps.length - 1 && <div className={`flex-1 h-px ${i < idx ? 'bg-black' : 'bg-neutral-200'}`} />}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-neutral-500 mt-2 uppercase tracking-wider">
        {steps.map((s) => <span key={s}>{s}</span>)}
      </div>
    </div>
  );
}
