import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-black text-neutral-300 mt-24">
      {/* Top: newsletter + links */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Newsletter */}
        <div className="lg:col-span-2 max-w-sm">
          <p className="text-2xl text-white font-light leading-snug">
            Receive an exclusive <span className="text-red-500 font-semibold">20%</span><br />
            discount code when you<br />
            signup.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thanks for subscribing!');
            }}
            className="mt-6 flex items-center border-b border-neutral-700 focus-within:border-white"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 bg-transparent outline-none py-3 text-sm placeholder:text-neutral-500"
            />
            <button className="text-sm text-white pl-3 pb-1 hover:text-red-500" type="submit">
              Subscribe
            </button>
          </form>
        </div>

        <FooterCol
          title="Company"
          items={[
            ['About Us', '/about'],
            ['Blog', '/about'],
            ['Careers', '/about'],
            ['Locations', '/about'],
          ]}
        />
        <FooterCol
          title="Customer Care"
          items={[
            ['Size Guide', '#'],
            ['Help & FAQs', '#'],
            ['Return My Order', '/orders'],
            ['Refer a Friend', '#'],
          ]}
        />
        <FooterCol
          title="Follow us"
          items={[
            ['Instagram', '#'],
            ['Facebook', '#'],
            ['Pinterest', '#'],
            ['Tiktok', '#'],
          ]}
        />
      </div>

      {/* Bottom strip */}
      <div className="border-t border-neutral-800">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-display font-bold text-2xl text-white">UrbanCart</span>
            <p className="text-xs text-neutral-500">(c) 2026 UrbanCart. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-3">
            <PayBadge>VISA</PayBadge>
            <PayBadge>MC</PayBadge>
            <PayBadge>stripe</PayBadge>
            <PayBadge>PayPal</PayBadge>
            <select className="bg-transparent text-xs border border-neutral-700 rounded px-2 py-1 text-neutral-300">
              <option>EN</option>
            </select>
            <select className="bg-transparent text-xs border border-neutral-700 rounded px-2 py-1 text-neutral-300">
              <option>USD</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h4 className="text-white text-sm font-medium mb-4">{title}</h4>
      <ul className="space-y-3">
        {items.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="text-sm text-neutral-400 hover:text-white transition">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PayBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-white text-black text-[10px] font-semibold px-2 py-1 rounded tracking-tight">
      {children}
    </span>
  );
}
