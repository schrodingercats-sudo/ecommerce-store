import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/store';

export function Login() {
  const { user, login, register } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={redirect} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res =
      mode === 'login'
        ? await login(form.email, form.password)
        : await register(form.email, form.password, form.name);
    setLoading(false);
    if (!res.ok) setError(res.error || 'Something went wrong');
    else navigate(redirect);
  };

  return (
    <div className="min-h-[80vh] grid lg:grid-cols-2">
      <div className="hidden lg:block bg-cream relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=70"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-10 left-10 text-white max-w-xs">
          <p className="text-xs tracking-[0.3em]">GUZA - 2026</p>
          <h2 className="font-display text-4xl mt-2">Designed for the everyday.</h2>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-4xl">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
          <p className="text-sm text-neutral-500 mt-2">
            {mode === 'login' ? 'Sign in to access your orders and wishlist.' : 'Join UrbanCart and start shopping.'}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === 'register' && (
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            )}
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 text-sm tracking-wide hover:bg-neutral-800 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="mt-4 text-sm text-neutral-600 hover:text-black w-full text-center"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>

          <div className="mt-10 p-4 bg-cream rounded text-xs text-neutral-700 leading-relaxed">
            <p className="font-medium text-neutral-900 mb-1">MongoDB demo accounts</p>
            <p>Run <span className="font-mono">npm run seed</span> first.</p>
            <p>Admin - admin@urbancart.com / admin123</p>
            <p>User - demo@urbancart.com / demo123</p>
          </div>

          <p className="text-xs text-neutral-500 mt-6 text-center">
            <Link to="/" className="hover:text-black">&lt;- Back to store</Link>
          </p>
        </div>
      </div>
    </div>
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
