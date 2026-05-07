import { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, Grid3X3, LayoutGrid, List } from 'lucide-react';
import { useStore } from '../store/store';
import { ProductCard } from '../components/ProductCard';

const CATEGORIES = ['Outerwear', 'Tops', 'Knitwear', 'Bottoms', 'Shirts'] as const;
const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;
const BRANDS = ['UrbanCart', 'TrendWear', 'ClassicFit', 'ActiveGear'] as const;
const COLORS = [
  { name: 'Black', hex: '#0e0e0e' },
  { name: 'Camel', hex: '#b07a3a' },
  { name: 'Navy', hex: '#1e2a47' },
  { name: 'Cream', hex: '#efe6d3' },
  { name: 'Pink', hex: '#e9c2c4' },
  { name: 'Sky', hex: '#aac4dd' },
  { name: 'Sage', hex: '#c2c79a' },
];

export function Shop() {
  const { products } = useStore();
  const [params, setParams] = useSearchParams();
  const initialCat = params.get('category');
  const initialQ = params.get('q') || '';

  const [selectedCats, setSelectedCats] = useState<string[]>(initialCat ? [initialCat] : []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(400);
  const [sort, setSort] = useState('default');
  const [view, setView] = useState<'grid3' | 'grid4' | 'list'>('grid4');
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  useEffect(() => {
    if (initialCat) setSelectedCats([initialCat]);
  }, [initialCat]);

  const toggle = (arr: string[], setter: (v: string[]) => void, val: string) =>
    arr.includes(val) ? setter(arr.filter((x) => x !== val)) : setter([...arr, val]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedCats.length && !selectedCats.includes(p.category)) return false;
      if (selectedSizes.length && !p.sizes.some((s) => selectedSizes.includes(s))) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (selectedColors.length && !p.colors.some((c) => selectedColors.includes(c.name))) return false;
      if (p.price > maxPrice) return false;
      if (initialQ && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(initialQ.toLowerCase()))
        return false;
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, selectedCats, selectedSizes, selectedBrands, selectedColors, maxPrice, sort, initialQ]);

  const gridClass =
    view === 'grid3' ? 'grid-cols-2 md:grid-cols-3' : view === 'grid4' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1';

  return (
    <div>
      {/* Banner */}
      <section className="bg-cream relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="font-display text-6xl md:text-7xl">Shop</h1>
            <p className="text-sm text-neutral-600 mt-4">
              <Link to="/" className="hover:text-black">Home</Link>
              <span className="mx-2 text-neutral-400">&gt;</span>
              <span>Shop</span>
            </p>
          </div>
          <div className="hidden lg:flex h-44 -mr-10 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1600&q=70"
              alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-sm text-neutral-500 mr-2 flex items-center gap-2">
              Filter by <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </span>
            <FilterDropdown
              label="Categories"
              open={openFilter === 'cat'}
              onToggle={() => setOpenFilter(openFilter === 'cat' ? null : 'cat')}
            >
              {CATEGORIES.map((c) => (
                <Check key={c} label={c} checked={selectedCats.includes(c)} onChange={() => toggle(selectedCats, setSelectedCats, c)} />
              ))}
            </FilterDropdown>
            <FilterDropdown
              label="Color"
              open={openFilter === 'color'}
              onToggle={() => setOpenFilter(openFilter === 'color' ? null : 'color')}
            >
              <p className="text-xs font-semibold mb-2 text-neutral-700">Colors</p>
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => toggle(selectedColors, setSelectedColors, c.name)}
                  className="flex items-center gap-2 w-full px-1 py-1.5 hover:bg-neutral-50 rounded text-sm"
                >
                  <span className="w-3.5 h-3.5 rounded-full ring-1 ring-neutral-200" style={{ backgroundColor: c.hex }} />
                  <span className={selectedColors.includes(c.name) ? 'font-medium' : ''}>{c.name}</span>
                </button>
              ))}
            </FilterDropdown>
            <FilterDropdown
              label="Size"
              open={openFilter === 'size'}
              onToggle={() => setOpenFilter(openFilter === 'size' ? null : 'size')}
            >
              {SIZES.map((s) => (
                <Check key={s} label={s} checked={selectedSizes.includes(s)} onChange={() => toggle(selectedSizes, setSelectedSizes, s)} />
              ))}
            </FilterDropdown>
            <FilterDropdown
              label="Brand"
              open={openFilter === 'brand'}
              onToggle={() => setOpenFilter(openFilter === 'brand' ? null : 'brand')}
            >
              {BRANDS.map((b) => (
                <Check key={b} label={b} checked={selectedBrands.includes(b)} onChange={() => toggle(selectedBrands, setSelectedBrands, b)} />
              ))}
            </FilterDropdown>
            <FilterDropdown
              label="Price"
              open={openFilter === 'price'}
              onToggle={() => setOpenFilter(openFilter === 'price' ? null : 'price')}
            >
              <p className="text-xs font-semibold mb-3 text-neutral-700">Max price: ${maxPrice}</p>
              <input type="range" min={50} max={400} step={10} value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-black" />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>$50</span><span>$400</span>
              </div>
            </FilterDropdown>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent outline-none text-sm">
                <option value="default">Default Sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
            <div className="flex items-center gap-1 border border-neutral-200 rounded">
              <ViewBtn active={view === 'grid3'} onClick={() => setView('grid3')}><Grid3X3 size={14} /></ViewBtn>
              <ViewBtn active={view === 'grid4'} onClick={() => setView('grid4')}><LayoutGrid size={14} /></ViewBtn>
              <ViewBtn active={view === 'list'} onClick={() => setView('list')}><List size={14} /></ViewBtn>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {(selectedCats.length + selectedSizes.length + selectedBrands.length + selectedColors.length > 0 || initialQ) && (
          <div className="flex flex-wrap items-center gap-2 py-4">
            {[...selectedCats, ...selectedSizes, ...selectedBrands, ...selectedColors].map((tag) => (
              <span key={tag} className="text-xs bg-cream px-3 py-1 rounded-full">{tag}</span>
            ))}
            {initialQ && <span className="text-xs bg-cream px-3 py-1 rounded-full">"{initialQ}"</span>}
            <button
              onClick={() => {
                setSelectedCats([]); setSelectedSizes([]); setSelectedBrands([]); setSelectedColors([]);
                setParams({});
              }}
              className="text-xs underline text-neutral-500 hover:text-black"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            <p className="text-lg">No products match your filters.</p>
          </div>
        ) : (
          <div className={`grid ${gridClass} gap-x-6 gap-y-12`}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination (visual) */}
        <div className="flex items-center justify-center gap-2 mt-16">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              className={`w-9 h-9 rounded-full text-sm ${n === 1 ? 'bg-black text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
            >
              {n}
            </button>
          ))}
          <button className="w-9 h-9 rounded-full text-sm text-neutral-500 hover:bg-neutral-100">Next</button>
        </div>
      </section>
    </div>
  );
}

function FilterDropdown({
  label, open, onToggle, children,
}: { label: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <button onClick={onToggle} className="flex items-center gap-1 px-3 py-2 text-sm hover:text-amber-700">
        {label} <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-neutral-100 shadow-xl rounded p-3 z-30">
          {children}
        </div>
      )}
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 px-1 py-1.5 hover:bg-neutral-50 rounded text-sm cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-black" />
      <span>{label}</span>
    </label>
  );
}

function ViewBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`p-2 ${active ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'}`}>
      {children}
    </button>
  );
}
