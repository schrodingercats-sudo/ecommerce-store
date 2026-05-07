import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import type { ReactNode } from 'react';
import { SEED_PRODUCTS, type Product } from '../data/seed';
import { apiRequest } from '../lib/api';

export type Role = 'admin' | 'user';
export type User = { id: string; email: string; name: string; role: Role };
export type DataMode = 'mongodb-api';

export type CartItem = {
  productId: string;
  size: string;
  color: string;
  qty: number;
};

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type Order = {
  id: string;
  userId: string;
  userEmail: string;
  items: (CartItem & { name: string; price: number; image: string })[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shipping: {
    name: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
};

type StoreCtx = {
  dataMode: DataMode;
  loading: boolean;
  error: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQty: (productId: string, size: string, color: string, qty: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  orders: Order[];
  placeOrder: (shipping: Order['shipping']) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
};

type ProductsResponse = { products: Product[] };
type AuthResponse = { user: User; token: string };
type MeResponse = { user: User };
type OrdersResponse = { orders: Order[] };
type OrderResponse = { order: Order };
type ProductResponse = { product: Product };

const LS = {
  token: 'urbancart_token',
  cart: 'urbancart_cart',
  wishlist: 'urbancart_wishlist',
};

const Ctx = createContext<StoreCtx | null>(null);
const dataMode: DataMode = 'mongodb-api';
const isBrowser = typeof window !== 'undefined';

const lsGet = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const lsSet = <T,>(key: string, value: T) => {
  if (isBrowser) localStorage.setItem(key, JSON.stringify(value));
};

const getStoredToken = () => {
  if (!isBrowser) return null;
  return localStorage.getItem(LS.token);
};

const setStoredToken = (token: string | null) => {
  if (!isBrowser) return;
  if (token) localStorage.setItem(LS.token, token);
  else localStorage.removeItem(LS.token);
};

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Something went wrong');

export function StoreProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [cart, dispatchCart] = useReducer(cartReducer, lsGet<CartItem[]>(LS.cart, []));
  const [wishlist, setWishlist] = useState<string[]>(() => lsGet<string[]>(LS.wishlist, []));
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshProducts = useCallback(async () => {
    const data = await apiRequest<ProductsResponse>('/products');
    setProducts(data.products);
  }, []);

  const refreshOrders = useCallback(
    async (activeToken = token) => {
      if (!activeToken) {
        setOrders([]);
        return;
      }

      const data = await apiRequest<OrdersResponse>('/orders', { token: activeToken });
      setOrders(data.orders);
    },
    [token],
  );

  useEffect(() => lsSet(LS.cart, cart), [cart]);
  useEffect(() => lsSet(LS.wishlist, wishlist), [wishlist]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      setLoading(true);
      setError(null);

      try {
        const activeToken = getStoredToken();
        const productData = await apiRequest<ProductsResponse>('/products');
        if (!mounted) return;
        setProducts(productData.products);

        if (!activeToken) {
          setUser(null);
          setOrders([]);
          return;
        }

        const [meData, orderData] = await Promise.all([
          apiRequest<MeResponse>('/auth/me', { token: activeToken }),
          apiRequest<OrdersResponse>('/orders', { token: activeToken }),
        ]);

        if (!mounted) return;
        setToken(activeToken);
        setUser(meData.user);
        setOrders(orderData.orders);
      } catch (err) {
        if (!mounted) return;
        setError(`Backend connection issue: ${getErrorMessage(err)}`);
        setStoredToken(null);
        setToken(null);
        setUser(null);
        setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const data = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      setStoredToken(data.token);
      setToken(data.token);
      setUser(data.user);
      await refreshOrders(data.token);
      return { ok: true };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [refreshOrders]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setError(null);
    setLoading(true);

    try {
      const data = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: { email, password, name },
      });

      setStoredToken(data.token);
      setToken(data.token);
      setUser(data.user);
      setOrders([]);
      return { ok: true };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    if (token) {
      void apiRequest('/auth/logout', { method: 'POST', token }).catch(() => undefined);
    }

    setStoredToken(null);
    setToken(null);
    setUser(null);
    setOrders([]);
  }, [token]);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    if (!token) throw new Error('Please sign in as admin');
    setError(null);

    try {
      const data = await apiRequest<ProductResponse>('/products', {
        method: 'POST',
        token,
        body: product,
      });
      setProducts((prev) => [data.product, ...prev]);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [token]);

  const updateProduct = useCallback(async (id: string, patch: Partial<Product>) => {
    if (!token) throw new Error('Please sign in as admin');
    setError(null);

    try {
      const data = await apiRequest<ProductResponse>(`/products/${id}`, {
        method: 'PUT',
        token,
        body: patch,
      });
      setProducts((prev) => prev.map((product) => (product.id === id ? data.product : product)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [token]);

  const deleteProduct = useCallback(async (id: string) => {
    if (!token) throw new Error('Please sign in as admin');
    setError(null);

    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE', token });
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [token]);

  const addToCart = (item: CartItem) => dispatchCart({ type: 'add', item });
  const updateCartQty = (productId: string, size: string, color: string, qty: number) =>
    dispatchCart({ type: 'qty', productId, size, color, qty });
  const removeFromCart = (productId: string, size: string, color: string) =>
    dispatchCart({ type: 'remove', productId, size, color });
  const clearCart = () => dispatchCart({ type: 'clear' });

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return sum + (product ? product.price * item.qty : 0);
      }, 0),
    [cart, products],
  );

  const toggleWishlist = (id: string) =>
    setWishlist((prev) => (prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]));

  const placeOrder = useCallback(
    async (shipping: Order['shipping']): Promise<Order | null> => {
      if (!token || !user || cart.length === 0) return null;
      setError(null);

      try {
        const data = await apiRequest<OrderResponse>('/orders', {
          method: 'POST',
          token,
          body: { items: cart, shipping },
        });

        setOrders((prev) => [data.order, ...prev]);
        clearCart();
        await refreshProducts();
        return data.order;
      } catch (err) {
        setError(getErrorMessage(err));
        return null;
      }
    },
    [cart, refreshProducts, token, user],
  );

  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    if (!token) return;
    setError(null);

    try {
      const data = await apiRequest<OrderResponse>(`/orders/${id}/status`, {
        method: 'PATCH',
        token,
        body: { status },
      });
      setOrders((prev) => prev.map((order) => (order.id === id ? data.order : order)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [token]);

  const value: StoreCtx = {
    dataMode,
    loading,
    error,
    user,
    login,
    register,
    logout,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    wishlist,
    toggleWishlist,
    orders,
    placeOrder,
    updateOrderStatus,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

type CartAction =
  | { type: 'add'; item: CartItem }
  | { type: 'qty'; productId: string; size: string; color: string; qty: number }
  | { type: 'remove'; productId: string; size: string; color: string }
  | { type: 'clear' };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'add': {
      const idx = state.findIndex(
        (item) =>
          item.productId === action.item.productId &&
          item.size === action.item.size &&
          item.color === action.item.color,
      );

      if (idx >= 0) {
        const next = [...state];
        next[idx] = { ...next[idx], qty: next[idx].qty + action.item.qty };
        return next;
      }

      return [...state, action.item];
    }
    case 'qty':
      return state
        .map((item) =>
          item.productId === action.productId && item.size === action.size && item.color === action.color
            ? { ...item, qty: action.qty }
            : item,
        )
        .filter((item) => item.qty > 0);
    case 'remove':
      return state.filter(
        (item) => !(item.productId === action.productId && item.size === action.size && item.color === action.color),
      );
    case 'clear':
      return [];
  }
};

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
