import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Play, Pause, Volume2, VolumeX, ChevronDown,
  Film, Video, Camera, Plane, Clapperboard, Sparkles,
  Award, Tv, Users, MapPin, Mail, Phone, Send, Quote
} from "lucide-react";
import { 
  StaggerContainer, 
  StaggerItem,
  StaggerItemScale,
  StaggerItemSlideLeft,
  StaggerItemSlideRight,
  AnimatedHeading 
} from "@/components/StaggerAnimations";
import { VideoLightbox } from "@/components/VideoLightbox";
import { MagneticButton } from "@/components/MagneticButton";
import { TextReveal } from "@/components/TextReveal";
import { ParallaxSection } from "@/components/ParallaxSection";

// Services Data
const services = [
  {
    icon: Film,
    title: "Imagefilme",
    description: "Professionelle Unternehmensvideos, die Ihre Marke authentisch und überzeugend präsentieren.",
    features: ["Storytelling-Konzept", "Professionelle Interviews", "Hochwertige Postproduktion"],
  },
  {
    icon: Video,
    title: "Eventvideos",
    description: "Dynamische Dokumentation Ihrer Veranstaltungen – von Konferenzen bis zu Firmenfeiern.",
    features: ["Mehrkamera-Setup", "Live-Mitschnitte", "Highlight-Reels"],
  },
  {
    icon: Camera,
    title: "Social Media Content",
    description: "Kurze, wirkungsvolle Videos optimiert für Instagram, LinkedIn, TikTok und YouTube.",
    features: ["Vertikale & Horizontale Formate", "Motion Graphics", "Untertitelung"],
  },
  {
    icon: Plane,
    title: "Drohnenaufnahmen",
    description: "Spektakuläre Luftaufnahmen für einzigartige Perspektiven.",
    features: ["4K Aufnahmen", "Lizenzierte Piloten", "Professionelle Planung"],
  },
  {
    icon: Clapperboard,
    title: "Produktvideos",
    description: "Präsentieren Sie Ihre Produkte im besten Licht.",
    features: ["360° Produktansichten", "Animations-Integration", "E-Commerce optimiert"],
  },
  {
    icon: Sparkles,
    title: "Postproduktion",
    description: "Professionelle Nachbearbeitung Ihrer Videos auf höchstem Niveau.",
    features: ["Color Grading", "Motion Graphics", "Sound Design"],
  },
];

// Portfolio Data
const projects = [
  {
    title: "Corporate Vision",
    category: "Imagefilm",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    title: "Summit 2024",
    category: "Eventdokumentation",
    thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    title: "Product Launch",
    category: "Produktvideo",
    thumbnail: "https://images.unsplash.com/photo-1551817958-c5b51e7b4a33?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    title: "Alpine Views",
    category: "Drohnenaufnahmen",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    title: "Brand Story",
    category: "Social Media",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    title: "Interview Series",
    category: "Imagefilm",
    thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
];

// Stats Data
const stats = [
  { icon: Tv, value: "10+", label: "Jahre TV-Erfahrung" },
  { icon: Award, value: "100+", label: "Projekte umgesetzt" },
  { icon: Users, value: "50+", label: "Zufriedene Kunden" },
  { icon: MapPin, value: "3", label: "Regionen abgedeckt" },
];

// Testimonials Data
const testimonials = [
  {
    quote: "Die Zusammenarbeit war von Anfang an professionell und unkompliziert. Das Ergebnis hat unsere Erwartungen übertroffen.",
    name: "Sarah Müller",
    role: "Marketing Leiterin",
    company: "TechVision AG",
  },
  {
    quote: "Endlich ein Videograf, der versteht, was wir brauchen. Die Qualität ist auf TV-Niveau – absolut empfehlenswert.",
    name: "Thomas Brunner",
    role: "Geschäftsführer",
    company: "Brunner Immobilien",
  },
  {
    quote: "Unser Imagefilm hat uns bereits mehrere neue Kunden gebracht. Die Investition hat sich mehr als gelohnt.",
    name: "Lisa Oberhauser",
    role: "Inhaberin",
    company: "Oberhauser Design Studio",
  },
];

// Parallax Portfolio Card
const ParallaxCard = ({ project, index, onClick }: { project: typeof projects[0]; index: number; onClick: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl aspect-video cursor-pointer"
      onClick={onClick}
    >
      <motion.div className="absolute inset-0" style={{ y, scale: imageScale }}>
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </motion.div>
      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center z-10">
        <div className="p-4 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
          <Play className="w-8 h-8 text-foreground" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent z-10">
        <p className="text-primary text-sm font-medium mb-1">{project.category}</p>
        <h3 className="text-foreground text-lg font-medium">{project.title}</h3>
      </div>
    </motion.div>
  );
};

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });

  // Video Lightbox state
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main>
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: backgroundY, scale }}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=80"
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 vignette" />
          <div className="absolute inset-0 bg-background/60" />
        </motion.div>

        <motion.div 
          className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight text-foreground tracking-tight mb-6">
            <TextReveal 
              text="Videos, die wirken." 
              delay={0.3}
              staggerDelay={0.04}
              duration={0.6}
            />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-12 font-normal"
          >
            Videoproduktion mit TV-Erfahrung – für Unternehmen im Rheintal, Liechtenstein und der Ostschweiz.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <MagneticButton
              onClick={() => scrollToSection("kontakt")}
              className="px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
              strength={0.4}
            >
              Projekt anfragen
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollToSection("portfolio")}
              className="px-8 py-4 bg-transparent text-foreground font-medium rounded-lg border border-foreground/30 hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-400"
              strength={0.4}
            >
              Portfolio ansehen
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 right-8 z-20 flex gap-2"
        >
          <button onClick={togglePlay} className="p-3 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/20 text-foreground hover:bg-foreground/20 transition-all duration-400">
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={toggleMute} className="p-3 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/20 text-foreground hover:bg-foreground/20 transition-all duration-400">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          onClick={() => scrollToSection("leistungen")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-foreground/60 hover:text-foreground transition-colors duration-400"
        >
          <ChevronDown size={32} className="animate-scroll-bounce" />
        </motion.button>
      </section>

      {/* LEISTUNGEN SECTION */}
      <ParallaxSection id="leistungen" className="py-24 px-6" backgroundSpeed={0.2} gradientDirection="top">
        <div className="container mx-auto">
          <AnimatedHeading className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extralight text-foreground mb-6">Leistungen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Von der Konzeption bis zur finalen Produktion – professionelle Videoproduktion mit TV-Erfahrung für jeden Bedarf.
            </p>
          </AnimatedHeading>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" delay={0.2} staggerDelay={0.1}>
            {services.map((service) => (
              <StaggerItem key={service.title} className="card-surface rounded-xl p-8 hover:border-primary/50 transition-all duration-400 group">
                <service.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-400" />
                <h3 className="text-xl font-medium text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </ParallaxSection>

      {/* PORTFOLIO SECTION */}
      <ParallaxSection id="portfolio" className="py-24 px-6 border-t border-border" backgroundSpeed={0.25}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-foreground mb-6">Portfolio</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Eine Auswahl meiner Projekte – jedes Video erzählt eine einzigartige Geschichte.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ParallaxCard 
                key={project.title} 
                project={project} 
                index={index} 
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* TESTIMONIALS SECTION */}
      <ParallaxSection className="py-24 px-6 border-t border-border" backgroundSpeed={0.15}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-foreground mb-6">Kundenstimmen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Was meine Kunden über die Zusammenarbeit sagen.
            </p>
          </motion.div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" delay={0.2} staggerDelay={0.15}>
            {testimonials.map((testimonial) => (
              <StaggerItem 
                key={testimonial.name}
                className="card-surface rounded-xl p-8 relative group hover:border-primary/30 transition-all duration-400"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-2 opacity-10 group-hover:opacity-20 transition-opacity duration-400">
                  <Quote className="w-16 h-16 text-primary" />
                </div>
                
                {/* Quote Text */}
                <p className="text-foreground/90 leading-relaxed mb-6 relative z-10 italic">
                  "{testimonial.quote}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-foreground font-medium text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{testimonial.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </ParallaxSection>

      {/* ÜBER MICH SECTION */}
      <ParallaxSection id="ueber-mich" className="py-24 px-6 border-t border-border" backgroundSpeed={0.2}>
        <div className="container mx-auto">
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" delay={0.1} staggerDelay={0.2}>
            <StaggerItemSlideLeft className="relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden card-surface">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                  alt="Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-xl gradient-primary opacity-20 blur-2xl" />
            </StaggerItemSlideLeft>

            <StaggerItemSlideRight>
              <h2 className="text-4xl md:text-5xl font-extralight text-foreground mb-6">Über mich</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Mit über zehn Jahren Erfahrung in der TV-Branche bringe ich professionelle 
                  Produktionsstandards in jedes Projekt. Von der Konzeption bis zur finalen 
                  Postproduktion – bei mir bekommen Sie alles aus einer Hand.
                </p>
                <p>
                  Meine Leidenschaft ist es, Geschichten visuell zu erzählen. Dabei verbinde 
                  ich technische Expertise mit kreativem Gespür, um Videos zu produzieren, 
                  die nicht nur professionell aussehen, sondern auch emotional berühren.
                </p>
                <p>
                  Als gebürtiger Rheintaler kenne ich die Region und ihre Unternehmen bestens. 
                  Ob lokaler Handwerksbetrieb oder internationales Unternehmen in Liechtenstein – 
                  ich verstehe die individuellen Bedürfnisse und setze sie gekonnt um.
                </p>
              </div>
              <MagneticButton
                onClick={() => scrollToSection("kontakt")}
                className="inline-block mt-8 px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400"
                strength={0.35}
              >
                Kontakt aufnehmen
              </MagneticButton>
            </StaggerItemSlideRight>
          </StaggerContainer>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24" delay={0.5} staggerDelay={0.1}>
            {stats.map((stat) => (
              <StaggerItem key={stat.label} className="card-surface rounded-xl p-6 text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-light text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </ParallaxSection>

      {/* KONTAKT SECTION */}
      <ParallaxSection id="kontakt" className="py-24 px-6 border-t border-border" backgroundSpeed={0.15} gradientDirection="bottom">
        <div className="container mx-auto">
          <AnimatedHeading className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extralight text-foreground mb-6">Kontakt</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Bereit für Ihr nächstes Videoprojekt? Schreiben Sie mir – ich freue mich auf ein unverbindliches Gespräch.
            </p>
          </AnimatedHeading>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-16" delay={0.2} staggerDelay={0.2}>
            <StaggerItemSlideLeft>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-400"
                    placeholder="Ihr Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">E-Mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-400"
                    placeholder="ihre@email.ch"
                  />
                </div>
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-foreground mb-2">Projektart</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary transition-colors duration-400"
                  >
                    <option value="">Bitte auswählen</option>
                    <option value="imagefilm">Imagefilm</option>
                    <option value="eventvideo">Eventvideo</option>
                    <option value="social-media">Social Media Content</option>
                    <option value="drohne">Drohnenaufnahmen</option>
                    <option value="produktvideo">Produktvideo</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Nachricht</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-400 resize-none"
                    placeholder="Erzählen Sie mir von Ihrem Projekt..."
                  />
                </div>
                <MagneticButton
                  type="submit"
                  className="w-full px-8 py-4 gradient-primary text-foreground font-medium rounded-lg glow-primary glow-primary-hover transition-all duration-400 flex items-center justify-center gap-2"
                  strength={0.25}
                >
                  <Send size={18} />
                  Nachricht senden
                </MagneticButton>
              </form>
            </StaggerItemSlideLeft>

            <StaggerItemSlideRight>
              <StaggerContainer className="space-y-8" delay={0.4} staggerDelay={0.15}>
                <StaggerItem className="card-surface rounded-xl p-8">
                  <h3 className="text-xl font-medium text-foreground mb-6">Kontaktdaten</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">E-Mail</p>
                        <p className="text-foreground">info@emmotion.ch</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Telefon</p>
                        <p className="text-foreground">+41 79 XXX XX XX</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Region</p>
                        <p className="text-foreground">Rheintal, Liechtenstein, Ostschweiz</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem className="card-surface rounded-xl p-8">
                  <h3 className="text-xl font-medium text-foreground mb-4">Antwortzeit</h3>
                  <p className="text-muted-foreground">
                    Ich melde mich in der Regel innerhalb von 24 Stunden bei Ihnen. 
                    Dringende Anfragen erreichen mich am besten telefonisch.
                  </p>
                </StaggerItem>
              </StaggerContainer>
            </StaggerItemSlideRight>
          </StaggerContainer>
        </div>
      </ParallaxSection>

      {/* Video Lightbox */}
      <VideoLightbox
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        videoUrl={selectedProject?.videoUrl || ""}
        title={selectedProject?.title || ""}
        category={selectedProject?.category || ""}
      />
    </main>
  );
};

export default Index;
