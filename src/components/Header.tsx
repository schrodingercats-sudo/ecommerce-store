import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, LogOut, Search, ShoppingBag, User as UserIcon, Menu, X } from 'lucide-react';
import { useStore } from '../store/store';
import { useState } from 'react';

export function Header() {
  const { user, logout, cartCount, wishlist } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItem = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-wide hover:text-black transition ${isActive ? 'text-black' : 'text-neutral-600'}`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display font-bold text-3xl tracking-tight">
          UrbanCart
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-9 ml-10 mr-auto pl-10">
          <NavLink to="/" end className={navItem}>Home</NavLink>
          <NavLink to="/shop" className={navItem}>Shop</NavLink>
          <NavLink to="/shop?category=Outerwear" className={navItem}>Products</NavLink>
          <NavLink to="/orders" className={navItem}>Orders</NavLink>
          <NavLink to="/about" className={navItem}>About</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `text-sm tracking-wide font-medium ${isActive ? 'text-black' : 'text-amber-700'}`}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <button
            aria-label="Search"
            onClick={() => setOpen((o) => !o)}
            className="text-neutral-700 hover:text-black"
          >
            <Search size={20} />
          </button>

          {user ? (
            <div className="relative group hidden sm:block">
              <button className="text-neutral-700 hover:text-black flex items-center gap-2">
                <UserIcon size={20} />
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-100 shadow-xl rounded-md p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-neutral-500 mb-3">{user.email}</p>
                <Link to="/orders" className="block py-1.5 text-sm hover:text-amber-700">My Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block py-1.5 text-sm hover:text-amber-700">Admin Dashboard</Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="mt-2 w-full flex items-center gap-2 text-sm text-neutral-600 hover:text-black border-t border-neutral-100 pt-2"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" aria-label="Account" className="text-neutral-700 hover:text-black">
              <UserIcon size={20} />
            </Link>
          )}

          <Link to="/wishlist" className="relative text-neutral-700 hover:text-black">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 grid place-items-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-neutral-700 hover:text-black">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 grid place-items-center">
                {cartCount}
              </span>
            )}
          </Link>

          <button className="lg:hidden text-neutral-700" onClick={() => setMenuOpen((m) => !m)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {open && (
        <div className="border-t border-neutral-100 bg-white">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4">
            <input
              autoFocus
              placeholder="Search for products, brands..."
              className="w-full bg-transparent outline-none text-lg placeholder:text-neutral-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/shop?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                  setOpen(false);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-neutral-100 bg-white px-6 py-5 flex flex-col gap-4">
          <NavLink to="/" end onClick={() => setMenuOpen(false)} className="text-sm">Home</NavLink>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)} className="text-sm">Shop</NavLink>
          <NavLink to="/orders" onClick={() => setMenuOpen(false)} className="text-sm">Orders</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)} className="text-sm">About</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-amber-700">Admin</NavLink>
          )}
          {!user && (
            <NavLink to="/login" onClick={() => setMenuOpen(false)} className="text-sm">Sign in</NavLink>
          )}
        </div>
      )}
    </header>
  );
}
