// Seed product data - uses Unsplash photos for clothing imagery.
export type Product = {
  id: string;
  name: string;
  price: number;
  category: 'Outerwear' | 'Tops' | 'Knitwear' | 'Bottoms' | 'Shirts';
  brand: 'UrbanCart' | 'TrendWear' | 'ClassicFit' | 'ActiveGear';
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[];
  colors: { name: string; hex: string }[];
  image: string;
  description: string;
  stock: number;
  featured?: boolean;
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Suede Bomber Jacket',
    price: 168,
    category: 'Outerwear',
    brand: 'UrbanCart',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#b07a3a' },
      { name: 'Navy', hex: '#1e2a47' },
      { name: 'Grey', hex: '#8a8a8a' },
    ],
    image: img('photo-1551028719-00167b16eac5'),
    description:
      'A relaxed-fit bomber jacket cut from soft brushed suede. Featuring a stand collar, ribbed hem and full-length zip closure.',
    stock: 24,
    featured: true,
  },
  {
    id: 'p2',
    name: 'Pink Cotton Hoodie',
    price: 89,
    category: 'Tops',
    brand: 'ClassicFit',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Pink', hex: '#e9c2c4' },
      { name: 'Cream', hex: '#efe6d3' },
      { name: 'Grey', hex: '#9a9a9a' },
    ],
    image: img('photo-1556821840-3a63f95609a7'),
    description: 'Heavyweight loop-back cotton hoodie with a relaxed silhouette and dropped shoulders.',
    stock: 40,
  },
  {
    id: 'p3',
    name: 'Asymmetric Wool Jacket',
    price: 245,
    category: 'Outerwear',
    brand: 'ActiveGear',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Black', hex: '#0e0e0e' },
      { name: 'Camel', hex: '#b07a3a' },
    ],
    image: img('photo-1591047139829-d91aecb6caea'),
    description: 'Cropped wool jacket with off-centre zip and structured shoulders.',
    stock: 12,
    featured: true,
  },
  {
    id: 'p4',
    name: 'Long-Sleeve Polo',
    price: 78,
    category: 'Tops',
    brand: 'TrendWear',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sky', hex: '#aac4dd' },
      { name: 'White', hex: '#f5f5f5' },
      { name: 'Navy', hex: '#1e2a47' },
    ],
    image: img('photo-1620799140408-edc6dcb6d633'),
    description: 'Lightweight knitted polo with three-button placket and ribbed cuffs.',
    stock: 32,
  },
  {
    id: 'p5',
    name: 'Abstract Knit Sweater',
    price: 132,
    category: 'Knitwear',
    brand: 'ActiveGear',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Multi', hex: '#c8a796' },
      { name: 'Cream', hex: '#efe6d3' },
    ],
    image: img('photo-1576566588028-4147f3842f27'),
    description: 'Soft merino-blend sweater with a hand-painted abstract pattern.',
    stock: 18,
    featured: true,
  },
  {
    id: 'p6',
    name: 'Camel Wool Coat',
    price: 320,
    category: 'Outerwear',
    brand: 'UrbanCart',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#b07a3a' },
      { name: 'Black', hex: '#0e0e0e' },
    ],
    image: img('photo-1539533113208-f6df8cc8b543'),
    description: 'Tailored single-breasted coat in pure virgin wool with notch lapels.',
    stock: 9,
    featured: true,
  },
  {
    id: 'p7',
    name: 'Plaid Flannel Overshirt',
    price: 96,
    category: 'Shirts',
    brand: 'ClassicFit',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black/Cream', hex: '#2b2b2b' },
      { name: 'Olive', hex: '#5b6b3a' },
    ],
    image: img('photo-1608030609295-a581b8f46672'),
    description: 'Brushed-cotton plaid overshirt with chest pockets and horn buttons.',
    stock: 27,
  },
  {
    id: 'p8',
    name: 'Belted Wrap Coat',
    price: 285,
    category: 'Outerwear',
    brand: 'TrendWear',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Sand', hex: '#cfa477' },
      { name: 'Stone', hex: '#a59785' },
    ],
    image: img('photo-1543076447-215ad9ba6923'),
    description: 'Long-line wrap coat with self-tie belt and dropped shoulders.',
    stock: 14,
  },
  {
    id: 'p9',
    name: 'Pleated Linen Blouse',
    price: 112,
    category: 'Shirts',
    brand: 'UrbanCart',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Sand', hex: '#cfa477' },
      { name: 'White', hex: '#f5f5f5' },
    ],
    image: img('photo-1564257577-2d3c9ce05f95'),
    description: 'Airy linen blouse with all-over micro-pleats and balloon sleeves.',
    stock: 22,
  },
  {
    id: 'p10',
    name: 'Color-Block Overshirt',
    price: 124,
    category: 'Shirts',
    brand: 'ActiveGear',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Cream', hex: '#efe6d3' },
      { name: 'Rust', hex: '#a05a3a' },
    ],
    image: img('photo-1602810318383-e386cc2a3ccf'),
    description: 'Boxy overshirt with contrast piping and a single chest pocket.',
    stock: 17,
  },
  {
    id: 'p11',
    name: 'Drawstring Sport Shorts',
    price: 64,
    category: 'Bottoms',
    brand: 'ClassicFit',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sage', hex: '#c2c79a' },
      { name: 'Black', hex: '#0e0e0e' },
    ],
    image: img('photo-1591195853828-11db59a44f6b'),
    description: 'Lightweight tech shorts with elasticated drawstring waist.',
    stock: 50,
  },
  {
    id: 'p12',
    name: 'Soft Tailored Blazer',
    price: 198,
    category: 'Outerwear',
    brand: 'TrendWear',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Grey', hex: '#9a9a9a' },
      { name: 'Navy', hex: '#1e2a47' },
    ],
    image: img('photo-1594938298603-c8148c4dae35'),
    description: 'Unstructured blazer in a wool-blend with shawl collar and patch pockets.',
    stock: 19,
    featured: true,
  },
];
