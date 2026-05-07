export function About() {
  return (
    <div>
      <section className="bg-cream">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20">
          <h1 className="font-display text-5xl md:text-7xl max-w-2xl">A different kind of clothing studio.</h1>
          <p className="text-neutral-600 mt-6 max-w-lg">
            UrbanCart is an independent label working with small ateliers across Europe to produce a tightly edited
            collection of modern wardrobe staples.
          </p>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-12">
        <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&q=70" className="w-full h-[480px] object-cover" />
        <div className="self-center">
          <p className="text-xs tracking-[0.3em] text-neutral-500 mb-4">OUR PHILOSOPHY</p>
          <h2 className="font-display text-4xl">Less, but better.</h2>
          <p className="text-neutral-600 mt-5 leading-relaxed">
            We design pieces meant to last. Honest materials, considered cuts and a refusal to chase trends. Every garment
            is produced in small runs to limit waste and keep our craftspeople paid fairly.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-10">
            <Stat n="12" l="Years making clothes" />
            <Stat n="38" l="Partner ateliers" />
            <Stat n="100%" l="Traceable materials" />
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <p className="font-display text-3xl">{n}</p>
      <p className="text-xs text-neutral-500 mt-1">{l}</p>
    </div>
  );
}
