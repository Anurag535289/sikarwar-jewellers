"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Globe, MapPin, Phone, MessageCircle, Lock, 
  Sparkles, Image as ImageIcon, Map, ShieldCheck, Video, Type, User, XCircle
} from "lucide-react";

const FALLBACK_IMG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%232A0813"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="24" fill="%23D4AF37">Sikarwar Jewellery</text></svg>`;
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

  // --- COMPLETE HARDCODED CATALOG (CHAIINS & JEWELLERY) ---
  const allProducts = [
    // Machine Chains
    { id: "mc-1", code: "AGR-1", nameEN: "Curb Machine Chain", nameHI: "कर्व मशीन चेन", category: "Machine Chains", image: "/24792.mp4" },
    { id: "mc-2", code: "AGR-2", nameEN: "Pata Machine Chain", nameHI: "पटा मशीन चेन", category: "Machine Chains", image: "/24793.png" },
    { id: "mc-3", code: "AGR-3", nameEN: "Fox Machine Chain", nameHI: "फॉक्स मशीन चेन", category: "Machine Chains", image: "/24797.jpg" },
    { id: "mc-4", code: "AGR-5", nameEN: "Box Machine Chain", nameHI: "बॉक्स मशीन चेन", category: "Machine Chains", image: "/24798.jpg" },
    { id: "mc-5", code: "AGR-6", nameEN: "Shiva Chain", nameHI: "शिव चेन", category: "Machine Chains", image: "/24797.jpg" },
    { id: "mc-6", code: "AGR-7", nameEN: "Tridev Chain", nameHI: "त्रिदेव चेन", category: "Machine Chains", image: "/24797.jpg" },
    { id: "mc-7", code: "AGR-8", nameEN: "Indrajeet Chain", nameHI: "इंद्रजीत चेन", category: "Machine Chains", image: "/24797.jpg" },
    { id: "mc-8", code: "AGR-10", nameEN: "Sadak Chain", nameHI: "सड़क चेन", category: "Machine Chains", image: "/24797.jpg" },
    { id: "mc-9", code: "AGR-11", nameEN: "Highway Chain", nameHI: "हाईवे चेन", category: "Machine Chains", image: "/24797.jpg" },
    { id: "mc-10", code: "AGR-13", nameEN: "Shahenshah Chain", nameHI: "शहंशाह चेन", category: "Machine Chains", image: "/24798.jpg" },
    { id: "mc-11", code: "AGR-37", nameEN: "Curb Sundari Figaro", nameHI: "कर्व सुंदरी फिगारो", category: "Machine Chains", image: "/24798.jpg" },
    { id: "mc-12", code: "AGR-51", nameEN: "Maruti Chain", nameHI: "मारुति चेन", category: "Machine Chains", image: "/24798.jpg" },
    { id: "mc-13", code: "AGR-52", nameEN: "Curb Sundari", nameHI: "कर्व सुंदरी", category: "Machine Chains", image: "/24798.jpg" },
    
    // Hollow Chains
    { id: "hc-1", code: "AGR-100", nameEN: "Hollow Classic Weave", nameHI: "होलो क्लासिक वीव", category: "Hollow Chains", image: "/24799.jpg" },
    { id: "hc-2", code: "AGR-104", nameEN: "Hollow Interlink Chain", nameHI: "होलो इंटरलिंक चेन", category: "Hollow Chains", image: "/24799.jpg" },
    { id: "hc-3", code: "AGR-110", nameEN: "Silk Rope Hollow Chain", nameHI: "सिल्क रोप होलो चेन", category: "Hollow Chains", image: "/24806.jpg" },
    { id: "hc-4", code: "AGR-113", nameEN: "Hollow Fancy Chain", nameHI: "होलो फैंसी चेन", category: "Hollow Chains", image: "/24800.jpg" },
    { id: "hc-5", code: "AGR-120", nameEN: "Nawabi Hollow Heavy", nameHI: "नवाबी होलो हैवी", category: "Hollow Chains", image: "/24800.jpg" },
    { id: "hc-6", code: "AGR-156", nameEN: "Hollow Round Link", nameHI: "होलो गोल लिंक", category: "Hollow Chains", image: "/24801.jpg" },
    { id: "hc-7", code: "AGR-177", nameEN: "Textured Hollow Rope", nameHI: "टेक्सचर होलो रोप", category: "Hollow Chains", image: "/24803.jpg" },
    { id: "hc-8", code: "AGR-192", nameEN: "Twisted Hollow Chain", nameHI: "ट्विस्टेड होलो चेन", category: "Hollow Chains", image: "/24804.jpg" },
    { id: "hc-9", code: "AGR-204", nameEN: "Imperial Hollow Chain", nameHI: "इंपीरियल होलो चेन", category: "Hollow Chains", image: "/24805.jpg" },

    // Solid & Nawabi Chains
    { id: "sn-1", code: "SNC-1", nameEN: "Solid Nawabi Chain 1", nameHI: "सॉलिड नवाबी चेन १", category: "Solid Nawabi", image: "/24806.jpg" },
    { id: "sn-2", code: "SNC-3", nameEN: "Solid Nawabi Chain 3", nameHI: "सॉलिड नवाबी चेन ३", category: "Solid Nawabi", image: "/24806.jpg" },
    { id: "sn-3", code: "SNC-5", nameEN: "Solid Nawabi Chain 5", nameHI: "सॉलिड नवाबी चेन ५", category: "Solid Nawabi", image: "/24806.jpg" },
    { id: "sn-4", code: "SNC-8", nameEN: "Solid Nawabi Chain 8", nameHI: "सॉलिड नवाबी चेन ८", category: "Solid Nawabi", image: "/24806.jpg" },

    // Bracelets
    { id: "br-1", code: "B-1", nameEN: "Designer Gold Bracelet 1", nameHI: "डिज़ाइनर गोल्ड ब्रेसलेट १", category: "Bracelets", image: "/24806.jpg" },
    { id: "br-2", code: "B-3", nameEN: "Designer Gold Bracelet 3", nameHI: "डिज़ाइनर गोल्ड ब्रेसलेट ३", category: "Bracelets", image: "/24806.jpg" },
    { id: "br-3", code: "B-5", nameEN: "Designer Gold Bracelet 5", nameHI: "डिज़ाइनर गोल्ड ब्रेसलेट ५", category: "Bracelets", image: "/24806.jpg" },

    // Gold Jewellery (Rani Haar, Hamel, GJ Series)
    { id: "jw-1", code: "RANI-HAAR", nameEN: "Traditional Royal Rani Haar Set", nameHI: "पारंपरिक रॉयल रानी हार सेट", category: "Gold Jewellery", image: "/24795.png" },
    { id: "jw-2", code: "HAMEL", nameEN: "Traditional Gold Hamel Necklace", nameHI: "पारंपरिक स्वर्ण हमेल हार", category: "Gold Jewellery", image: "/24796.png" },
    { id: "jw-3", code: "GJ-1", nameEN: "Bridal Heavy Necklace Set", nameHI: "ब्राइडल हैवी नेकलेस सेट", category: "Gold Jewellery", image: "/24807.jpg" },
    { id: "jw-4", code: "GJ-2", nameEN: "Royal Pendant with Earrings", nameHI: "रॉयल पेंडेंट और झुमकी", category: "Gold Jewellery", image: "/24807.jpg" },
    { id: "jw-5", code: "GJ-3", nameEN: "Designer Jhumka Pendant Set", nameHI: "डिज़ाइनर झुमका पेंडेंट सेट", category: "Gold Jewellery", image: "/24807.jpg" },
    { id: "jw-6", code: "GJ-8", nameEN: "Classic Gold Motif Locket", nameHI: "क्लासिक गोल्ड मोटिफ लॉकेट", category: "Gold Jewellery", image: "/24807.jpg" },
    { id: "jw-7", code: "GJ-14", nameEN: "Grand Multi-Layer Bridal Haar", nameHI: "ग्रैंड मल्टी-लेयर ब्राइडल हार", category: "Gold Jewellery", image: "/24807.jpg" }
  ];

  const brand = {
    logoLetter: "S",
    logoText: "SIKARWAR",
    whatsappNumber: "919009331816",
    footerTextEN: "Crafting trust and elegance for generations in the heart of Gwalior.",
    footerTextHI: "ग्वालियर के हृदय में पीढ़ियों से विश्वास और लालित्य गढ़ रहे हैं।"
  };

  const hero = {
    mediaType: "video",
    mediaSrc: "/24792.mp4",
    headingEN: "Crafted in Gold. Chosen for Generations.",
    headingHI: "सोने की शान, पीढ़ियों की पहचान।",
    subEN: "Explore distinctive gold machine chains, hollow chains, and bespoke handcrafted gold jewellery.",
    subHI: "मशीन चेन, होलो चेन और सोने के आभूषणों के आकर्षक डिज़ाइन — ऑर्डर पर तैयार किए जाते हैं।"
  };

  const featuredSlots = [
    { id: 1, titleEN: "Machine Chains", titleHI: "मशीन चेन", image: "/24793.png", link: "chains" },
    { id: 2, titleEN: "Hollow Chains", titleHI: "होलो चेन", image: "/24794.png", link: "chains" },
    { id: 3, titleEN: "Rani Haar Set", titleHI: "रानी हार सेट", image: "/24795.png", link: "jewellery" },
    { id: 4, titleEN: "Gold Hamel", titleHI: "गोल्ड हमेल", image: "/24796.png", link: "jewellery" }
  ];

  const about = {
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
  };

  const business = {
    phone1: "+91 9009331816",
    phone2: "+91 6260498762",
    addressEN: "Sikarwar House, Dana Oli, Lashkar, Gwalior, Madhya Pradesh - 474001",
    addressHI: "सिकरवार हाउस, दाना ओली, लश्कर, ग्वालियर, मध्य प्रदेश - 474001",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14324.965416047248!2d78.156172!3d26.208381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c6aebdb2d39b%3A0x6a05d6c5bb5d2b0e!2sLashkar%2C%20Gwalior%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000"
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 1500);
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

  const getWhatsAppUrl = () => `https://wa.me/${brand.whatsappNumber.replace(/\D/g, '')}?text=Namaste, I have an enquiry from your website.`;

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
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-white/50 hover:bg-white p-2 rounded-full text-black z-10"><XCircle size={24} /></button>
              <div className="md:w-1/2 h-64 md:h-[500px] bg-[#1a050b]">
                {selectedProduct.image.endsWith(".mp4") ? (
                  <video src={selectedProduct.image} autoPlay loop muted className="w-full h-full object-cover" />
                ) : (
                  <img src={selectedProduct.image || FALLBACK_IMG} alt={selectedProduct.nameEN} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center bg-[#FAFAFA]">
                <p className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase mb-2">{selectedProduct.category}</p>
                <h3 className="text-3xl font-serif text-[#2A0813] mb-2">{lang === "EN" ? selectedProduct.nameEN : selectedProduct.nameHI}</h3>
                <p className="text-gray-500 mb-6">Code: {selectedProduct.code}</p>
                <div className="w-16 h-[2px] bg-[#D4AF37] mb-6" />
                <p className="text-gray-700 mb-8">{lang === "EN" ? "Contact us directly on WhatsApp to inquire about weight, pricing, and availability." : "वजन, मूल्य और उपलब्धता के बारे में पूछताछ करने के लिए व्हाट्सएप पर संपर्क करें।"}</p>
                <a href={`https://wa.me/${brand.whatsappNumber.replace(/\D/g, '')}?text=Hello, I am interested in ${selectedProduct.code} - ${selectedProduct.nameEN}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white flex items-center justify-center gap-3 py-4 rounded-lg font-bold hover:bg-[#1DA851] transition-colors"><MessageCircle size={20} /> {lang === "EN" ? "Inquire on WhatsApp" : "व्हाट्सएप पर पूछताछ करें"}</a>
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
                <button onClick={() => handleNav("chains")} className="w-fit bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#2A0813] font-bold px-8 py-4 rounded-sm text-sm uppercase hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-shadow">{lang === "EN" ? "Explore Collection" : "कलेक्शन देखें"}</button>
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center z-10">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative bg-gradient-to-tr from-black/80 to-[#2A0813] p-4 rounded-2xl border border-[#D4AF37]/40 shadow-2xl max-w-md w-full">
                  <div className="overflow-hidden rounded-xl h-[340px] md:h-[420px] bg-[#1a050b]">
                    <video src={hero.mediaSrc} autoPlay loop muted playsInline className="w-full h-full object-cover rounded-xl" />
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-6 w-full">
              <div className="text-center mb-16"><h3 className="text-3xl md:text-4xl font-serif text-[#2A0813] mb-4">{lang === "EN" ? "Specialized Collections" : "प्रमुख श्रेणियां"}</h3><div className="w-20 h-1 bg-[#D4AF37] mx-auto" /></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {featuredSlots.map((slot, idx) => (
                  <div key={idx} onClick={() => handleNav(slot.link)} className="group bg-white border border-[#D4AF37]/20 p-4 rounded-xl shadow-sm cursor-pointer text-center hover:shadow-xl transition-all">
                    <div className="h-40 rounded-lg overflow-hidden mb-4 bg-[#2A0813]">
                      <img src={slot.image} alt={slot.titleEN} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
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
                {["All", "Machine Chains", "Hollow Chains", "Solid Nawabi", "Bracelets"].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-sm px-4 py-2 rounded-full border transition-colors ${selectedCategory === cat ? "bg-[#2A0813] text-[#D4AF37] border-[#2A0813]" : "bg-white text-gray-700 hover:border-[#D4AF37]"}`}>{cat}</button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProducts
                .filter(p => activePage === "chains" ? (p.category !== "Gold Jewellery" && (selectedCategory === "All" || p.category === selectedCategory)) : p.category === "Gold Jewellery")
                .map(product => (
                  <div key={product.id} onClick={() => setSelectedProduct(product)} className="bg-white border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between group cursor-pointer">
                    <div className="relative h-72 bg-[#1a050b] overflow-hidden">
                      <span className="absolute top-3 left-3 bg-[#2A0813] text-[#D4AF37] text-xs px-3 py-1 rounded shadow z-10">{product.code}</span>
                      {product.image.endsWith(".mp4") ? (
                        <video src={product.image} autoPlay loop muted className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <img src={product.image} alt={product.nameEN} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => e.currentTarget.src = FALLBACK_IMG} />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif text-[#2A0813] mb-1">{lang === "EN" ? product.nameEN : product.nameHI}</h3>
                      <p className="text-sm text-[#D4AF37] font-medium">{product.category}</p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {activePage === "about" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-serif text-[#2A0813] mb-4">{lang === "EN" ? about.titleEN : about.titleHI}</h2><div className="w-24 h-1 bg-[#D4AF37] mx-auto" /></div>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>{lang === "EN" ? about.p1EN : about.p1HI}</p><p>{lang === "EN" ? about.p2EN : about.p2HI}</p>
                <div className="pt-6 border-t border-[#D4AF37]/30"><ul className="space-y-2 font-medium"><li className="flex items-center gap-2"><ShieldCheck className="text-[#D4AF37]" size={20}/> 100% Authenticity Guaranteed</li><li className="flex items-center gap-2"><ShieldCheck className="text-[#D4AF37]" size={20}/> Heritage Craftsmanship</li></ul></div>
              </div>
              <div className="h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/30"><img src={about.image} alt="Heritage" className="w-full h-full object-cover" /></div>
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
                  <div className="flex gap-4"><div className="bg-[#2A0813] p-3 rounded-full text-[#D4AF37] h-fit"><MapPin size={24}/></div><div><p className="font-bold text-[#2A0813] mb-1">{lang === "EN" ? "Address" : "पता"}</p><p className="text-gray-600 leading-relaxed">{lang === "EN" ? business.addressEN : business.addressHI}</p></div></div>
                  <div className="flex gap-4"><div className="bg-[#2A0813] p-3 rounded-full text-[#D4AF37] h-fit"><Phone size={24}/></div><div><p className="font-bold text-[#2A0813] mb-1">{lang === "EN" ? "Phone" : "फ़ोन"}</p><p className="text-gray-600">{business.phone1}<br/>{business.phone2}</p></div></div>
                </div>
              </div>
              <div className="md:col-span-3 h-[500px] bg-gray-100 rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/30"><iframe src={business.mapUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Map"/></div>
            </div>
          </motion.div>
        )}

        {activePage === "admin" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-12">
            {!isAuthenticated ? (
              <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-[#D4AF37]/30 text-center">
                <Lock size={48} className="text-[#D4AF37] mx-auto mb-4" /><h2 className="text-3xl font-serif text-[#2A0813] mb-6">Admin Panel</h2>{loginError && <p className="text-red-500 mb-4">{loginError}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                  <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="Admin Email" required />
                  <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="Password" required />
                  <button type="submit" className="w-full bg-[#2A0813] text-[#D4AF37] py-4 rounded-lg font-bold">Access Panel</button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-200 text-center max-w-xl mx-auto space-y-6">
                <ShieldCheck size={56} className="text-[#D4AF37] mx-auto" />
                <h3 className="text-2xl font-serif text-[#2A0813]">Catalog Managed via Code</h3>
                <p className="text-gray-600 leading-relaxed">All machine chains, hollow chains, Nawabi chains, and gold jewellery items from your catalog are permanently listed and fully secured in your code structure.</p>
                <button onClick={() => setIsAuthenticated(false)} className="bg-red-50 text-red-600 border border-red-100 px-6 py-3 rounded-lg font-bold">Logout</button>
              </div>
            )}
          </motion.div>
        )}
      </main>

      <footer className="bg-[#1A050B] text-[#F5F5DC] pt-16 pb-8 border-t-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div><div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 border border-[#D4AF37]/60 rounded-full flex items-center justify-center bg-[#2A0813]"><span className="text-[#D4AF37] font-serif font-bold text-lg">{brand.logoLetter}</span></div><span className="text-2xl font-serif font-bold tracking-wider">{brand.logoText}</span></div><p className="text-[#F5F5DC]/70 text-sm leading-relaxed mb-6">{lang === "EN" ? brand.footerTextEN : brand.footerTextHI}</p></div>
          <div><h4 className="font-serif text-[#D4AF37] text-lg mb-6 uppercase tracking-widest">{lang === "EN" ? "Quick Links" : "महत्वपूर्ण लिंक"}</h4><ul className="space-y-3 text-sm text-[#F5F5DC]/80"><li><button onClick={() => handleNav("chains")} className="hover:text-[#D4AF37]">{lang === "EN" ? "Chain Collections" : "चेन कलेक्शन"}</button></li><li><button onClick={() => handleNav("jewellery")} className="hover:text-[#D4AF37]">{lang === "EN" ? "Gold Jewellery" : "स्वर्ण आभूषण"}</button></li></ul></div>
          <div><h4 className="font-serif text-[#D4AF37] text-lg mb-6 uppercase tracking-widest">{lang === "EN" ? "Contact Us" : "संपर्क"}</h4><ul className="space-y-4 text-sm text-[#F5F5DC]/80"><li className="flex items-start gap-3"><MapPin size={18} className="text-[#D4AF37] shrink-0 mt-0.5" /><span>{lang === "EN" ? business.addressEN : business.addressHI}</span></li><li className="flex items-center gap-3"><Phone size={18} className="text-[#D4AF37] shrink-0" /><span>{business.phone1} <br/> {business.phone2}</span></li></ul></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[#D4AF37]/20 flex justify-between text-xs text-[#F5F5DC]/50"><p>© 2026 {brand.logoText}. {lang === "EN" ? "All rights reserved." : "सभी अधिकार सुरक्षित।"}</p></div>
      </footer>
    </div>
  );
}