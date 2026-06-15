import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Upload, 
  Heart, 
  Sparkles, 
  Check, 
  X, 
  Smartphone, 
  Coffee, 
  Scissors, 
  Grid, 
  ArrowRight,
  Printer,
  Gem,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Product Interface
export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'tshirt' | 'cup' | 'cover' | 'chain';
  gender?: 'boys' | 'girls' | 'unisex';
  image: string; // fallback preview image or template graphic representation
  description: string;
  colors: string[];
  isBestseller?: boolean;
}

// Cart Item Interface
export interface CartItem {
  cartId: string;
  id: string;
  name: string;
  price: number;
  category: 'tshirt' | 'cup' | 'cover' | 'chain';
  gender?: 'boys' | 'girls' | 'unisex';
  size?: string;
  phoneModel?: string;
  customImage?: string; // pre-made pattern or custom uploaded base64 / ObjectURL
  color: string;
  quantity: number;
  customText?: string;
}

export default function ShopSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'tshirt' | 'cup' | 'cover' | 'chain'>('all');
  const [activeGender, setActiveGender] = useState<'all' | 'boys' | 'girls'>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Custom Customizer State
  const [customCategory, setCustomCategory] = useState<'tshirt' | 'cup' | 'cover' | 'chain'>('tshirt');
  const [customColor, setCustomColor] = useState<string>('#ffffff'); // Default white
  const [customImage, setCustomImage] = useState<string>(''); // Loaded data or ObjectURL
  const [customSize, setCustomSize] = useState<string>('L');
  const [customPhoneModel, setCustomPhoneModel] = useState<string>('iPhone 15 Pro');
  const [customGender, setCustomGender] = useState<'boys' | 'girls'>('boys');
  const [customNameText, setCustomNameText] = useState<string>('Malik');
  const [isDragging, setIsDragging] = useState(false);
  
  // Success notification / Order complete states
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<any>(null);

  // Pre-designed mockup texture presets for instant customizer application
  const designPresets = [
    { name: 'Neon Cyber Skull', url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300&auto=format&fit=crop&q=60', tag: 'Boys' },
    { name: 'Sleek Aesthetic Mono', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=60', tag: 'Boys' },
    { name: 'Cute Pastel Sakura', url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=300&auto=format&fit=crop&q=60', tag: 'Girls' },
    { name: 'Golden Retro Wave', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&auto=format&fit=crop&q=60', tag: 'Boys' },
    { name: 'Luminous Watercolor Rose', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=60', tag: 'Girls' },
    { name: 'Vintage Butterfly Sketch', url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&auto=format&fit=crop&q=60', tag: 'Girls' }
  ];

  // Raw mock database of predesigned products in shop
  const predesignedProducts: Product[] = [
    // Boys Tshirts
    {
      id: 'ts-b1',
      name: 'Cyberpunk Code Synthwave Tee',
      price: 1200,
      category: 'tshirt',
      gender: 'boys',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
      description: 'Ultra-soft combed ringspun cotton featuring a futuristic monospaced matrix print.',
      colors: ['#ffffff', '#18181b', '#3f3f46'],
      isBestseller: true
    },
    {
      id: 'ts-b2',
      name: 'Geometric Minimalist Core Tee',
      price: 1200,
      category: 'tshirt',
      gender: 'boys',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=80',
      description: 'Architectural line grid vector styling for front-end developers and tech wizards.',
      colors: ['#ffffff', '#0284c7', '#ea580c'],
    },
    // Girls Tshirts
    {
      id: 'ts-g1',
      name: 'Pastel Aura Dream Tee',
      price: 1200,
      category: 'tshirt',
      gender: 'girls',
      image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&auto=format&fit=crop&q=80',
      description: 'Eye-catching chromatic grain gradient dyed premium cotton for a perfect visual blend.',
      colors: ['#fafaf9', '#fecdd3', '#bae6fd'],
      isBestseller: true
    },
    {
      id: 'ts-g2',
      name: 'Vintage Celestial Flora Tee',
      price: 1200,
      category: 'tshirt',
      gender: 'girls',
      image: 'https://images.unsplash.com/photo-1574180045827-68118a057f0e?w=500&auto=format&fit=crop&q=80',
      description: 'Elegant retro ink sketch of wild field botanicals framed with solar orbit details.',
      colors: ['#faf5ff', '#fafaf9', '#fef3c7'],
    },
    // Printed Cups
    {
      id: 'cp-1',
      name: 'Developer Hydration Mug',
      price: 1000,
      category: 'cup',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
      description: 'Matte black ceramic coffee container complete with modular code bracket layout.',
      colors: ['#18181b', '#ffffff'],
      isBestseller: true
    },
    {
      id: 'cp-2',
      name: 'Cosmic Marble Swirl Mug',
      price: 1000,
      category: 'cup',
      image: 'https://images.unsplash.com/photo-1542556041-0cae0cd3305a?w=500&auto=format&fit=crop&q=80',
      description: 'Artistic high-temperature gloss print mimicking deep nebular obsidian curves.',
      colors: ['#d946ef', '#18181b'],
    },
    // Printed Mobile Covers
    {
      id: 'cv-1',
      name: 'Cyber Circuit Hologram Case',
      price: 1500,
      category: 'cover',
      image: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?w=500&auto=format&fit=crop&q=80',
      description: 'Mil-spec drop protection case housing an intricate copper microchip blueprint vector.',
      colors: ['#18181b', '#0369a1'],
      isBestseller: true
    },
    {
      id: 'cv-2',
      name: 'Bohemian Sand Terracotta Case',
      price: 1500,
      category: 'cover',
      image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500&auto=format&fit=crop&q=80',
      description: 'Premium soft gel texture detailing minimalistic arches in sand-stone dye colors.',
      colors: ['#e7e5e4', '#ea580c'],
    },
    // Customized Name Chains
    {
      id: 'cn-1',
      name: 'Royal Arabic Calligraphy Name Chain',
      price: 700,
      category: 'chain',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
      description: 'Traditional custom typography Arabic/Urdu script calligraphed nameplate chain, gold plated.',
      colors: ['#eab308', '#cbd5e1', '#f43f5e'],
      isBestseller: true
    },
    {
      id: 'cn-2',
      name: 'Signature High-Polish Curve Chain',
      price: 700,
      category: 'chain',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=80',
      description: 'Handwritten English script font, high-precision laser cut in solid silver or rose gold polish.',
      colors: ['#cbd5e1', '#eab308', '#f43f5e'],
    }
  ];

  // Set default customizer image to preset 1
  useEffect(() => {
    if (!customImage) {
      setCustomImage(designPresets[0].url);
    }
  }, []);

  // Retrieve cart from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aleex_studio_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Persist cart to local storage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('aleex_studio_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error(e);
    }
  };

  // Add Item to cart
  const addToCart = (product: Product, selectedColor: string, isCustom: boolean = false, customDetails?: any) => {
    const size = product.category === 'tshirt' ? (customDetails?.size || 'L') : undefined;
    const phoneModel = product.category === 'cover' ? (customDetails?.phoneModel || 'iPhone 15 Pro') : undefined;
    const gender = product.category === 'tshirt' ? (product.gender || customDetails?.gender || 'unisex') : undefined;
    const customText = product.category === 'chain' ? (customDetails?.customText || 'Malik') : undefined;
    const imgToUse = isCustom 
      ? (product.category === 'chain' 
          ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80' 
          : customImage)
      : product.image;
    
    const cartId = `${product.id}-${selectedColor}-${size || 'N'}-${phoneModel || 'N'}-${customText || 'N'}-${isCustom ? 'custom' : 'stock'}`;
    
    const existing = cart.find(item => item.cartId === cartId);
    if (existing) {
      const updated = cart.map(item => 
        item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        cartId,
        id: product.id,
        name: isCustom ? `Custom ${product.name}` : product.name,
        price: product.price,
        category: product.category,
        gender,
        size,
        phoneModel,
        customImage: imgToUse,
        color: selectedColor,
        quantity: 1,
        customText
      };
      saveCart([...cart, newItem]);
    }
    
    // Open cart drawer so user gets instant responsive feedback
    setIsCartOpen(true);
  };

  // Add custom item from Customizer
  const addCustomItemToCart = () => {
    let name = '';
    let basePrice = 1200;
    let idPrefix = '';
    
    if (customCategory === 'tshirt') {
      name = 'Bespoke Printed T-Shirt';
      basePrice = 1200;
      idPrefix = 'cust-ts';
    } else if (customCategory === 'cup') {
      name = 'Bespoke Ceramic Mug';
      basePrice = 1000;
      idPrefix = 'cust-cp';
    } else if (customCategory === 'cover') {
      name = 'Bespoke Impact Phone Case';
      basePrice = 1500;
      idPrefix = 'cust-cv';
    } else {
      name = `Bespoke Name Chain ("${customNameText}")`;
      basePrice = 700;
      idPrefix = 'cust-cn';
    }

    const mockProduct: Product = {
      id: `${idPrefix}-${Date.now()}`,
      name,
      price: basePrice,
      category: customCategory,
      gender: customCategory === 'tshirt' ? customGender : undefined,
      image: customCategory === 'chain'
        ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80'
        : customImage,
      description: customCategory === 'chain'
        ? `Engraved nameplate chain personalized with name: "${customNameText}".`
        : 'Your custom printed graphic made dynamically at Studio Print Lab.',
      colors: [customColor]
    };

    addToCart(mockProduct, customColor, true, {
      size: customSize,
      phoneModel: customPhoneModel,
      gender: customGender,
      customText: customCategory === 'chain' ? customNameText : undefined
    });
  };

  const updateQuantity = (cartId: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.cartId === cartId) {
        const nextQ = item.quantity + delta;
        return nextQ > 0 ? { ...item, quantity: nextQ } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];
    saveCart(updated);
  };

  const removeItem = (cartId: string) => {
    const updated = cart.filter(item => item.cartId !== cartId);
    saveCart(updated);
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCustomImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  // Sum calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartTax = Math.round(cartSubtotal * 0.05); // 5% sales tax
  const shippingCost = cartSubtotal > 2500 ? 0 : cart.length > 0 ? 200 : 0;
  const cartTotal = cartSubtotal + cartTax + shippingCost;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build receipt receipt
    const orderId = `WK-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderReceipt({
      orderId,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      shipping: shippingCost,
      total: cartTotal,
      time: new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit'
      }),
      date: new Date().toLocaleDateString('en-US', {
        timeZone: 'Asia/Karachi',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    });
    
    // Clear cart
    saveCart([]);
    setIsCartOpen(false);
    setShowOrderSuccess(true);
  };

  // Filter products based on active tab
  const filteredProducts = predesignedProducts.filter(p => {
    if (activeTab !== 'all' && p.category !== activeTab) return false;
    if (p.category === 'tshirt' && activeGender !== 'all' && p.gender !== activeGender) return false;
    return true;
  });

  return (
    <section id="shop" className="py-24 px-6 lg:px-12 bg-white border-t border-zinc-150 font-sans relative">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Floating Cart Button */}
        <div className="fixed bottom-6 right-6 z-40 select-none">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="w-14 h-14 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-2xl relative border border-white/10"
            title="Open Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-[10px] text-white font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                {cart.reduce((s, k) => s + k.quantity, 0)}
              </span>
            )}
          </motion.button>
        </div>

        {/* SECTION HEADER */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[12px] font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/50 px-3 py-1 rounded-full">
              WordPress eCommerce Ready
            </span>
          </div>
          <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
            Studio Print Lab
          </h2>
          <p className="text-zinc-550 max-w-xl mx-auto text-[14px] leading-relaxed">
            Customize or choose random printed merchandise built directly with hand-crafted typography, and responsive, ready-to-deploy styles.
          </p>
        </div>

        {/* DUAL MODE GRID: CUSTOM LAB ON LEFT, PRE-DESIGNED ON RIGHT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start pt-6">
          
          {/* 1. CUSTOM APPAREL & MERCHANDISE CUSTOMIZER DECK (5 COLS) */}
          <div className="xl:col-span-5 bg-zinc-50 border border-zinc-150 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Mockup Sandbox
              </span>
              <h3 className="font-poppins text-lg sm:text-xl font-bold text-zinc-950">
                Custom Print Deck
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Choose a base blank tool, drape your design, see interactive light maps, and print instantly.
              </p>
            </div>

            {/* Selector tabs for Category */}
            <div className="grid grid-cols-4 gap-1.5 bg-zinc-200/50 p-1 rounded-xl text-[11px] font-bold">
              <button 
                onClick={() => setCustomCategory('tshirt')}
                className={`py-2 px-0.5 rounded-lg text-center transition-all ${customCategory === 'tshirt' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                Shirt
              </button>
              <button 
                onClick={() => setCustomCategory('cup')}
                className={`py-2 px-0.5 rounded-lg text-center transition-all ${customCategory === 'cup' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                Mug
              </button>
              <button 
                onClick={() => setCustomCategory('cover')}
                className={`py-2 px-0.5 rounded-lg text-center transition-all ${customCategory === 'cover' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                Cover
              </button>
              <button 
                onClick={() => setCustomCategory('chain')}
                className={`py-2 px-0.5 rounded-lg text-center transition-all ${customCategory === 'chain' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                Chain 💍
              </button>
            </div>

            {/* LIVE DYNAMIC SVG MOCKUP CANVAS */}
            <div className="w-full aspect-[4/3] bg-zinc-200 border border-zinc-250 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden shadow-inner select-none">
              
              {/* Symmetrical shadow layout for physics representation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/[0.04] pointer-events-none" />
              
              {/* RENDER MOCKUP BASED ON CATEGORY */}
              {customCategory === 'tshirt' && (
                <div className="w-[190px] h-[190px] relative flex items-center justify-center transition-all duration-300">
                  {/* Styled vector Tshirt Silhouette */}
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl select-none" fill={customColor}>
                    <path d="M 50,11 C 36.4,11 25.4,19.2 25.4,19.2 L 14,14 L 5,30 L 16.5,35 L 16.5,88 L 83.5,88 L 83.5,35 L 95,30 L 86,14 L 74.6,19.2 C 74.6,19.2 63.6,11 50,11 Z" />
                    {/* Dark fold shadow line maps */}
                    <path d="M 25.4,19.2 L 16.5,35 M 74.6,19.2 L 83.5,35" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" />
                    {/* Collar curve */}
                    <path d="M 38,13.5 C 38,13.5 44,19 50,19 C 56,19 62,13.5 62,13.5" fill="#f4f4f5" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
                  </svg>
                  
                  {/* PRINT IMAGE PRINT ZONE */}
                  <div className="absolute top-[32%] left-[30%] w-[40%] h-[35%] overflow-hidden rounded flex items-center justify-center border border-dashed border-zinc-400/25 bg-black/[0.02]">
                    {customImage ? (
                      <img src={customImage} alt="Custom print overlay" className="w-full h-full object-cover rounded opacity-85 select-none" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-[8px] text-zinc-400 font-mono text-center">Place Print Graphic</span>
                    )}
                  </div>
                </div>
              )}

              {customCategory === 'cup' && (
                <div className="w-[170px] h-[170px] relative flex items-center justify-center transition-all duration-300">
                  {/* Cup Silhouette with Handle */}
                  <div className="relative w-[110px] h-[120px] bg-zinc-100 rounded-b-2xl border-x border-b border-zinc-300 shadow-2xl overflow-hidden" style={{ backgroundColor: customColor }}>
                    <div className="absolute top-0 w-full h-[12px] bg-black/5 rounded-full border border-black/10 shadow-inner" />
                    
                    {/* Curved Printable design section */}
                    <div className="absolute top-[20%] left-2.5 right-2.5 h-[65%] overflow-hidden rounded-lg border border-dashed border-zinc-400/35 flex items-center justify-center bg-black/5">
                      {customImage ? (
                        <div className="w-full h-full relative">
                          <img src={customImage} alt="Custom Cup" className="w-full h-full object-cover opacity-90 select-none" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
                        </div>
                      ) : (
                        <span className="text-[8px] text-zinc-400 font-mono text-center">Graphic Panel</span>
                      )}
                    </div>
                    {/* Symmetrical highlight reflection */}
                    <div className="absolute top-[10%] left-1.5 w-2 h-[80%] bg-white/20 rounded-full blur-[1px] pointer-events-none" />
                  </div>
                  {/* Mug Handle */}
                  <div className="absolute right-[12px] top-[40px] w-8 h-16 border-8 border-l-0 rounded-r-full shadow-md z-0" style={{ borderColor: customColor }} />
                </div>
              )}

              {customCategory === 'cover' && (
                <div className="w-[145px] h-[210px] relative flex items-center justify-center transition-all duration-300 rounded-[28px] p-2 bg-zinc-900 shadow-2xl border border-zinc-950">
                  
                  {/* Internal Phone Plate surface */}
                  <div className="w-full h-full rounded-[20px] overflow-hidden relative flex items-center justify-center" style={{ backgroundColor: customColor }}>
                    
                    {/* Camera Cutout Bump */}
                    <div className="absolute top-3 left-3 w-[42px] h-[42px] bg-zinc-950 rounded-xl border border-white/10 z-30 p-1 flex flex-wrap gap-1 items-center justify-center shadow-lg">
                      <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-white/5 shadow-inner" />
                      <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-white/5 shadow-inner" />
                      <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-white/5 shadow-inner" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                    </div>

                    {/* Full Custom Image Wrapper */}
                    {customImage ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img src={customImage} className="w-full h-full object-cover select-none" alt="Custom Case Print" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/15 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <span className="text-[9px] font-mono text-zinc-400 z-10 text-center">Design Layout Area</span>
                    )}

                    {/* Case shine highlight overlays */}
                    <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent to-white/10 skew-x-12 pointer-events-none z-20" />
                  </div>
                </div>
              )}

              {customCategory === 'chain' && (
                <div className="w-[200px] h-[180px] relative flex flex-col items-center justify-center transition-all duration-300">
                  {/* Decorative golden or silver necklace thread */}
                  <svg viewBox="0 0 100 60" className="absolute top-2 w-[85%] h-[40%] select-none overflow-visible fill-none" style={{ stroke: customColor === '#18181b' ? '#94a3b8' : customColor === '#ffffff' ? '#cbd5e1' : customColor }}>
                    {/* Top arc hanging line */}
                    <path d="M 10,0 C 10,35 90,35 90,0" strokeWidth="1.5" strokeDasharray="3,1.5" />
                    <path d="M 10,0 C 10,35 90,35 90,0" strokeWidth="0.8" opacity="0.6" stroke={customColor} />
                    {/* Ring holders */}
                    <circle cx="21" cy="23" r="1.5" fill={customColor} />
                    <circle cx="79" cy="23" r="1.5" fill={customColor} />
                  </svg>
                  
                  {/* Elegant Nameplate Body */}
                  <div 
                    className="relative px-6 py-2.5 rounded-lg shadow-xl border select-none transition-all duration-300 max-w-[170px]" 
                    style={{ 
                      backgroundColor: customColor, 
                      borderColor: customColor === '#ffffff' ? '#d4d4d8' : 'rgba(255,255,255,0.15)',
                      color: customColor === '#ffffff' ? '#18181b' : customColor === '#18181b' ? '#f4f4f5' : '#854d0e',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Shiny ambient reflections for premium material styling */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 rounded-lg pointer-events-none" />
                    
                    {/* Custom text typed with majestic elegant serif typography */}
                    <span 
                      className="font-serif text-lg font-bold tracking-tight block text-center select-text selection:bg-orange-251"
                      style={{ 
                        fontFamily: 'Playfair Display, Georgia, serif',
                        textShadow: customColor === '#18181b' ? '0 1px 2px rgba(255,255,255,0.1)' : '0 1px 2px rgba(0,0,0,0.15)'
                      }}
                    >
                      {customNameText || 'Your Name'}
                    </span>
                    
                    {/* Fine elegant heart decoration or underline for standard nameplate */}
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <div className="h-[1px] w-5" style={{ backgroundColor: 'currentColor', opacity: 0.5 }} />
                      <span className="text-[8px]">♥</span>
                      <div className="h-[1px] w-5" style={{ backgroundColor: 'currentColor', opacity: 0.5 }} />
                    </div>
                  </div>
                  
                  {/* Real visual background display */}
                  <span className="absolute bottom-1 text-[8px] uppercase tracking-widest text-zinc-400 font-bold bg-zinc-200/50 px-2 py-0.5 rounded-full select-none">
                    {customColor === '#eab308' ? '24K Gold Plated' : customColor === '#cbd5e1' ? 'Sterling Silver 925' : customColor === '#f43f5e' ? 'Rose Gold Premium' : 'Solid Metal'}
                  </span>
                </div>
              )}

              {/* Reset Design Preset button */}
              {customImage && customCategory !== 'chain' && (
                <button 
                  onClick={() => setCustomImage('')} 
                  className="absolute bottom-3 right-3 text-zinc-500 hover:text-zinc-800 text-[10px] font-bold py-1 px-2.5 bg-white border border-zinc-205 rounded-md shadow-sm transition-colors flex items-center gap-1 cursor-pointer pointer-events-auto"
                >
                  <X className="w-3 h-3 text-red-500" /> Reset Image
                </button>
              )}
            </div>

            {/* DRAG AND DROP GRAPHIC UPLOAD COMPONENT */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-4.5 text-center transition-all ${
                isDragging ? 'border-orange-500 bg-orange-50/50 scale-[1.01]' : 'border-zinc-300 bg-zinc-100/50 hover:bg-zinc-100 hover:border-zinc-400'
              }`}
            >
              <input 
                id="shop-graphic-file"
                type="file" 
                accept="image/*" 
                onChange={triggerFileSelect} 
                className="hidden" 
              />
              <label htmlFor="shop-graphic-file" className="cursor-pointer space-y-2 block select-none">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-zinc-200 mx-auto text-zinc-550">
                  <Upload className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-950">Drag custom photo / graphic here</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">or click to browse local files</p>
                </div>
              </label>
            </div>

            {/* DESIGN PRESET SHUTTLE PANEL (Random preset list for instantaneous choice) */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-1 select-none">
                <Sparkles className="w-3 h-3 text-orange-500" /> Alternate Preset Designs
              </span>
              <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-200 scrollable-x-pan">
                {designPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setCustomImage(preset.url)}
                    className={`flex-none w-[64px] h-[64px] rounded-xl overflow-hidden border-2 relative transition-all shadow-sm ${
                      customImage === preset.url ? 'border-orange-500 ring-2 ring-orange-500/20 scale-95' : 'border-zinc-200 opacity-80 hover:opacity-100 hover:scale-102'
                    }`}
                    title={`Apply ${preset.name}`}
                  >
                    <img src={preset.url} className="w-full h-full object-cover select-none" alt="" referrerPolicy="no-referrer" />
                    <span className={`absolute bottom-0 right-0 text-[7px] text-white font-extrabold px-1 rounded-tl-sm uppercase tracking-tighter ${preset.tag === 'Boys' ? 'bg-sky-500' : 'bg-rose-500'}`}>
                      {preset.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOMIZER CONFIG PANEL VARIABLES */}
            <div className="space-y-4">
              
              {/* Adaptable color choices */}
              <div className="space-y-2 text-xs font-sans">
                <span className="block font-bold text-zinc-700">
                  {customCategory === 'chain' ? 'Premium Metal Polish Plating' : 'Blank Material Base Color'}
                </span>
                <div className="flex items-center gap-2">
                  {(customCategory === 'chain' ? [
                    { value: '#eab308', label: '24K Gold Plated' },
                    { value: '#cbd5e1', label: 'Sterling Silver 925' },
                    { value: '#f43f5e', label: 'Rose Gold Premium' }
                  ] : [
                    { value: '#ffffff', label: 'Clean White' },
                    { value: '#18181b', label: 'Charcoal Black' },
                    { value: '#fed7aa', label: 'Sunset Amber' },
                    { value: '#bbf7d0', label: 'Mint Sage' },
                    { value: '#fbcfe8', label: 'Pastel Orchid' }
                  ]).map((color) => (
                    <button 
                      key={color.value}
                      onClick={() => setCustomColor(color.value)}
                      className={`w-6 h-6 rounded-full border relative transition-all flex items-center justify-center ${
                        customColor === color.value ? 'ring-2 ring-zinc-950 scale-110' : 'border-zinc-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    >
                      {customColor === color.value && (
                        <Check className={`w-3.5 h-3.5 ${color.value === '#ffffff' ? 'text-zinc-950' : 'text-white'}`} strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans">

                {/* Conditional Name engraving input if Customized Name Chain */}
                {customCategory === 'chain' && (
                  <div className="space-y-1.5 col-span-2">
                    <span className="block font-bold text-zinc-700">Engrave Customized Name Text</span>
                    <input
                      type="text"
                      maxLength={15}
                      value={customNameText}
                      onChange={(e) => {
                        setCustomNameText(e.target.value);
                        // Auto-match chain custom colors if out of boundary
                        if (customColor !== '#eab308' && customColor !== '#cbd5e1' && customColor !== '#f43f5e') {
                          setCustomColor('#eab308');
                        }
                      }}
                      className="w-full p-2.5 bg-white border border-zinc-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950 text-xs font-extrabold text-zinc-900"
                      placeholder="e.g. Aleex"
                    />
                  </div>
                )}

                {/* Conditional Variable sizing for Tshirt */}
                {customCategory === 'tshirt' && (
                  <div className="space-y-1.5 col-span-2">
                    <span className="block font-bold text-zinc-700">Apparel Size</span>
                    <div className="flex gap-1.5">
                      {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <button
                          key={size}
                          onClick={() => setCustomSize(size)}
                          className={`flex-1 py-1.5 rounded-lg font-bold border text-center transition-all ${
                            customSize === size ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-650 border-zinc-250 hover:border-zinc-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <span className="block font-bold text-zinc-700 mb-1.5">Target Mesh Fits</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCustomGender('boys')}
                          className={`flex-1 py-1 text-[10px] font-bold border rounded-md transition-all ${
                            customGender === 'boys' ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-white border-zinc-200 text-zinc-600'
                          }`}
                        >
                          Boys Profile
                        </button>
                        <button
                          onClick={() => setCustomGender('girls')}
                          className={`flex-1 py-1 text-[10px] font-bold border rounded-md transition-all ${
                            customGender === 'girls' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-zinc-200 text-zinc-600'
                          }`}
                        >
                          Girls Profile
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Phone cover model selection */}
                {customCategory === 'cover' && (
                  <div className="space-y-1.5 col-span-2">
                    <span className="block font-bold text-zinc-700">Impact Protection Phone Model</span>
                    <select
                      value={customPhoneModel}
                      onChange={(e) => setCustomPhoneModel(e.target.value)}
                      className="w-full p-2.5 bg-white border border-zinc-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950 text-xs text-zinc-700"
                    >
                      <option value="iPhone 15 Pro">iPhone 15 Pro Max</option>
                      <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                      <option value="Samsung S24 Ultra">Samsung Galaxy S24 Ultra</option>
                      <option value="Google Pixel 8 Pro">Google Pixel 8 Pro</option>
                    </select>
                  </div>
                )}

              </div>
            </div>

            {/* ACTION DISPATCH BUTTON */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={addCustomItemToCart}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all"
            >
              Add custom {customCategory} to cart <ShoppingCart className="w-4 h-4" />
            </motion.button>
          </div>

          {/* 2. CHOOSE PRE-DESIGNED READY MERCHANDISE GRID (7 COLS) */}
          <div className="xl:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-100 pb-5">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-poppins text-xl font-bold text-zinc-950 flex items-center justify-center sm:justify-start gap-2">
                  <Grid className="w-5 h-5 text-orange-600" /> Catalog Designs
                </h3>
                <p className="text-zinc-500 text-xs">
                  Instant order print products tailored perfectly for girls & boys.
                </p>
              </div>

              {/* Filtering Deck */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold select-none">
                {[
                  { id: 'all', label: 'All Premium' },
                  { id: 'tshirt', label: 'Shirts' },
                  { id: 'cup', label: 'Mugs' },
                  { id: 'cover', label: 'Covers' },
                  { id: 'chain', label: 'Chains 💍' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                    }}
                    className={`px-3.5 py-2 rounded-full border transition-all ${
                      activeTab === item.id 
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm font-bold' 
                        : 'bg-zinc-50 text-zinc-650 border-zinc-200 hover:border-zinc-350 hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SUB-GENDER FILTER FOR TSHIRTS */}
            {activeTab === 'tshirt' && (
              <div className="flex justify-center sm:justify-start items-center gap-2 mb-4 bg-zinc-50 border border-zinc-150 p-1.5 rounded-2xl w-fit">
                <span className="text-[10px] font-bold text-zinc-450 uppercase pl-3 pr-2 border-r border-zinc-200">Gender Target :</span>
                {[
                  { id: 'all', label: 'Both / All' },
                  { id: 'boys', label: 'Boys Prints 🏋️' },
                  { id: 'girls', label: 'Girls Prints 🌸' }
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGender(g.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      activeGender === g.id 
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-950'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            )}

            {/* PRODUCT GRID LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
              {filteredProducts.map((product) => {
                const isFavorite = favorites.includes(product.id);
                return (
                  <div 
                    key={product.id}
                    className="group bg-white border border-zinc-150 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                  >
                    {/* Visual Card Image Cover */}
                    <div className="h-[210px] bg-zinc-50 border-b border-zinc-100 relative overflow-hidden flex items-center justify-center p-4">
                      
                      {/* Bestseller floating patch */}
                      {product.isBestseller && (
                        <span className="absolute top-4 left-4 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 bg-orange-600 text-white rounded-full shadow-sm z-10 flex items-center gap-1 animate-pulse">
                          <Sparkles className="w-2.5 h-2.5" /> Best Seller
                        </span>
                      )}

                      {/* Favorite button */}
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-xs z-10 ${
                          isFavorite ? 'text-red-500 bg-red-50' : 'text-zinc-450 hover:text-zinc-800'
                        }`}
                        title="Add to wishlist"
                      >
                        <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>

                      {/* Large Product Photo with elegant slide transition zoom */}
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="max-h-[175px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 select-none shadow-sm"
                        referrerPolicy="no-referrer"
                      />

                      {/* Symmetrical Gender design hint banner */}
                      {product.category === 'tshirt' && (
                        <span className={`absolute bottom-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-md text-white uppercase tracking-wider ${
                          product.gender === 'boys' ? 'bg-sky-600' : 'bg-rose-500'
                        }`}>
                          {product.gender === 'boys' ? "Boys Section" : "Girls Section"}
                        </span>
                      )}
                    </div>

                    {/* Metadata Content */}
                    <div className="p-5.5 space-y-3.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-poppins text-sm font-extrabold text-zinc-950 tracking-tight leading-tight group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </h4>
                          <span className="text-sm font-bold text-zinc-950 font-mono flex-none whitespace-nowrap">
                            {product.price.toLocaleString()} Pkr
                          </span>
                        </div>
                        <p className="text-zinc-500 text-[12px] leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Config Options & Dispatch */}
                      <div className="space-y-3 pt-2.5 border-t border-zinc-100">
                        
                        {/* Selector Choice for Product Blank Color */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-zinc-400">Default Shade</span>
                          <div className="flex gap-1.5">
                            {product.colors.map((color) => (
                              <span 
                                key={color}
                                className="w-4 h-4 rounded-full border border-zinc-200 block"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Order quick submit */}
                        <button
                          onClick={() => addToCart(product, product.colors[0])}
                          className="w-full py-2 bg-zinc-950 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                        >
                          Quick Add To Cart <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* If no products are matched by active filter */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <h4 className="font-poppins text-sm font-bold text-zinc-600">No print products match this section</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">Try toggling different merchandising tab filters above.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* SHOPPING CART OVERLAY RIGHT DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Outer Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />

            {/* Main Cart Canvas */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col justify-between p-6 pointer-events-auto text-zinc-900 border-l border-zinc-150"
            >
              
              {/* CART HEADER */}
              <div className="flex justify-between items-center pb-4.5 border-b border-zinc-100 select-none">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                  <h3 className="font-poppins text-lg font-bold text-zinc-950">Your Shopping Space</h3>
                  <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-500 font-bold font-mono">
                    {cart.reduce((s, k) => s + k.quantity, 0)} items
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center transition-colors text-zinc-450 hover:text-zinc-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CART PRODUCTS LIST */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-200">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div 
                      key={item.cartId}
                      className="flex gap-4 p-4.5 bg-zinc-50 border border-zinc-150 rounded-2xl relative group hover:bg-white hover:shadow-md transition-all duration-200"
                    >
                      {/* Product Thumbnail with overlay frame preview */}
                      <div className="w-[82px] h-[82px] rounded-xl overflow-hidden bg-zinc-200 flex-none relative border border-zinc-300 flex items-center justify-center">
                        <img 
                          src={item.customImage} 
                          alt={item.name} 
                          className="w-full h-full object-cover select-none" 
                          referrerPolicy="no-referrer"
                        />
                        <span 
                          className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border border-white shadow-sm block"
                          style={{ backgroundColor: item.color }}
                          title={`Color: ${item.color}`}
                        />
                      </div>

                      {/* Content Metadata */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 block font-mono">
                            {item.category === 'tshirt' ? `${item.gender} Shirt` : item.category === 'cup' ? 'Ceramic Mug' : item.category === 'cover' ? 'Phone Cover' : 'Name Chain Overlay'}
                          </span>
                          <h4 className="font-poppins text-xs font-extrabold text-zinc-950 truncate pr-4">
                            {item.name}
                          </h4>
                          
                          {/* Configuration specs display */}
                          <div className="flex flex-wrap gap-x-2 text-[10px] text-zinc-500 font-medium">
                            {item.size && <span>Size: <strong className="text-zinc-805">{item.size}</strong></span>}
                            {item.phoneModel && <span className="truncate">Model: <strong className="text-zinc-850">{item.phoneModel}</strong></span>}
                          </div>
                        </div>

                        {/* Quantity Counter block and Prices */}
                        <div className="flex justify-between items-center pt-2.5">
                          <div className="flex items-center gap-1.5 bg-white border border-zinc-250 p-0.5 rounded-lg text-zinc-650">
                            <button 
                              onClick={() => updateQuantity(item.cartId, -1)}
                              className="p-1 hover:bg-zinc-100 rounded text-xs cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs font-bold px-1.5 text-zinc-950 select-none">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.cartId, 1)}
                              className="p-1 hover:bg-zinc-100 rounded text-xs cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-mono text-xs font-extrabold text-zinc-950">
                            {(item.price * item.quantity).toLocaleString()} Pkr
                          </span>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button 
                        onClick={() => removeItem(item.cartId)}
                        className="absolute top-3.5 right-3.5 text-zinc-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 space-y-4 select-none">
                    <div className="w-14 h-14 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-200 mx-auto text-zinc-350 shadow-sm">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-poppins text-sm font-bold text-zinc-650">Your cart is empty</h4>
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto">Explore the catalog designs or build bespoke prints in mockup space.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CART CHECKOUT CALC BOARD */}
              <div className="pt-5 border-t border-zinc-100 space-y-4 select-none">
                
                <div className="space-y-2 text-xs text-zinc-550">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-zinc-800">{cartSubtotal.toLocaleString()} Pkr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales Tax (5%)</span>
                    <span className="font-mono text-zinc-800">{cartTax.toLocaleString()} Pkr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping fee</span>
                    <span className="font-mono text-zinc-800">
                      {shippingCost === 0 ? <strong className="text-green-600 uppercase text-[10px]">Free shipping</strong> : `${shippingCost.toLocaleString()} Pkr`}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <span className="text-[10px] text-zinc-400 block text-right">Add {(2500 - cartSubtotal).toLocaleString()} Pkr more to qualify for FREE Shipping!</span>
                  )}
                  <div className="flex justify-between pt-2 border-t border-zinc-105 font-poppins text-sm font-black text-zinc-950">
                    <span>Est. Total Amount</span>
                    <span className="font-mono text-base font-extrabold text-orange-600">{cartTotal.toLocaleString()} Pkr</span>
                  </div>
                </div>

                {/* Simulated Checkout Form */}
                {cart.length > 0 ? (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        required 
                        placeholder="Shipping Address (Simulated)" 
                        className="w-full text-xs p-2.5 border border-zinc-250 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-950"
                      />
                      <input 
                        type="email" 
                        required 
                        placeholder="Your Delivery Notification Email" 
                        className="w-full text-xs p-2.5 border border-zinc-250 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-950"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-zinc-950 text-white font-extrabold rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg cursor-pointer"
                    >
                      Checkout Order Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-zinc-200 text-zinc-400 font-bold rounded-xl text-xs uppercase tracking-widest cursor-not-allowed select-none"
                  >
                    Add Items to unlock Checkout
                  </button>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* BILLING / ORDER SUCCESS DIALOG MODAL */}
      <AnimatePresence>
        {showOrderSuccess && orderReceipt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl overflow-hidden max-w-[500px] w-full border border-zinc-100 shadow-2xl p-6.5 text-zinc-900 flex flex-col space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 select-none">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                    ✓
                  </span>
                  <div>
                    <h3 className="font-poppins text-md font-bold text-zinc-950">Print Order Approved!</h3>
                    <p className="text-[10px] text-zinc-400">Order Ref: {orderReceipt.orderId}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowOrderSuccess(false)}
                  className="p-1 h-8 w-8 hover:bg-zinc-150 rounded-full flex items-center justify-center font-bold transition-colors text-zinc-500 hover:text-black cursor-pointer select-none"
                >
                  &times;
                </button>
              </div>

              {/* RECEIPT PAPER GRAPHIC */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4.5 font-mono text-xs select-text space-y-3 shadow-inner">
                <div className="text-center border-b border-dashed border-zinc-300 pb-3.5 space-y-1 select-none">
                  <h4 className="font-poppins font-black text-xs uppercase tracking-widest">Aleex STUDIO</h4>
                  <p className="text-[9px] text-zinc-400">Fiverr Custom Print Merchandising</p>
                  <p className="text-[9.5px] text-zinc-550 mt-1">{orderReceipt.date} • {orderReceipt.time} PKT</p>
                </div>

                {/* Items column */}
                <div className="space-y-2 border-b border-dashed border-zinc-350 pb-3.5">
                  <span className="text-[10px] font-bold text-zinc-400 block select-none uppercase tracking-wider">Ordered items :</span>
                  {orderReceipt.items.map((it: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-[11px] leading-tight flex-nowrap items-baseline animate-fade-in">
                      <span className="line-clamp-2 pr-4">{it.quantity}x {it.name} {it.size ? `(${it.size})` : it.phoneModel ? `(${it.phoneModel})` : ''}</span>
                      <span className="font-bold whitespace-nowrap">{Math.round(it.price * it.quantity).toLocaleString()} Pkr</span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-1 text-[11.5px] pt-1 pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">{Math.round(orderReceipt.subtotal).toLocaleString()} Pkr</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-[10.5px]">
                    <span>Sales Tax (5%)</span>
                    <span>{Math.round(orderReceipt.tax).toLocaleString()} Pkr</span>
                  </div>
                  <div className="flex justify-between text-zinc-505 text-[10.5px]">
                    <span>Shipping Post</span>
                    <span>{orderReceipt.shipping === 0 ? 'FREE' : `${Math.round(orderReceipt.shipping).toLocaleString()} Pkr`}</span>
                  </div>
                  <div className="flex justify-between text-[13px] pt-2 border-t border-zinc-350 text-zinc-950 font-black">
                    <span>TOTAL AMOUNT</span>
                    <span className="text-orange-600 font-bold">{Math.round(orderReceipt.total).toLocaleString()} Pkr</span>
                  </div>
                </div>

                {/* Success Message */}
                <p className="text-[9px] text-zinc-400 text-center select-none pt-4 italic leading-snug">
                  Thank you for placing order with Waleed Khan. We will generate the high-comfy prints and dispatch to your simulated desk immediately!
                </p>
              </div>

              {/* Action Close */}
              <button
                onClick={() => {
                  setShowOrderSuccess(false);
                  window.print(); // Fun integration to actually summon printer!
                }}
                className="w-full py-3 bg-zinc-950 text-white font-extrabold rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-900 transition-colors shadow-md cursor-pointer select-none"
              >
                Print Invoice <Printer className="w-4 h-4" />
              </button>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
