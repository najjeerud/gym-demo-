import { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  Dumbbell, 
  Users, 
  Trophy, 
  Timer, 
  CheckCircle2, 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  Menu, 
  X, 
  ChevronRight,
  MessageCircle,
  ArrowUpRight,
  Quote,
  Loader2,
  LogOut,
  User as UserIcon,
  History,
  CreditCard,
  Calendar,
  Bell,
  Info,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// --- Components ---

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="text-green-500" size={20} />,
    error: <X className="text-primary" size={20} />,
    info: <Bell className="text-blue-500" size={20} />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-8 right-8 z-[200] bg-zinc-900 border border-white/10 p-4 flex items-center gap-4 shadow-2xl min-w-[300px]"
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-grow">
        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-0.5">{type}</p>
        <p className="text-sm font-medium text-white">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
        <X size={16} />
      </button>
      <div className="absolute bottom-0 left-0 h-1 bg-primary/30 w-full overflow-hidden">
        <motion.div 
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-primary origin-left"
        />
      </div>
    </motion.div>
  );
};

// --- Components ---

const Navbar = ({ user, onAuthClick, onLogout, onDashboardClick, onHomeClick, onNavigate }: { 
  user: User | null, 
  onAuthClick: () => void, 
  onLogout: () => void,
  onDashboardClick: () => void,
  onHomeClick: () => void,
  onNavigate: (sectionId: string) => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', onClick: () => onNavigate('home') },
    { name: 'About', href: '#about', onClick: () => onNavigate('about') },
    { name: 'Programs', href: '#programs', onClick: () => onNavigate('programs') },
    { name: 'Trainers', href: '#trainers', onClick: () => onNavigate('trainers') },
    { name: 'Membership', href: '#membership', onClick: () => onNavigate('membership') },
    { name: 'Gallery', href: '#gallery', onClick: () => onNavigate('gallery') },
    { name: 'Contact', href: '#contact', onClick: () => onNavigate('contact') },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/95 backdrop-blur-md py-3 md:py-4 border-b border-white/10' : 'bg-gradient-to-b from-black/80 to-transparent py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
        <button onClick={onHomeClick} className="flex items-center gap-2 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
            <Dumbbell className="-rotate-45 group-hover:rotate-0 transition-transform duration-500 text-white" size={18} />
          </div>
          <span className="text-lg md:text-2xl font-display font-bold tracking-tighter">GET<span className="text-primary">FIT</span></span>
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={link.onClick}
              className="nav-link text-xs xl:text-sm"
            >
              {link.name}
            </a>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={onDashboardClick}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
              >
                <UserIcon size={18} />
                Dashboard
              </button>
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-primary transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onAuthClick}
              className="bg-primary text-white px-6 py-2 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-black border-b border-white/10 overflow-hidden lg:hidden"
          >
            <div className="flex flex-col items-center gap-4 py-8 px-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="nav-link text-base md:text-lg w-full text-center py-2"
                  onClick={() => {
                    link.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </a>
              ))}
              
              <div className="w-full h-[1px] bg-white/10 my-2"></div>

              {user ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <button 
                    onClick={() => {
                      onDashboardClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="nav-link text-base md:text-lg w-full text-center py-2"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="nav-link text-base md:text-lg text-primary w-full text-center py-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    onAuthClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-gradient w-full text-center py-3"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section id="home" className="relative h-[100svh] min-h-[600px] md:min-h-[700px] w-full overflow-hidden flex flex-col">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0 h-[130%] -top-[15%] bg-black overflow-hidden"
      >
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070" 
          alt="Gym Interior" 
          className="w-full h-full object-cover opacity-60 scale-[1.05] [outline:2px_solid_black] [outline-offset:-2px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
      </motion.div>

      <div className="flex-grow flex items-center justify-center pt-24 md:pt-32 pb-12 relative z-10">
        <div className="text-center px-4 md:px-6 max-w-5xl max-h-[80vh] flex flex-col justify-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary font-bold tracking-[0.3em] uppercase mb-3 md:mb-4 block text-[10px] md:text-sm"
          >
            Push your limits
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-7xl font-display font-black leading-[1.1] mb-2"
          >
            Transform Your <span className="text-primary">Body</span>.<br />
            Transform Your <span className="text-primary">Life</span>.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-1 mb-6 md:mb-8"
          >
            <span className="text-lg md:text-2xl font-black uppercase tracking-widest text-white">Unisex Gym</span>
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">Since 2020</span>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-300 text-xs md:text-base lg:text-lg mb-8 max-w-2xl mx-auto px-4"
          >
            Join the elite fitness community. Expert trainers, state-of-the-art equipment, and a culture of excellence.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          >
            <a href="#membership" className="btn-gradient group flex items-center gap-2 w-full sm:w-auto justify-center">
              Join Now <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            <a href="#contact" className="px-8 py-3 border-2 border-white hover:bg-white hover:text-black transition-all duration-300 font-bold uppercase tracking-widest text-sm w-full sm:w-auto text-center">
              Book Free Trial
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-8 md:h-12 bg-white/30 relative">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-primary"></div>
        </div>
      </motion.div>
    </section>
  );
};

const About = () => {
  const features = [
    { icon: <Users size={28} />, title: "Certified Trainers", desc: "Our coaches are world-class athletes and certified professionals." },
    { icon: <Dumbbell size={28} />, title: "Modern Equipment", desc: "Access to the latest high-performance machines and free weights." },
    { icon: <Timer size={28} />, title: "Personal Coaching", desc: "Tailored workout plans designed specifically for your goals." },
    { icon: <Trophy size={28} />, title: "Nutrition Plans", desc: "Science-based dietary guidance to fuel your transformation." },
  ];

  return (
    <section id="about" className="section-padding bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative px-4 md:px-0"
          >
            <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 w-20 h-20 md:w-32 md:h-32 border-t-4 border-l-4 border-primary z-10"></div>
            <div className="overflow-hidden bg-black">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070" 
                alt="About Gym" 
                className="w-full grayscale hover:grayscale-0 transition-all duration-700 scale-[1.05] [outline:2px_solid_black] [outline-offset:-2px]"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 md:-bottom-10 md:-right-10 bg-primary p-4 md:p-8 z-20">
              <span className="text-3xl md:text-5xl font-black font-display block">6+</span>
              <span className="text-[8px] md:text-xs uppercase tracking-widest font-bold">Years of Excellence</span>
            </div>
          </motion.div>

          <div className="mt-8 lg:mt-0">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary font-bold uppercase tracking-widest mb-3 md:mb-4 block text-xs md:text-sm"
            >
              Who We Are
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-black mb-6 md:mb-8 leading-tight"
            >
              We are the <span className="text-primary">Get Fit</span> where champions are made.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-gray-400 mb-8 md:mb-12 leading-relaxed text-sm md:text-base"
            >
              Since 2020, Get Fit has been the premier destination for serious fitness enthusiasts. We don't just provide a space to workout; we provide a community, a mindset, and the tools to rebuild yourself from the ground up.
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="text-primary shrink-0">{f.icon}</div>
                  <div>
                    <h4 className="font-bold mb-1 text-sm md:text-base">{f.title}</h4>
                    <p className="text-xs md:text-sm text-gray-500">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PROGRAMS_DATA = [
  { 
    id: 'weight-training',
    title: "Weight Training", 
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070", 
    desc: "Build raw strength and muscle mass with our heavy lifting zones.",
    details: "Our weight training program is designed for those who want to push their limits. With a wide range of free weights, machines, and expert guidance, you'll master the fundamentals of strength training. Whether you're a beginner or an advanced lifter, our facility provides the perfect environment for progressive overload and muscle growth.",
    benefits: ["Increased Muscle Mass", "Improved Bone Density", "Enhanced Metabolism", "Better Posture"]
  },
  { 
    id: 'cardio-training',
    title: "Cardio Training", 
    img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1974", 
    desc: "Boost your endurance and heart health with high-intensity cardio.",
    details: "Get your heart racing with our state-of-the-art cardio equipment. From treadmills and ellipticals to rowing machines and stationary bikes, we have everything you need to improve your cardiovascular health, burn calories, and increase your stamina. Our trainers can help you design a cardio routine that complements your overall fitness goals.",
    benefits: ["Heart Health", "Weight Loss", "Stress Reduction", "Increased Energy Levels"]
  },
  { 
    id: 'crossfit',
    title: "CrossFit", 
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070", 
    desc: "Functional fitness that prepares you for any physical challenge.",
    details: "CrossFit at Get Fit is more than just a workout; it's a community. Our functional fitness program combines elements of weightlifting, cardio, and gymnastics to create high-intensity, varied workouts that challenge your body in new ways every day. Prepare for the unknown and unknowable with our expert-led CrossFit sessions.",
    benefits: ["Functional Strength", "Agility and Balance", "Community Support", "High Caloric Burn"]
  },
  { 
    id: 'bodybuilding',
    title: "Bodybuilding", 
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070", 
    desc: "Sculpt your physique with targeted hypertrophy training.",
    details: "Focus on aesthetics and symmetry with our bodybuilding program. We provide the specialized equipment and nutritional guidance necessary for serious hypertrophy. Learn advanced training techniques like drop sets, supersets, and time-under-tension to sculpt every muscle group to perfection.",
    benefits: ["Muscle Definition", "Symmetry and Proportion", "Discipline and Focus", "Metabolic Conditioning"]
  },
  { 
    id: 'personal-training',
    title: "Personal Training", 
    img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974", 
    desc: "One-on-one sessions tailored to your specific fitness journey.",
    details: "Achieve your goals faster with personalized attention. Our certified personal trainers work with you one-on-one to create a customized fitness and nutrition plan. Whether you're training for a specific event, recovering from an injury, or just starting out, our trainers provide the motivation and expertise you need to succeed.",
    benefits: ["Customized Plans", "Expert Guidance", "Accountability", "Faster Results"]
  },
];

const Programs = ({ onProgramClick }: { onProgramClick: (program: any) => void }) => {
  return (
    <section id="programs" className="section-padding bg-black">
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16 relative px-4">
        {/* Decorative Images for Heading */}
        <motion.div 
          initial={{ opacity: 0, x: -50, rotate: -20 }}
          whileInView={{ opacity: 0.15, x: 0, rotate: -10 }}
          className="absolute -top-12 left-0 w-32 h-32 hidden lg:block pointer-events-none"
        >
          <img 
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2ae61?q=80&w=2070" 
            alt="Dumbbell Decor" 
            className="w-full h-full object-cover rounded-full grayscale"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 50, rotate: 20 }}
          whileInView={{ opacity: 0.15, x: 0, rotate: 10 }}
          className="absolute -bottom-12 right-0 w-40 h-40 hidden lg:block pointer-events-none"
        >
          <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070" 
            alt="Kettlebell Decor" 
            className="w-full h-full object-cover rounded-full grayscale"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-primary font-bold uppercase tracking-widest mb-3 md:mb-4 block text-xs md:text-sm"
        >
          Our Programs
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-6xl font-black relative z-10"
        >
          Choose Your <span className="text-primary">Path</span>
        </motion.h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-4 md:px-0">
        {PROGRAMS_DATA.map((p, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onProgramClick(p)}
            className="group relative h-[300px] md:h-[400px] overflow-hidden cursor-pointer"
          >
            <img 
              src={p.img} 
              alt={p.title} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-xl md:text-2xl font-black mb-1 md:mb-2">{p.title}</h3>
              <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2 md:line-clamp-none">{p.desc}</p>
              <div className="w-10 h-1 md:w-12 md:h-1 bg-primary group-hover:w-full transition-all duration-500"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ProgramDetails = ({ program, onBack }: { program: any, onBack: () => void }) => {
  if (!program) return null;

  return (
    <div className="py-32 bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-12 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Programs
        </button>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-[400px] md:h-[600px] overflow-hidden border border-white/10"
          >
            <img 
              src={program.img} 
              alt={program.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-primary font-bold uppercase tracking-widest mb-4 block text-sm">Program Details</span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">{program.title}</h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-12">{program.details}</p>
            
            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 border-b border-white/10 pb-2">Key Benefits</h3>
                <ul className="space-y-4">
                  {program.benefits.map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-400 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 border-b border-white/10 pb-2">What to Expect</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  High-intensity sessions, expert guidance, and a supportive community to help you reach your peak performance.
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                const element = document.getElementById('membership');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-primary text-white px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all"
            >
              Start Training Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Trainers = () => {
  const trainers = [
    { name: "Imran", role: "Head Coach / Bodybuilding", img: "/trainer_2_compressed.jpg.jpeg" },
    { name: "Elite Trainer", role: "Strength & Conditioning", img: "/file_00000000a1547208b2a7790cd5923bde.png" },
    { name: "Fitness Specialist", role: "CrossFit & Mobility", img: "/file_000000008e7c7208a932f00644092fa0.png" },
  ];

  return (
    <section id="trainers" className="section-padding bg-zinc-950">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-primary font-bold uppercase tracking-widest mb-4 block"
        >
          Expert Team
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black"
        >
          Meet Our <span className="text-primary">Trainers</span>
        </motion.h2>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {trainers.map((t, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="relative overflow-hidden mb-6 aspect-[3/4] bg-black border-0 outline-none ring-0">
              <img 
                src={t.img} 
                alt={t.name} 
                className="w-full h-full object-cover object-top scale-[1.05] group-hover:scale-110 transition-all duration-700 border-0 outline-none ring-0 [outline:2px_solid_black] [outline-offset:-2px]"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
            <h3 className="text-xl font-black mb-1 text-center">{t.name}</h3>
            <p className="text-primary text-xs uppercase tracking-widest font-bold text-center">{t.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Membership = ({ onJoin }: { onJoin: (plan: any) => void }) => {
  const plans = [
    { name: "Basic Plan", price: "499", features: ["Access to Gym Floor", "Locker Room Access", "1 Free Trainer Session", "Standard Equipment", "No Contract"], recommended: false },
    { name: "Standard Plan", price: "999", features: ["All Basic Features", "Group Classes Included", "Personalized Workout Plan", "Nutrition Guidance", "Priority Support"], recommended: true },
    { name: "Premium Plan", price: "1999", features: ["All Standard Features", "Unlimited PT Sessions", "Recovery Zone Access", "Guest Passes", "Free Supplements"], recommended: false },
  ];

  return (
    <section id="membership" className="section-padding bg-black">
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16 px-4">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-primary font-bold uppercase tracking-widest mb-3 md:mb-4 block text-xs md:text-sm"
        >
          Pricing
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-6xl font-black"
        >
          Membership <span className="text-primary">Plans</span>
        </motion.h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        {plans.map((p, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card relative flex flex-col p-6 md:p-8 ${p.recommended ? 'border-primary ring-1 ring-primary' : ''}`}
          >
            {p.recommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary px-4 py-1 text-[10px] uppercase font-bold tracking-widest">
                Recommended
              </div>
            )}
            <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 uppercase tracking-tighter">{p.name}</h3>
            <div className="flex items-baseline gap-1 mb-6 md:mb-8">
              <span className="text-3xl md:text-4xl font-black text-primary">₹</span>
              <span className="text-5xl md:text-6xl font-black">{p.price}</span>
              <span className="text-gray-500 uppercase text-[10px] md:text-xs font-bold">/ Month</span>
            </div>
            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-grow">
              {p.features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs md:text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => onJoin(p)}
              className={`w-full py-3 md:py-4 font-bold uppercase tracking-widest transition-all duration-300 text-center text-xs md:text-sm ${p.recommended ? 'bg-primary text-white hover:bg-white hover:text-black' : 'border border-white/20 hover:bg-white hover:text-black'}`}
            >
              Join Now
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070", label: "Elite Training" },
    { url: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2070", label: "Strength Zone" },
    { url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2070", label: "Free Weights" },
    { url: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=2070", label: "Cardio Hub" },
    { url: "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=2070", label: "Power Lifting" },
    { url: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=2070", label: "Modern Facility" },
  ];

  return (
    <section id="gallery" className="section-padding bg-zinc-950">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-primary font-bold uppercase tracking-widest mb-4 block"
        >
          Transformations
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black"
        >
          Our <span className="text-primary">Gallery</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="overflow-hidden aspect-square group cursor-pointer relative bg-black"
          >
            <img 
              src={img.url} 
              alt={`Gallery ${img.label}`} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-[1.05] group-hover:scale-110 transition-all duration-700 [outline:2px_solid_black] [outline-offset:-2px]"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <span className="text-xs font-bold uppercase tracking-[0.3em] border border-white px-4 py-2">{img.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070" 
          alt="CTA Background" 
          className="w-full h-full object-cover opacity-30 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-none">
            Start Your <span className="text-primary">Fitness</span> Journey Today
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Don't wait for tomorrow. The best time to start was yesterday. The second best time is now.
          </p>
          <a href="#membership" className="btn-gradient inline-block">
            Join Now
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    { 
      name: "Kalesha Vali Patan", 
      text: "Nice equipment and good trainers are there all are good condition and trainers also behave like friendly teaching how perform the sets... Finally we love the gym... Get fit and be fit💪", 
      img: "https://picsum.photos/seed/kalesha/200/200" 
    },
    { 
      name: "Surya Teja", 
      text: "Get fit gym is very spacious and it consists of good equipment and good training by Mr imran.", 
      img: "https://picsum.photos/seed/surya/200/200" 
    },
    { 
      name: "Shaikh Ahmed", 
      text: "A clean and hygienic gym with good equipments and gears. Trainers are good And over all a good gym", 
      img: "https://picsum.photos/seed/shaikh/200/200" 
    },
    { 
      name: "Karthik Karthik3", 
      text: "Nice gym and best equipment Best trainers", 
      img: "https://picsum.photos/seed/karthik/200/200" 
    },
    { 
      name: "Moin Ysk", 
      text: "Good and well treand person and person treaning is also good", 
      img: "https://picsum.photos/seed/moin/200/200" 
    },
    { 
      name: "ŚHÂÏK ŚHÂŹÎŤH", 
      text: "Excellent For Body Fitness ❣️", 
      img: "https://picsum.photos/seed/shazith/200/200" 
    },
    { 
      name: "ashraf vlogs", 
      text: "Very good trainers and best gym centre in Chilakaluripet", 
      img: "https://picsum.photos/seed/ashraf/200/200" 
    },
    { 
      name: "Abdul Saida", 
      text: "Good and well treated persons and well personal treating", 
      img: "https://picsum.photos/seed/abdul/200/200" 
    }
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding bg-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Quote className="text-primary/20 mx-auto mb-8" size={80} />
        <AnimatePresence mode="wait">
          <motion.div 
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-2xl md:text-3xl italic text-gray-300 mb-12 leading-relaxed">
              "{reviews[active].text}"
            </p>
            <div className="flex items-center justify-center gap-4">
              <img 
                src={reviews[active].img} 
                alt={reviews[active].name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <h4 className="font-black text-xl">{reviews[active].name}</h4>
                <p className="text-primary text-xs uppercase font-bold tracking-widest">Member since 2022</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-12">
          {reviews.map((_, i) => (
            <button 
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${active === i ? 'bg-primary w-8' : 'bg-white/20'}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = ({ showToast }: { showToast: (msg: string, type: 'success' | 'error' | 'info') => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      showToast('Message sent successfully! We will contact you soon.', 'success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error: any) {
      console.error('Error sending message:', error);
      showToast(error.message || 'Failed to send message. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20">
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary font-bold uppercase tracking-widest mb-3 md:mb-4 block text-xs md:text-sm"
            >
              Contact Us
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-6xl font-black mb-8 md:mb-12 uppercase tracking-tighter"
            >
              Get In <span className="text-primary">Touch</span>
            </motion.h2>

            <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
              <div className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 flex items-center justify-center text-primary shrink-0 border border-white/10">
                  <Phone size={20} md:size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-[10px] text-gray-500 mb-1">Call Us</h4>
                  <p className="text-lg md:text-xl font-bold">6300588490</p>
                </div>
              </div>
              <div className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 flex items-center justify-center text-primary shrink-0 border border-white/10">
                  <Mail size={20} md:size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-[10px] text-gray-500 mb-1">Email Us</h4>
                  <p className="text-lg md:text-xl font-bold break-all">getfitunisexcpt@gmail.com</p>
                </div>
              </div>
              <div className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 flex items-center justify-center text-primary shrink-0 border border-white/10">
                  <MapPin size={20} md:size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-[10px] text-gray-500 mb-1">Our Location</h4>
                  <p className="text-xs md:text-base font-bold leading-relaxed">Get fit Gym, above KVB Bank, Chilakaluripet, Andhra Pradesh 522616, India</p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="w-full h-64 md:h-80 bg-white/5 border border-white/10 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <iframe 
                src="https://maps.google.com/maps?q=Get%20Fit%20Gym%20above%20KVB%20Bank%20Chilakaluripet&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Get Fit Gym Location"
              ></iframe>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass-card p-6 md:p-10"
          >
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-6 md:mb-8">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors text-sm" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Your Message</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors resize-none text-sm"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-gradient w-full py-3 md:py-4 disabled:opacity-50 text-sm"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onPrivacyClick, onTermsClick }: { onPrivacyClick: () => void, onTermsClick: () => void }) => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div>
          <a href="#home" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary flex items-center justify-center rotate-45">
              <Dumbbell className="-rotate-45 text-white" size={18} />
            </div>
            <span className="text-xl font-display font-bold tracking-tighter">GET<span className="text-primary">FIT</span></span>
          </a>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            The premier destination for elite fitness. We provide the tools, the community, and the expertise to help you forge a better version of yourself.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"><Instagram size={18} /></a>
            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"><Facebook size={18} /></a>
            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"><Twitter size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-black mb-8 uppercase tracking-widest text-sm">Quick Links</h4>
          <ul className="space-y-4">
            <li><a href="#home" className="text-gray-500 hover:text-primary transition-colors text-sm">Home</a></li>
            <li><a href="#about" className="text-gray-500 hover:text-primary transition-colors text-sm">About Us</a></li>
            <li><a href="#programs" className="text-gray-500 hover:text-primary transition-colors text-sm">Programs</a></li>
            <li><a href="#membership" className="text-gray-500 hover:text-primary transition-colors text-sm">Membership</a></li>
            <li><a href="#contact" className="text-gray-500 hover:text-primary transition-colors text-sm">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-8 uppercase tracking-widest text-sm">Opening Hours</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between text-gray-500"><span>Morning:</span> <span>05:00 - 11:30</span></li>
            <li className="flex justify-between text-gray-500"><span>Evening:</span> <span>15:00 - 21:30</span></li>
            <li className="text-primary font-bold text-center text-[10px] uppercase tracking-widest mt-2">(Extra hours available)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-8 uppercase tracking-widest text-sm">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3 text-gray-500">
              <Phone size={16} className="text-primary shrink-0" />
              <span>6300588490</span>
            </li>
            <li className="flex gap-3 text-gray-500">
              <Mail size={16} className="text-primary shrink-0" />
              <span className="break-all">getfitunisexcpt@gmail.com</span>
            </li>
            <li className="flex gap-3 text-gray-500">
              <MapPin size={16} className="text-primary shrink-0" />
              <span>Get fit Gym, above KVB Bank, Chilakaluripet, AP 522616</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6">
        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">
          &copy; {new Date().getFullYear()} Get Fit. All rights reserved.
        </p>
        <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-gray-600">
          <button onClick={onPrivacyClick} className="hover:text-primary transition-colors">Privacy Policy</button>
          <button onClick={onTermsClick} className="hover:text-primary transition-colors">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
};

const PrivacyPolicy = () => {
  return (
    <div className="py-32 bg-zinc-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12">Privacy <span className="text-primary">Policy</span></h1>
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, make a payment, or contact us for support. This may include your name, email address, phone number, and payment details.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you about your membership and our latest offers.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">3. Information Sharing</h2>
            <p>We do not share your personal information with third parties except as necessary to provide our services (e.g., payment processors) or as required by law.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">4. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at getfitunisexcpt@gmail.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

const TermsOfService = () => {
  return (
    <div className="py-32 bg-zinc-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12">Terms of <span className="text-primary">Service</span></h1>
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">2. Membership and Payments</h2>
            <p>Memberships are subject to the specific terms of the plan you choose. Payments are processed securely, and all sales are final unless otherwise specified in your membership agreement.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">3. Code of Conduct</h2>
            <p>We expect all members to treat others with respect and to follow the rules and regulations of our gym facilities. We reserve the right to terminate memberships for violations of our code of conduct.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">4. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Get Fit shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
          </section>
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">5. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms of Service at any time. We will provide notice of any significant changes by posting the new terms on our website.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

const WhatsAppButton = () => {
  const message = encodeURIComponent("Hi Get Fit Gym, I'm interested in joining and would like to know more about your membership plans!");
  return (
    <a 
      href={`https://wa.me/916300588490?text=${message}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
    >
      <MessageCircle size={32} />
    </a>
  );
};

const Loader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div id="loader">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 bg-primary flex items-center justify-center rotate-45 animate-pulse">
          <Dumbbell className="-rotate-45 text-white" size={32} />
        </div>
        <div className="loader-content"></div>
        <span className="text-xl font-display font-black tracking-[0.5em] animate-pulse">GET<span className="text-primary">FIT</span></span>
      </div>
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose, plan, user, onSuccess, showToast }: { 
  isOpen: boolean, 
  onClose: () => void, 
  plan: any, 
  user: User | null,
  onSuccess?: () => void,
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    months: '1',
    gymId: ''
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        months: plan?.displayDuration || (plan?.months ? String(plan.months) : '1'),
        gymId: ''
      });
    }
  }, [isOpen, plan]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async () => {
    if (!user) return;
    setIsSubmitting(true);

    const numericMonths = plan?.isOffer ? 1 : Number(formData.months);
    const amount = Number(plan?.price) * (plan?.isOffer ? 1 : numericMonths);

    try {
      // 1. Create Order on Server
      const orderResponse = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR' })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Get Fit Gym",
        description: `${plan?.name} Membership`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment on Server
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyResponse.ok) {
              const verifyData = await verifyResponse.json();
              throw new Error(verifyData.message || 'Payment verification failed');
            }

            // 4. Save to Supabase
            const { error } = await supabase
              .from('subscriptions')
              .insert([{
                user_id: user?.id,
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                gym_id: formData.gymId || null,
                plan_name: plan?.name,
                months: formData.months,
                amount: amount,
                payment_method: 'Razorpay',
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                created_at: new Date().toISOString()
              }]);

            if (error) throw error;

            onSuccess?.();
            setStep(3);
          } catch (error: any) {
            console.error('Payment Error:', error);
            showToast(error.message || 'Payment failed. Please contact support.', 'error');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
            showToast('Payment cancelled by user.', 'info');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile
        },
        theme: {
          color: "#ff0000"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setIsSubmitting(false);
        showToast(`Payment failed: ${response.error.description}`, 'error');
      });
      rzp.open();
    } catch (error: any) {
      console.error('Order Creation Error:', error);
      showToast(error.message || 'Failed to initiate payment.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10 bg-black/90 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-zinc-900 border border-white/10 w-full max-w-lg relative max-h-full overflow-y-auto custom-scrollbar"
        >
          <div className="p-8 md:p-12">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-white transition-colors bg-black/20 p-1 rounded-full"
            >
              <X size={24} />
            </button>

          {step === 1 && (
            <div>
              <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Join {plan?.name}</h3>
              <p className="text-gray-500 text-sm mb-8 uppercase tracking-widest font-bold">Enter your details to proceed</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Mobile Number</label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Plan Duration (Months)</label>
                  {plan?.isOffer ? (
                    <input 
                      readOnly
                      value={formData.months}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none text-gray-400 cursor-not-allowed"
                    />
                  ) : (
                    <select 
                      value={formData.months}
                      onChange={(e) => setFormData({...formData, months: e.target.value})}
                      className="w-full bg-zinc-800 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="1">1 Month</option>
                      <option value="3">3 Months (10% Off)</option>
                      <option value="6">6 Months (20% Off)</option>
                      <option value="12">12 Months (30% Off)</option>
                    </select>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Gym ID (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Enter your Gym ID if you have one"
                    value={formData.gymId}
                    onChange={(e) => setFormData({...formData, gymId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors" 
                  />
                </div>
                <button type="submit" className="btn-gradient w-full py-4 mt-4">Proceed to Payment</button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full py-4 text-gray-500 text-xs uppercase font-bold tracking-widest hover:text-white transition-colors border border-white/5 hover:border-white/20 mt-2"
                >
                  Back to Home
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Secure Checkout</h3>
              <p className="text-gray-500 text-sm mb-12 uppercase tracking-widest font-bold">Review your plan details</p>
              
              <div className="bg-white/5 p-6 border border-white/10 mb-8 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Plan:</span>
                  <span className="font-bold">{plan?.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-bold">{formData.months}{!plan?.isOffer && ' Months'}</span>
                </div>
                <div className="border-t border-white/10 my-4 pt-4 flex justify-between">
                  <span className="text-xl font-black">Total:</span>
                  <span className="text-xl font-black text-primary">₹{Number(plan?.price) * (plan?.isOffer ? 1 : Number(formData.months))}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <button 
                  disabled={isSubmitting}
                  onClick={handlePayment} 
                  className="btn-gradient w-full py-4 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>Pay with Razorpay</span>
                    </>
                  )}
                </button>
                
                {!isSubmitting && (
                  <button 
                    onClick={() => setStep(1)}
                    className="text-gray-500 text-xs uppercase font-bold tracking-widest hover:text-white transition-colors"
                  >
                    Back to Details
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} className="text-primary" />
              </div>
              <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter">Payment Successful!</h3>
              <div className="space-y-4 mb-10">
                <p className="text-gray-400 leading-relaxed">
                  Welcome to the family, <span className="text-white font-bold">{formData.name}</span>! Your {plan?.name} is now active for {formData.months} months.
                </p>
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></div>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">Notifications Sent</p>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider leading-loose">
                    A confirmation message has been sent to:<br/>
                    <span className="text-white font-bold">{formData.email}</span><br/>
                    <span className="text-white font-bold">{formData.mobile}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="btn-gradient w-full py-4"
              >
                Go to Dashboard
              </button>
            </div>
          )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: { isOpen: boolean, onClose: () => void, initialMode?: 'login' | 'signup' | 'forgot' }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear form when modal opens or mode changes
  useEffect(() => {
    if (mode !== 'forgot') {
      setEmail('');
    }
    setPassword('');
    setFullName('');
    setError(null);
    setSuccess(null);
  }, [mode, isOpen]);

  if (!isOpen) return null;

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setSuccess('Password reset link sent! Please check your email.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      return handleResetPassword(e);
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        
        if (authError) throw authError;
        
        const user = authData.user;
        if (user) {
          // Create user profile in public.users table
          const { error: profileError } = await supabase
            .from('users')
            .insert([{
              id: user.id,
              email: user.email,
              full_name: fullName,
              role: 'user',
              created_at: new Date().toISOString()
            }]);
          
          if (profileError) throw profileError;
        }

        setSuccess('Account created successfully! Please check your email to verify.');
        setTimeout(() => onClose(), 2000);
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (authError) throw authError;
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center px-4 py-10 bg-black/90 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-zinc-900 border border-white/10 w-full max-w-md relative p-8 md:p-12"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-primary transition-all duration-300 hover:rotate-90"
            aria-label="Close"
          >
            <X size={32} />
          </button>

          <h3 className="text-4xl font-black mb-2 uppercase tracking-tighter">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join the Elite' : 'Reset Password'}
          </h3>
          <p className="text-gray-500 text-sm mb-8 uppercase tracking-widest font-bold">
            {mode === 'login' ? 'Enter your credentials' : mode === 'signup' ? 'Create your account' : 'Enter your email to receive a reset link'}
          </p>

          {error && (
            <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] p-4 mb-6 font-bold uppercase tracking-widest flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] p-4 mb-6 font-bold uppercase tracking-widest flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              {success}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors" 
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Email Address</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors" 
              />
            </div>
            {mode !== 'forgot' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Password</label>
                  {mode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] uppercase font-bold tracking-widest text-primary hover:text-white transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors" 
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-gradient w-full py-4 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link')}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs uppercase font-bold tracking-widest text-gray-500 hover:text-white transition-colors block w-full"
            >
              {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
            {mode === 'forgot' && (
              <button 
                onClick={() => setMode('login')}
                className="text-xs uppercase font-bold tracking-widest text-primary hover:text-white transition-colors block w-full"
              >
                Back to Login
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const MemberDashboard = ({ user, onNavigate, refreshKey }: { user: User, onNavigate: (sectionId: string) => void, refreshKey: number }) => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) setProfile(profileData);

        // Fetch history
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setSubscriptions(data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, refreshKey]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Member Area</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              Your <span className="text-outline text-transparent">Dashboard</span>
            </h2>
          </div>
          <div className="bg-zinc-900 border border-white/10 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <UserIcon className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Logged in as</p>
              <p className="font-bold">{profile?.full_name || user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900 border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-8">
                <History className="text-primary" size={24} />
                <h3 className="text-2xl font-black uppercase tracking-tight">Membership History</h3>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : subscriptions.length > 0 ? (
                <div className="space-y-4">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="bg-black/40 border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center">
                          <Trophy className="text-primary" size={20} />
                        </div>
                        <div>
                          <h4 className="font-black uppercase tracking-tight">{sub.plan_name}</h4>
                          <p className="text-xs text-gray-500 uppercase tracking-widest">{sub.months}{!String(sub.months).includes('Free') && ' Months Plan'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Amount</p>
                          <p className="font-black text-primary">₹{sub.amount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Date</p>
                          <p className="text-xs font-bold">{new Date(sub.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-white/10">
                  <p className="text-gray-500 uppercase font-bold tracking-widest text-sm mb-6">No active memberships found</p>
                  <button 
                    onClick={() => onNavigate('membership')}
                    className="text-primary font-black uppercase tracking-widest text-xs hover:underline"
                  >
                    Explore Plans
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900 border border-white/10 p-8">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6">Quick Stats</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-500" />
                    <span className="text-xs uppercase font-bold tracking-widest text-gray-400">Total Plans</span>
                  </div>
                  <span className="font-black">{subscriptions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard size={18} className="text-gray-500" />
                    <span className="text-xs uppercase font-bold tracking-widest text-gray-400">Total Spent</span>
                  </div>
                  <span className="font-black text-primary">₹{subscriptions.reduce((acc, curr) => acc + curr.amount, 0)}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary p-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-black mb-4">Need Help?</h3>
              <p className="text-black/70 text-sm font-bold uppercase tracking-widest mb-6 leading-relaxed">Our support team is available 24/7 for our elite members.</p>
              <button 
                onClick={() => onNavigate('contact')}
                className="w-full py-3 bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdatePasswordModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess('Password updated successfully!');
      setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-10 bg-black/95 backdrop-blur-xl"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-zinc-900 border border-white/10 w-full max-w-md relative p-8 md:p-12"
        >
          <h3 className="text-4xl font-black mb-2 uppercase tracking-tighter">New Password</h3>
          <p className="text-gray-500 text-sm mb-8 uppercase tracking-widest font-bold">Enter your new elite password</p>

          {error && (
            <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] p-4 mb-6 font-bold uppercase tracking-widest flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] p-4 mb-6 font-bold uppercase tracking-widest flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              {success}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">New Password</label>
              <input 
                required 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition-colors" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-gradient w-full py-4 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'dashboard' | 'privacy' | 'terms' | 'program-details'>('home');
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const lastUserId = useRef<string | null | undefined>(undefined);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      const newUserId = newUser?.id ?? null;
      
      if (event === 'PASSWORD_RECOVERY') {
        setIsUpdatePasswordModalOpen(true);
      }

      if (newUser) {
        if (lastUserId.current !== undefined && newUserId !== lastUserId.current) {
          showToast('Successfully signed in!', 'success');
          setView('home');
        }
      } else {
        if (lastUserId.current !== undefined && lastUserId.current !== null) {
          showToast('Successfully signed out. See you soon!', 'info');
          setView('home');
        }
      }

      lastUserId.current = newUserId;
      setUser(newUser);
      if (!newUser) setView('home');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleJoin = (plan: any) => {
    if (!user) {
      setAuthMode('signup');
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handleNavigate = (sectionId: string) => {
    setView('home');
    setSelectedProgram(null);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setView('home');
    } catch (err: any) {
      console.error('Logout error:', err);
      showToast('Error signing out. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen">
      <Loader />
      <Navbar 
        user={user} 
        onAuthClick={() => {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }} 
        onLogout={handleLogout}
        onDashboardClick={() => setView('dashboard')}
        onHomeClick={() => setView('home')}
        onNavigate={handleNavigate}
      />
      
      <main>
        {view === 'home' && (
          <>
            <Hero />
            <About />
            <section className="py-24 bg-zinc-950 border-y border-white/5">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-primary font-bold uppercase tracking-[0.3em] mb-4 block text-xs"
                  >
                    Exclusive Deals
                  </motion.span>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
                  >
                    Unbeatable <span className="text-primary">Offers</span>
                  </motion.h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="bg-primary p-10 flex flex-col justify-center relative overflow-hidden group min-h-[400px]"
                  >
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <img 
                        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070" 
                        alt="Offer Poster" 
                        className="w-full h-full object-cover grayscale"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform z-10">
                      <Trophy size={120} className="text-black" />
                    </div>
                    <div className="absolute top-6 left-6 bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest z-10">
                      Best Value
                    </div>
                    <div className="relative z-10">
                      <span className="text-black/60 font-black uppercase tracking-[0.3em] text-xs mb-2 mt-8 block">Limited Time Offer</span>
                      <h3 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter mb-2">1 Year Package</h3>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-black text-black">₹</span>
                        <span className="text-5xl font-black text-black">2999</span>
                      </div>
                      <p className="text-black font-bold text-xl uppercase tracking-widest mb-6">Get 3 Months <span className="underline">Free</span></p>
                      <button 
                        onClick={() => handleJoin({ name: "1 Year Offer", price: "2999", isOffer: true, months: 12, displayDuration: "12+3 Months Free" })}
                        className="bg-black text-white px-8 py-3 font-black uppercase tracking-widest text-xs self-start hover:bg-white hover:text-black transition-all"
                      >
                        Claim Offer
                      </button>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="bg-zinc-900 p-10 flex flex-col justify-center border border-white/10 relative overflow-hidden group min-h-[400px]"
                  >
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <img 
                        src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069" 
                        alt="Offer Poster" 
                        className="w-full h-full object-cover grayscale"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform z-10">
                      <Timer size={120} className="text-white" />
                    </div>
                    <div className="absolute top-6 left-6 bg-primary text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest z-10">
                      Most Popular
                    </div>
                    <div className="relative z-10">
                      <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-2 mt-8 block">Seasonal Special</span>
                      <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">3 Months Package</h3>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-black text-primary">₹</span>
                        <span className="text-5xl font-black text-white">899</span>
                      </div>
                      <p className="text-gray-400 font-bold text-xl uppercase tracking-widest mb-6">Get 1 Month <span className="text-primary underline">Free</span></p>
                      <button 
                        onClick={() => handleJoin({ name: "3 Months Offer", price: "899", isOffer: true, months: 3, displayDuration: "3+1 Months Free" })}
                        className="bg-primary text-white px-8 py-3 font-black uppercase tracking-widest text-xs self-start hover:bg-white hover:text-black transition-all"
                      >
                        Claim Offer
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
            <Programs onProgramClick={(p) => {
              setSelectedProgram(p);
              setView('program-details');
              window.scrollTo(0, 0);
            }} />
            <Trainers />
            <Membership onJoin={handleJoin} />
            <Gallery />
            <Testimonials />
            <CTA />
            <Contact showToast={showToast} />
          </>
        )}
        {view === 'program-details' && <ProgramDetails program={selectedProgram} onBack={() => setView('home')} />}
        {view === 'dashboard' && user && <MemberDashboard user={user} onNavigate={handleNavigate} refreshKey={refreshKey} />}
        {view === 'privacy' && <PrivacyPolicy />}
        {view === 'terms' && <TermsOfService />}
      </main>

      <Footer 
        onPrivacyClick={() => {
          setView('privacy');
          window.scrollTo(0, 0);
        }} 
        onTermsClick={() => {
          setView('terms');
          window.scrollTo(0, 0);
        }} 
      />
      <WhatsAppButton />
      
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        plan={selectedPlan} 
        user={user}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
        showToast={showToast}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode}
      />

      <UpdatePasswordModal 
        isOpen={isUpdatePasswordModalOpen} 
        onClose={() => setIsUpdatePasswordModalOpen(false)} 
      />

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
