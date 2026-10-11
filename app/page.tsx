"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { 
  Menu, X, Globe, MapPin, Phone, MessageCircle, Lock, 
  Edit, Trash2, Plus, LogOut, ChevronRight, Sparkles, UploadCloud,
  Image as ImageIcon, Map, ShieldCheck, Video, Type, User, XCircle
} from "lucide-react";

// --- SUPABASE SETUP (SAFE VERSION) ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fallback SVGs
const FALLBACK_IMG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%232A0813"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="24" fill="%23D4AF37">Sikarwar Image</text></svg>`;
const ABOUT_IMG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231a050b"/><path d="M400 100 L600 500 L200 500 Z" fill="none" stroke="%23D4AF37" stroke-width="2" opacity="0.5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="28" fill="%23D4AF37">Heritage Photo</text></svg>`;

export default function SikarwarWebsite() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [lang, setLang] = useState<"HI" | "EN">("HI");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<"home" | "chains" | "jewellery" | "about" | "contact" | "admin">("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Admin Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminTab, setAdminTab] = useState<"products" | "homeConfig" | "aboutConfig" | "business" | "brand">("products");
  
  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ code: "", nameEN: "", nameHI: "", category: "Pata Chain", image: "" });

  // CMS State
  const [brand, setBrand] = useState({
    logoLetter: "S",
    logoText: "SIKARWAR",
    whatsappNumber: "919009331816",
    footerTextEN: "Crafting trust and elegance for generations in the heart of Gwalior.",
    footerTextHI: "ग्वालियर के हृदय में पीढ़ियों से विश्वास और लालित्य गढ़ रहे हैं।"
  });

  const [hero, setHero] = useState({
    mediaType: "image" as "image" | "video",
    mediaSrc: FALLBACK_IMG,
    headingEN: "Crafted in Gold. Chosen for Generations.",
    headingHI: "सोने की शान, पीढ़ियों की पहचान।",
    subEN: "Explore distinctive gold machine chains, hollow chains, and bespoke handcrafted gold jewellery.",
    subHI: "मशीन चेन, होलो चेन और सोने के आभूषणों के आकर्षक डिज़ाइन — ऑर्डर पर तैयार किए जाते हैं।"
  });

  const [featuredSlots, setFeaturedSlots] = useState([
    { id: 1, titleEN: "Pata Chain", titleHI: "पटा चेन", image: FALLBACK_IMG, link: "chains" },
    { id: 2, titleEN: "Karb Chain", titleHI: "करब चेन", image: FALLBACK_IMG, link: "chains" },
    { id: 3, titleEN: "Shahenshah", titleHI: "शहंशाह", image: FALLBACK_IMG, link: "chains" },
    { id: 4, titleEN: "Gold Jewellery", titleHI: "स्वर्ण आभूषण", image: FALLBACK_IMG, link: "jewellery" }
  ]);

  const [about, setAbout] = useState({
    titleEN: "Our Heritage & Legacy",
    titleHI: "हमारी विरासत और परंपरा",
    p1EN: "Located in the historic heart of Gwalior at Dana Oli, Lashkar, Sikarwar Chain and Jewellers represents generations of unwavering trust and pure craftsmanship.",
    p1HI: "ग्वालियर के ऐतिहासिक दाना ओली, लश्कर में स्थित, सिकरवार चेन और ज्वेलर्स पीढ़ियों के अटूट विश्वास और शुद्ध शिल्प कौशल का प्रतिनिधित्व करता है।",
    p2EN: "We specialize in the finest machine chains, hollow chains, and bespoke handcrafted gold jewellery. Every piece is a testament to our dedication to quality, designed to be passed down through generations.",
    p2HI: "हम बेहतरीन मशीन चेन, होलो चेन और ऑर्डर पर तैयार किए जाने वाले प्रीमियम स्वर्ण आभूषणों के विशेषज्ञ हैं। हमारा हर आभूषण गुणवत्ता के प्रति हमारी प्रतिबद्धता का प्रमाण है।",
    proprietorTitleEN: "Founder & Proprietor",
    proprietorTitleHI: "संस्थापक एवं संचालक",
    proprietorNameEN: "Shri Narsingh Sikarwar",
    proprietorNameHI: "श्री नरसिंह सिकरवार",
    proprietorSubEN: "(Morena Wale)",
    proprietorSubHI: "(मुरैना वाले)",
    image: ABOUT_IMG
  });

  const [business, setBusiness] = useState({
    phone1: "+91 9009331816",
    phone2: "+91 6260498762",
    addressEN: "Sikarwar House, Dana Oli, Lashkar, Gwalior, Madhya Pradesh - 474001",
    addressHI: "सिकरवार हाउस, दाना ओली, लश्कर, ग्वालियर, मध्य प्रदेश - 474001",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14324.965416047248!2d78.156172!3d26.208381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c6aebdb2d39b%3A0x6a05d6c5bb5d2b0e!2sLashkar%2C%20Gwalior%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000"
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- DATABASE FUNCTIONS ---
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (data) {
      const formatted = data.map(item => ({
        id: item.id,
        code: item.code,
        nameEN: item.name_en,
        nameHI: item.name_hi,
        category: item.category,
        image: item.image
      }));
      setProducts(formatted);
    }
  };

  useEffect(() => {
    fetchProducts();
    const timer = setTimeout(() => setIsAppLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNav = (page: string) => {
    setActivePage(page as any);
    setIsMenuOpen(false);
    setSelectedCategory("All");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim() === "anuragsikarwar703@gmail.com" && loginPassword === "Anurag@2011") {
      setIsAuthenticated(true); setLoginError("");
    } else {
      setLoginError("Invalid admin credentials.");
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "product" | "hero" | "about" | number) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith("video/");
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === "product") setFormData({ ...formData, image: reader.result as string });
        else if (target === "hero") setHero({ ...hero, mediaType: isVideo ? "video" : "image", mediaSrc: reader.result as string });
        else if (target === "about") setAbout({ ...about, image: reader.result as string });
        else if (typeof target === "number") {
          const newSlots = [...featuredSlots];
          newSlots[target].image = reader.result as string;
          setFeaturedSlots(newSlots);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = formData.image.trim() !== "" ? formData.image : FALLBACK_IMG;
    
    if (editingId) {
      await supabase.from('products').update({
        code: formData.code,
        name_en: formData.nameEN,
        name_hi: formData.nameHI,
        category: formData.category,
        image: finalImage
      }).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('products').insert([{
        id: Date.now().toString(),
        code: formData.code,
        name_en: formData.nameEN,
        name_hi: formData.nameHI,
        category: formData.category,
        image: finalImage
      }]);
    }
    
    setFormData({ code: "", nameEN: "", nameHI: "", category: "Pata Chain", image: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({ code: product.code, nameEN: product.nameEN, nameHI: product.nameHI, category: product.category, image: product.image });
    setAdminTab("products");
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const getWhatsAppUrl = () => {
    const cleanPhone = brand.whatsappNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=Namaste, I have an enquiry from your website.`;
  };

  if (isAppLoading) return (
    <div className="fixed inset-0 bg-[#2A0813] flex flex-col items-center justify-center z-50">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-4">
        <Sparkles className="text-[#D4AF37] mx-auto mb-6 animate-pulse" size={32} />
        <h1 className="text-3xl md:text-5xl font-serif text-[#D4AF37] tracking-[0.2em] font-bold">{brand.logoText}</h1>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] font-sans selection:bg-[#D4AF37] selection:text-white flex flex-col">
      <header className="fixed top-0 w-full z-40 bg-[#2A0813]/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav("home")}>
            <div className="w-10 h-10 border border-[#D4AF37]/60 rounded-full flex items-center justify-center bg-[#2A0813]">
              <span className="text-[#D4AF37] font-serif font-bold text-lg">{brand.logoLetter}</span>
            </div>
            <span className="text-xl md:text-2xl font-serif font-bold text-[#F5F5DC] tracking-wider">{brand.logoText}</span>
          </div>

          <div className="flex items-center gap-5">
            <button onClick={() => setLang(lang === "HI" ? "EN" : "HI")} className="flex items-center gap-2 text-xs font-bold text-[#F5F5DC] border border-[#D4AF37]/40 px-3 py-1.5 rounded-full hover:bg-[#D4AF37]/10">
              <Globe size={15} className="text-[#D4AF37]" /> {lang === "HI" ? "EN" : "हिन्दी"}
            </button>
            <button onClick={() => setIsMenuOpen(true)} className="text-[#F5F5DC] hover:text-[#D4AF37] p-2"><Menu size={28} /></button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: "-100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "-100%" }} transition={{ type: "tween", duration: 0.4 }} className="fixed inset-0 z-50 bg-[#2A0813] flex flex-col justify-center items-center px-6">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-[#D4AF37] p-3 rounded-full border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10"><X size={32} /></button>
            <nav className="flex flex-col items-center gap-6 text-2xl font-serif text-[#F5F5DC] w-full max-w-md">
              {[{id: "home", en: "Home", hi: "होम पेज"}, {id: "chains", en: "Chains", hi: "चेन कलेक्शन"}, {id: "jewellery", en: "Jewellery", hi: "स्वर्ण आभूषण"}, {id: "about", en: "About Us", hi: "हमारे बारे में"}, {id: "contact", en: "Contact", hi: "संपर्क"}].map(item => (
                <button key={item.id} onClick={() => handleNav(item.id)} className={`w-full py-2 border-b border-[#D4AF37]/10 hover:text-[#D4AF37] ${activePage === item.id ? "text-[#D4AF37]" : ""}`}>{lang === "EN" ? item.en : item.hi}</button>
              ))}
              <button onClick={() => handleNav("admin")} className="mt-6 flex items-center justify-center gap-3 text-base text-[#D4AF37] border border-[#D4AF37]/40 px-8 py-3 rounded-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 w-full"><Lock size={18} /> Admin Panel</button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row relative">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-white/50 hover:bg-white p-2 rounded-full text-black z-10">
                <XCircle size={24} />
              </button>
              <div className="md:w-1/2 h-64 md:h-[500px] bg-[#1a050b]">
                <img src={selectedProduct.image || FALLBACK_IMG} alt={selectedProduct.nameEN} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center bg-[#FAFAFA]">
                <p className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase mb-2">{selectedProduct.category}</p>
                <h3 className="text-3xl font-serif text-[#2A0813] mb-2">{lang === "EN" ? selectedProduct.nameEN : selectedProduct.nameHI}</h3>
                <p className="text-gray-500 mb-6">Code: {selectedProduct.code}</p>
                <div className="w-16 h-[2px] bg-[#D4AF37] mb-6" />
                <p className="text-gray-700 mb-8">
                  {lang === "EN" 
                    ? "Interested in this design? Contact us directly on WhatsApp to inquire about weight, pricing, and availability."
                    : "क्या आप इस डिज़ाइन में रुचि रखते हैं? वजन, मूल्य और उपलब्धता के बारे में पूछताछ करने के लिए हमसे सीधे व्हाट्सएप पर संपर्क करें।"}
                </p>
                <a href={`https://wa.me/${brand.whatsappNumber.replace(/\D/g, '')}?text=Hello, I am interested in ${selectedProduct.code} - ${selectedProduct.nameEN}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white flex items-center justify-center gap-3 py-4 rounded-lg font-bold hover:bg-[#1DA851] transition-colors">
                  <MessageCircle size={20} /> {lang === "EN" ? "Inquire on WhatsApp" : "व्हाट्सएप पर पूछताछ करें"}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"><MessageCircle size={30} /></a>

      <main className="pt-20 flex-grow">
        {activePage === "home" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <section className="relative min-h-[88vh] bg-[#2A0813] flex flex-col md:flex-row items-center justify-between overflow-hidden">
              <div className="w-full md:w-1/2 p-8 md:p-16 z-10 flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F5F5DC] mb-6 leading-tight drop-shadow-lg">{lang === "EN" ? hero.headingEN : hero.headingHI}</h2>
                <p className="text-lg md:text-xl text-[#F5F5DC]/80 font-light mb-10 max-w-xl">{lang === "EN" ? hero.subEN : hero.subHI}</p>
                <button onClick={() => handleNav("chains")} className="w-fit bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#2A0813] font-bold px-8 py-4 rounded-sm text-sm uppercase hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-shadow">
                  {lang === "EN" ? "Explore Collection" : "कलेक्शन देखें"}
                </button>
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center z-10">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative bg-gradient-to-tr from-black/80 to-[#2A0813] p-4 rounded-2xl border border-[#D4AF37]/40 shadow-2xl max-w-md w-full">
                  <div className="overflow-hidden rounded-xl h-[340px] md:h-[420px] bg-[#1a050b]">
                    {hero.mediaType === "video" ? (
                      <video src={hero.mediaSrc} autoPlay loop muted playsInline className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <img src={hero.mediaSrc} alt="Sikarwar Hero" className="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform duration-700" onError={e => e.currentTarget.src = FALLBACK_IMG} />
                    )}
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-6 w-full">
              <div className="text-center mb-16">
                <h3 className="text-3xl md:text-4xl font-serif text-[#2A0813] mb-4">{lang === "EN" ? "Specialized Collections" : "प्रमुख श्रेणियां"}</h3>
                <div className="w-20 h-1 bg-[#D4AF37] mx-auto" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featuredSlots.map((slot, idx) => (
                  <div key={idx} onClick={() => handleNav(slot.link)} className="group bg-white border border-[#D4AF37]/20 p-4 rounded-xl shadow-sm cursor-pointer text-center hover:shadow-xl transition-all">
                    <div className="h-40 rounded-lg overflow-hidden mb-4 bg-[#2A0813]">
                      <img src={slot.image} alt={slot.titleEN} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={e => e.currentTarget.src = FALLBACK_IMG}/>
                    </div>
                    <h4 className="font-serif font-bold text-[#2A0813] text-lg group-hover:text-[#D4AF37] transition-colors">{lang === "EN" ? slot.titleEN : slot.titleHI}</h4>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {["chains", "jewellery"].includes(activePage) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-3xl md:text-5xl font-serif text-[#2A0813] mb-8">{activePage === "chains" ? (lang === "EN" ? "Chain Collection" : "चेन कलेक्शन") : (lang === "EN" ? "Gold Jewellery" : "स्वर्ण आभूषण")}</h2>
            
            {activePage === "chains" && (
              <div className="flex flex-wrap gap-3 mb-10 border-b border-gray-200 pb-4">
                {["All", "Pata Chain", "Karb Chain", "Shahenshah Chain", "Box Chain", "Hollow Chain"].map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-sm px-4 py-2 rounded-full border transition-colors ${selectedCategory === cat ? "bg-[#2A0813] text-[#D4AF37] border-[#2A0813]" : "bg-white text-gray-700 hover:border-[#D4AF37]"}`}>{cat}</button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.filter(p => activePage === "chains" ? (p.category !== "Gold Jewellery" && (selectedCategory === "All" || p.category === selectedCategory)) : p.category === "Gold Jewellery").map(product => (
                <div key={product.id} onClick={() => setSelectedProduct(product)} className="bg-white border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between group cursor-pointer">
                  <div className="relative h-72 bg-[#1a050b] overflow-hidden">
                    <span className="absolute top-3 left-3 bg-[#2A0813] text-[#D4AF37] text-xs px-3 py-1 rounded shadow z-10">{product.code}</span>
                    <img src={product.image} alt={product.nameEN} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => e.currentTarget.src = FALLBACK_IMG} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif text-[#2A0813] mb-1">{lang === "EN" ? product.nameEN : product.nameHI}</h3>
                    <p className="text-sm text-[#D4AF37] font-medium">{product.category}</p>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p className="text-gray-500">No products available yet. Add some from the Admin panel.</p>}
            </div>
          </motion.div>
        )}

        {activePage === "about" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-[#2A0813] mb-4">{lang === "EN" ? about.titleEN : about.titleHI}</h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>{lang === "EN" ? about.p1EN : about.p1HI}</p>
                <p>{lang === "EN" ? about.p2EN : about.p2HI}</p>
                <div className="pt-6 border-t border-[#D4AF37]/30">
                  <ul className="space-y-2 font-medium">
                    <li className="flex items-center gap-2"><ShieldCheck className="text-[#D4AF37]" size={20}/> 100% Authenticity Guaranteed</li>
                    <li className="flex items-center gap-2"><ShieldCheck className="text-[#D4AF37]" size={20}/> Heritage Craftsmanship</li>
                  </ul>
                </div>
              </div>
              <div className="h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/30">
                <img src={about.image} alt="Heritage" className="w-full h-full object-cover" onError={e => e.currentTarget.src = FALLBACK_IMG} />
              </div>
            </div>
            <div className="bg-[#2A0813] text-[#F5F5DC] p-12 rounded-3xl text-center max-w-3xl mx-auto shadow-2xl border border-[#D4AF37]/40 relative overflow-hidden">
              <p className="text-sm uppercase tracking-widest text-[#D4AF37] mb-3 font-bold">{lang === "EN" ? about.proprietorTitleEN : about.proprietorTitleHI}</p>
              <h3 className="text-4xl font-serif mb-2">{lang === "EN" ? about.proprietorNameEN : about.proprietorNameHI}</h3>
              <p className="text-xl text-[#D4AF37] italic opacity-90">{lang === "EN" ? about.proprietorSubEN : about.proprietorSubHI}</p>
            </div>
          </motion.div>
        )}

        {activePage === "contact" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-3xl md:text-5xl font-serif text-[#2A0813] mb-12 text-center">{lang === "EN" ? "Contact & Location" : "संपर्क एवं स्थान"}</h2>
            <div className="grid md:grid-cols-5 gap-10">
              <div className="md:col-span-2 bg-white p-8 border border-[#D4AF37]/30 rounded-2xl shadow-xl h-fit">
                <h3 className="text-2xl font-serif text-[#2A0813] mb-8 border-b pb-4">{lang === "EN" ? "Get In Touch" : "हमसे संपर्क करें"}</h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="bg-[#2A0813] p-3 rounded-full text-[#D4AF37] h-fit"><MapPin size={24}/></div>
                    <div>
                      <p className="font-bold text-[#2A0813] mb-1">{lang === "EN" ? "Address" : "पता"}</p>
                      <p className="text-gray-600 leading-relaxed">{lang === "EN" ? business.addressEN : business.addressHI}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-[#2A0813] p-3 rounded-full text-[#D4AF37] h-fit"><Phone size={24}/></div>
                    <div>
                      <p className="font-bold text-[#2A0813] mb-1">{lang === "EN" ? "Phone" : "फ़ोन"}</p>
                      <p className="text-gray-600">{business.phone1}<br/>{business.phone2}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 h-[500px] bg-gray-100 rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/30">
                <iframe src={business.mapUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Map"/>
              </div>
            </div>
          </motion.div>
        )}

        {activePage === "admin" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-12">
            {!isAuthenticated ? (
              <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-[#D4AF37]/30 text-center">
                <Lock size={48} className="text-[#D4AF37] mx-auto mb-4" />
                <h2 className="text-3xl font-serif text-[#2A0813] mb-6">CMS Dashboard</h2>
                {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                  <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="Admin Email" required />
                  <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="Password" required />
                  <button type="submit" className="w-full bg-[#2A0813] text-[#D4AF37] py-4 rounded-lg font-bold">Access CMS</button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                  <div className="bg-[#2A0813] p-4 rounded-xl mb-4 text-center"><ShieldCheck className="text-[#D4AF37] mx-auto mb-2" size={24} /><h3 className="text-[#F5F5DC] font-serif">Site CMS</h3></div>
                  <button onClick={() => setAdminTab("products")} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold ${adminTab === "products" ? "bg-[#D4AF37] text-[#2A0813]" : "bg-white border"}`}><Sparkles size={18} /> Manage Inventory</button>
                  <button onClick={() => setAdminTab("homeConfig")} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold ${adminTab === "homeConfig" ? "bg-[#D4AF37] text-[#2A0813]" : "bg-white border"}`}><ImageIcon size={18} /> Homepage Setup</button>
                  <button onClick={() => setAdminTab("aboutConfig")} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold ${adminTab === "aboutConfig" ? "bg-[#D4AF37] text-[#2A0813]" : "bg-white border"}`}><User size={18} /> About Page Setup</button>

<Map size={18} />
<button onClick={() => setAdminTab("business")} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold ${adminTab === "business" ? "bg-[#D4AF37] text-[#2A0813]" : "bg-white border"}`}> Map & Contact</button>
                  <button onClick={() => setAdminTab("brand")} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold ${adminTab === "brand" ? "bg-[#D4AF37] text-[#2A0813]" : "bg-white border"}`}><Type size={18} /> Brand & Global Links</button>
                  <button onClick={() => setIsAuthenticated(false)} className="mt-8 p-3 rounded-lg font-bold text-red-600 bg-red-50 border border-red-100 flex justify-center gap-2"><LogOut size={18} /> Logout</button>
                </div>

                <div className="flex-grow bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                  {adminTab === "products" && (
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-bold mb-4">{editingId ? "Edit Product" : "Add Product"}</h3>
                        <form onSubmit={handleSaveProduct} className="space-y-4">
                          <input type="text" placeholder="Design Code" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full border p-2 rounded"/>
                          <input type="text" placeholder="Name (EN)" required value={formData.nameEN} onChange={e => setFormData({...formData, nameEN: e.target.value})} className="w-full border p-2 rounded"/>
                          <input type="text" placeholder="Name (HI)" required value={formData.nameHI} onChange={e => setFormData({...formData, nameHI: e.target.value})} className="w-full border p-2 rounded"/>
                          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border p-2 rounded bg-white">
                            <option>Pata Chain</option><option>Karb Chain</option><option>Shahenshah Chain</option><option>Box Chain</option><option>Hollow Chain</option><option>Gold Jewellery</option>
                          </select>
                          <div className="border-2 border-dashed p-4 text-center cursor-pointer bg-gray-50">
                            <label className="cursor-pointer text-sm font-bold text-gray-500">
                              Upload Image
                              <input type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, "product")} className="hidden" ref={fileInputRef} />
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-[#2A0813] text-[#D4AF37] py-2 rounded font-bold">{editingId ? "Update" : "Save to Database"}</button>
                            {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({code: "", nameEN: "", nameHI: "", category: "Pata Chain", image: ""});}} className="px-4 bg-gray-200 rounded font-bold">Cancel</button>}
                          </div>
                        </form>
                      </div>
                      <div className="max-h-[600px] overflow-y-auto pr-2">
                         <h3 className="text-xl font-bold mb-4">Inventory ({products.length})</h3>
                         {products.map(p => (
                           <div key={p.id} className="flex justify-between p-3 border rounded mb-2 items-center">
                             <div className="flex gap-3">
                               <img src={p.image} className="w-12 h-12 rounded object-cover" alt="" />
                               <div><p className="font-bold text-sm">{p.nameEN}</p><p className="text-xs text-gray-500">{p.code}</p></div>
                             </div>
                             <div className="flex gap-2">
                               <button onClick={() => handleEdit(p)} className="text-blue-500 p-2 hover:bg-blue-50 rounded"><Edit size={16}/></button>
                               <button onClick={() => handleDelete(p.id)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                             </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}

                  {adminTab === "homeConfig" && (
                    <div className="space-y-10">
                      <div>
                        <h3 className="text-2xl font-serif text-[#2A0813] mb-4 border-b pb-2">Hero Section (Top of website)</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div><label className="text-xs font-bold text-gray-500">Heading (EN)</label><input type="text" value={hero.headingEN} onChange={e => setHero({...hero, headingEN: e.target.value})} className="w-full border p-2 rounded"/></div>
                            <div><label className="text-xs font-bold text-gray-500">Heading (HI)</label><input type="text" value={hero.headingHI} onChange={e => setHero({...hero, headingHI: e.target.value})} className="w-full border p-2 rounded"/></div>
                            <div><label className="text-xs font-bold text-gray-500">Subtext (EN)</label><textarea rows={2} value={hero.subEN} onChange={e => setHero({...hero, subEN: e.target.value})} className="w-full border p-2 rounded"/></div>
                            <div className="border p-4 bg-gray-50 rounded text-center">
                              <label className="cursor-pointer text-sm font-bold flex flex-col items-center gap-2 text-[#2A0813]">
                                <Video size={24}/> Upload Image or Video (MP4) for Hero
                                <input type="file" accept="image/*,video/mp4" onChange={(e) => handleMediaUpload(e, "hero")} className="hidden" />
                              </label>
                            </div>
                          </div>
                          <div className="bg-black rounded-lg aspect-square relative overflow-hidden flex items-center justify-center border-4 border-[#D4AF37]/50">
                            {hero.mediaType === "video" ? <video src={hero.mediaSrc} autoPlay loop muted className="w-full h-full object-cover opacity-70" /> : <img src={hero.mediaSrc} className="w-full h-full object-cover opacity-70" alt=""/>}
                            <h3 className="absolute text-[#F5F5DC] font-serif text-center px-4 text-2xl">{hero.headingEN}</h3>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-serif text-[#2A0813] mb-4 border-b pb-2">Featured Collection Slots (Homepage Grid)</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {featuredSlots.map((slot, idx) => (
                            <div key={idx} className="border p-4 rounded-lg space-y-3 bg-gray-50">
                              <h4 className="font-bold text-sm">Slot {idx + 1}</h4>
                              <input type="text" value={slot.titleEN} onChange={e => {const s=[...featuredSlots]; s[idx].titleEN=e.target.value; setFeaturedSlots(s)}} className="w-full border p-2 rounded text-sm" placeholder="Title EN"/>
                              <input type="text" value={slot.titleHI} onChange={e => {const s=[...featuredSlots]; s[idx].titleHI=e.target.value; setFeaturedSlots(s)}} className="w-full border p-2 rounded text-sm" placeholder="Title HI"/>
                              <select value={slot.link} onChange={e => {const s=[...featuredSlots]; s[idx].link=e.target.value; setFeaturedSlots(s)}} className="w-full border p-2 rounded text-sm bg-white">
                                <option value="chains">Link to Chains</option><option value="jewellery">Link to Jewellery</option>
                              </select>
                              <label className="block w-full text-center bg-gray-200 py-2 rounded text-xs font-bold cursor-pointer hover:bg-gray-300">
                                Change Image <input type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, idx)} className="hidden" />
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {adminTab === "aboutConfig" && (
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-serif text-[#2A0813] mb-4 border-b pb-2">Edit Heritage Story</h3>
                        <div><label className="text-xs font-bold text-gray-500">Page Title (EN)</label><input type="text" value={about.titleEN} onChange={e => setAbout({...about, titleEN: e.target.value})} className="w-full border p-2 rounded"/></div>
                        <div><label className="text-xs font-bold text-gray-500">Paragraph 1 (EN)</label><textarea rows={3} value={about.p1EN} onChange={e => setAbout({...about, p1EN: e.target.value})} className="w-full border p-2 rounded"/></div>
                        <div><label className="text-xs font-bold text-gray-500">Paragraph 2 (EN)</label><textarea rows={3} value={about.p2EN} onChange={e => setAbout({...about, p2EN: e.target.value})} className="w-full border p-2 rounded"/></div>
                        
                        <h3 className="text-xl font-serif text-[#2A0813] mt-6 border-b pb-2">Proprietor Details</h3>
                        <div><label className="text-xs font-bold text-gray-500">Name (EN)</label><input type="text" value={about.proprietorNameEN} onChange={e => setAbout({...about, proprietorNameEN: e.target.value})} className="w-full border p-2 rounded"/></div>
                        <div><label className="text-xs font-bold text-gray-500">Subtitle (EN)</label><input type="text" value={about.proprietorSubEN} onChange={e => setAbout({...about, proprietorSubEN: e.target.value})} className="w-full border p-2 rounded"/></div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-serif text-[#2A0813] mb-4 border-b pb-2">About Page Image</h3>
                        <img src={about.image} alt="About" className="w-full rounded-lg mb-4 shadow" />
                        <label className="block w-full text-center bg-[#2A0813] text-[#D4AF37] py-3 rounded font-bold cursor-pointer hover:bg-black">
                          Upload New Heritage Image <input type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, "about")} className="hidden" />
                        </label>
                      </div>
                    </div>
                  )}

                  {adminTab === "business" && (
                    <div className="max-w-2xl space-y-4">
                      <h3 className="text-2xl font-serif text-[#2A0813] mb-4 border-b pb-2">Map & Contact Details</h3>
                      <div><label className="text-xs font-bold text-gray-500">Google Maps Embed URL</label><input type="text" value={business.mapUrl} onChange={e => setBusiness({...business, mapUrl: e.target.value})} className="w-full border p-2 rounded font-mono text-xs bg-gray-50"/></div>
                      <div><label className="text-xs font-bold text-gray-500">Phone 1</label><input type="text" value={business.phone1} onChange={e => setBusiness({...business, phone1: e.target.value})} className="w-full border p-2 rounded"/></div>
                      <div><label className="text-xs font-bold text-gray-500">Phone 2</label><input type="text" value={business.phone2} onChange={e => setBusiness({...business, phone2: e.target.value})} className="w-full border p-2 rounded"/></div>
                      <div><label className="text-xs font-bold text-gray-500">Address (EN)</label><textarea rows={2} value={business.addressEN} onChange={e => setBusiness({...business, addressEN: e.target.value})} className="w-full border p-2 rounded"/></div>
                    </div>
                  )}

                  {adminTab === "brand" && (
                    <div className="max-w-2xl space-y-4">
                      <h3 className="text-2xl font-serif text-[#2A0813] mb-4 border-b pb-2">Brand Name & Links</h3>
                      <div><label className="text-xs font-bold text-gray-500">Logo Text</label><input type="text" value={brand.logoText} onChange={e => setBrand({...brand, logoText: e.target.value.toUpperCase()})} className="w-full border p-2 rounded font-serif text-lg"/></div>
                      <div><label className="text-xs font-bold text-gray-500">Logo Icon Letter</label><input type="text" maxLength={1} value={brand.logoLetter} onChange={e => setBrand({...brand, logoLetter: e.target.value.toUpperCase()})} className="w-full border p-2 rounded font-serif text-lg"/></div>
                      <div><label className="text-xs font-bold text-gray-500">WhatsApp Button Number (Include Country Code)</label><input type="text" value={brand.whatsappNumber} onChange={e => setBrand({...brand, whatsappNumber: e.target.value})} className="w-full border p-2 rounded"/></div>
                      <div><label className="text-xs font-bold text-gray-500">Footer Note (EN)</label><input type="text" value={brand.footerTextEN} onChange={e => setBrand({...brand, footerTextEN: e.target.value})} className="w-full border p-2 rounded"/></div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>

      <footer className="bg-[#1A050B] text-[#F5F5DC] pt-16 pb-8 border-t-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border border-[#D4AF37]/60 rounded-full flex items-center justify-center bg-[#2A0813]"><span className="text-[#D4AF37] font-serif font-bold text-lg">{brand.logoLetter}</span></div>
              <span className="text-2xl font-serif font-bold tracking-wider">{brand.logoText}</span>
            </div>
            <p className="text-[#F5F5DC]/70 text-sm leading-relaxed mb-6">{lang === "EN" ? brand.footerTextEN : brand.footerTextHI}</p>
          </div>
          <div>
            <h4 className="font-serif text-[#D4AF37] text-lg mb-6 uppercase tracking-widest">{lang === "EN" ? "Quick Links" : "महत्वपूर्ण लिंक"}</h4>
            <ul className="space-y-3 text-sm text-[#F5F5DC]/80">
              <li><button onClick={() => handleNav("chains")} className="hover:text-[#D4AF37]">{lang === "EN" ? "Chain Collections" : "चेन कलेक्शन"}</button></li>
              <li><button onClick={() => handleNav("jewellery")} className="hover:text-[#D4AF37]">{lang === "EN" ? "Gold Jewellery" : "स्वर्ण आभूषण"}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-[#D4AF37] text-lg mb-6 uppercase tracking-widest">{lang === "EN" ? "Contact Us" : "संपर्क"}</h4>
            <ul className="space-y-4 text-sm text-[#F5F5DC]/80">
              <li className="flex items-start gap-3"><MapPin size={18} className="text-[#D4AF37] shrink-0 mt-0.5" /><span>{lang === "EN" ? business.addressEN : business.addressHI}</span></li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-[#D4AF37] shrink-0" /><span>{business.phone1} <br/> {business.phone2}</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[#D4AF37]/20 flex justify-between text-xs text-[#F5F5DC]/50">
          <p>© 2026 {brand.logoText}. {lang === "EN" ? "All rights reserved." : "सभी अधिकार सुरक्षित।"}</p>
        </div>
      </footer>
    </div>
  );
}