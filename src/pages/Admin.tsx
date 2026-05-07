import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Edit3, Plus, Trash2, X, Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { useStore } from '../store/store';
import type { Product } from '../data/seed';
import type { OrderStatus } from '../store/store';
import { StatusBadge } from './Orders';

export function Admin() {
  const { user, products, addProduct, updateProduct, deleteProduct, orders, updateOrderStatus, error } = useStore();
  const [tab, setTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [editing, setEditing] = useState<Product | 'new' | null>(null);

  if (!user) return <Navigate to="/login?redirect=/admin" replace />;
  if (user.role !== 'admin')
    return (
      <div className="max-w-md mx-auto py-32 text-center">
        <h2 className="font-display text-3xl">Access denied</h2>
        <p className="text-neutral-500 mt-3">You need admin privileges to view this page.</p>
      </div>
    );

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const uniqueCustomers = new Set(orders.map((o) => o.userId)).size;

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-widest text-amber-700 uppercase">Admin</p>
          <h1 className="font-display text-4xl md:text-5xl mt-1">Dashboard</h1>
          <p className="text-xs text-neutral-500 mt-2">Data mode: MongoDB + Express APIs</p>
        </div>
      </div>

      {error && <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-neutral-200 mb-8">
        {(['overview', 'products', 'orders'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm capitalize border-b-2 transition ${
              tab === t ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={<DollarSign />} label="Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            <Stat icon={<ShoppingBag />} label="Orders" value={String(orders.length)} />
            <Stat icon={<Package />} label="Products" value={String(products.length)} />
            <Stat icon={<Users />} label="Customers" value={String(uniqueCustomers)} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <div className="border border-neutral-200 p-6">
              <h3 className="font-medium mb-4">Recent orders</h3>
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-b-0 text-sm">
                  <div>
                    <p className="font-medium">{o.id}</p>
                    <p className="text-xs text-neutral-500">{o.userEmail}</p>
                  </div>
                  <div className="text-right">
                    <p>${o.total.toFixed(2)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-sm text-neutral-500">No orders yet.</p>}
            </div>
            <div className="border border-neutral-200 p-6">
              <h3 className="font-medium mb-4">Top products</h3>
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-neutral-100 last:border-b-0">
                  <div className="w-12 h-14 bg-cream overflow-hidden">
                    <img src={p.image} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p>{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.category} - ${p.price}</p>
                  </div>
                  <p className="text-xs text-neutral-500">Stock: {p.stock}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      {tab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-neutral-500">{products.length} products</p>
            <button
              onClick={() => setEditing('new')}
              className="bg-black text-white px-4 py-2 text-sm flex items-center gap-2 hover:bg-neutral-800"
            >
              <Plus size={14} /> Add product
            </button>
          </div>

          <div className="border border-neutral-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Brand</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-neutral-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-cream overflow-hidden">
                          <img src={p.image} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">{p.brand}</td>
                    <td className="px-4 py-3">${p.price}</td>
                    <td className="px-4 py-3">
                      <span className={p.stock < 10 ? 'text-red-600' : ''}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setEditing(p)} className="text-neutral-600 hover:text-black mr-3">
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${p.name}"?`)) void deleteProduct(p.id);
                        }}
                        className="text-neutral-600 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 && <p className="text-sm text-neutral-500">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="border border-neutral-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-xs text-neutral-500">Order</p>
                    <p className="font-medium">{o.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Customer</p>
                    <p>{o.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Date</p>
                    <p>{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Total</p>
                    <p className="font-medium">${o.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Items</p>
                    <p>{o.items.reduce((s, i) => s + i.qty, 0)}</p>
                  </div>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => void updateOrderStatus(o.id, e.target.value as OrderStatus)}
                  className="border border-neutral-200 rounded px-3 py-2 text-sm"
                >
                  {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer text-neutral-600 hover:text-black">View items</summary>
                <div className="mt-3 space-y-2">
                  {o.items.map((it) => (
                    <div key={it.productId + it.size + it.color} className="flex items-center gap-3 text-xs">
                      <div className="w-8 h-10 bg-cream overflow-hidden">
                        <img src={it.image} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <span className="flex-1">{it.name} - {it.color} - {it.size}</span>
                      <span>x{it.qty}</span>
                      <span>${(it.price * it.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <p className="text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                    Ship to: {o.shipping.name}, {o.shipping.address}, {o.shipping.city} {o.shipping.zip}, {o.shipping.country}
                  </p>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ProductEditor
          product={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (data) => {
            if (editing === 'new') await addProduct(data);
            else await updateProduct(editing.id, data);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-cream p-5">
      <div className="text-neutral-700">{icon}</div>
      <p className="text-xs text-neutral-600 mt-3">{label}</p>
      <p className="font-display text-3xl mt-1">{value}</p>
    </div>
  );
}

function ProductEditor({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Omit<Product, 'id'>) => void | Promise<void>;
}) {
  const [form, setForm] = useState<Omit<Product, 'id'>>(
    product
      ? { ...product }
      : {
          name: '',
          price: 0,
          category: 'Tops',
          brand: 'UrbanCart',
          sizes: ['S', 'M', 'L'],
          colors: [{ name: 'Black', hex: '#0e0e0e' }],
          image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=70',
          description: '',
          stock: 10,
        },
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="bg-white max-w-lg w-full p-6 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-2xl">{product ? 'Edit product' : 'Add product'}</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField className="col-span-2" label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <FormField label="Price ($)" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: parseFloat(v) || 0 })} />
          <FormField label="Stock" type="number" value={String(form.stock)} onChange={(v) => setForm({ ...form, stock: parseInt(v) || 0 })} />
          <SelectField label="Category" value={form.category} options={['Outerwear', 'Tops', 'Knitwear', 'Bottoms', 'Shirts']} onChange={(v) => setForm({ ...form, category: v as Product['category'] })} />
          <SelectField label="Brand" value={form.brand} options={['UrbanCart', 'TrendWear', 'ClassicFit', 'ActiveGear']} onChange={(v) => setForm({ ...form, brand: v as Product['brand'] })} />
          <FormField className="col-span-2" label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          <label className="col-span-2 block">
            <span className="text-xs text-neutral-600">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="mt-1 w-full border border-neutral-200 rounded px-3 py-2.5 text-sm focus:border-black outline-none"
            />
          </label>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-neutral-200">Cancel</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 text-sm bg-black text-white">Save</button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', className }: { label: string; value: string; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <label className={`block ${className || ''}`}>
      <span className="text-xs text-neutral-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-neutral-200 rounded px-3 py-2 text-sm focus:border-black outline-none"
      />
    </label>
  );
}
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs text-neutral-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-neutral-200 rounded px-3 py-2 text-sm focus:border-black outline-none bg-white"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
