import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useStore } from '../store/store';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  const { products } = useStore();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="bg-cream relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div className="fade-up">
            <p className="text-xs tracking-[0.3em] text-neutral-600 mb-5">FALL - WINTER COLLECTION</p>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-ink">
              Quietly<br />Considered.
            </h1>
            <p className="mt-6 max-w-md text-neutral-600 leading-relaxed">
              Modern essentials cut from premium fabrics. Timeless silhouettes built to outlast the seasons.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-sm tracking-wide hover:bg-neutral-800 transition"
              >
                Shop the collection <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="text-sm underline underline-offset-4 text-neutral-700 hover:text-black">
                Our story
              </Link>
            </div>
          </div>

          <div className="relative h-[420px] lg:h-[520px]">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=70"
              alt="Hero"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-y border-neutral-100">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <Feature icon={<Truck size={18} />} title="Free shipping" sub="On orders over $150" />
          <Feature icon={<RefreshCw size={18} />} title="Easy returns" sub="30-day window" />
          <Feature icon={<ShieldCheck size={18} />} title="Secure checkout" sub="Encrypted payments" />
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.25em] text-neutral-500 mb-3">CURATED EDIT</p>
            <h2 className="font-display text-4xl md:text-5xl">Featured pieces</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex text-sm items-center gap-2 hover:text-amber-700">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Category banner */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-6 pb-20">
        <CategoryTile
          title="Outerwear"
          tag="Built for the cold"
          image="https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=1100&q=70"
          link="/shop?category=Outerwear"
        />
        <CategoryTile
          title="Knitwear"
          tag="Made to layer"
          image="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1100&q=70"
          link="/shop?category=Knitwear"
        />
      </section>

      {/* New arrivals */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 pb-24">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-4xl md:text-5xl">New arrivals</h2>
          <Link to="/shop" className="hidden md:inline-flex text-sm items-center gap-2 hover:text-amber-700">
            Shop all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 grid place-items-center rounded-full bg-cream text-ink">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-neutral-500 text-xs">{sub}</p>
      </div>
    </div>
  );
}

function CategoryTile({ title, tag, image, link }: { title: string; tag: string; image: string; link: string }) {
  return (
    <Link to={link} className="relative block overflow-hidden h-[420px] group">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6 text-white">
        <p className="text-xs tracking-[0.25em] mb-2 opacity-90">{tag}</p>
        <h3 className="font-display text-3xl">{title}</h3>
      </div>
    </Link>
  );
}
