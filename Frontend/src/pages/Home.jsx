import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, animate } from 'framer-motion'; // Added animate import
import { FaDumbbell, FaArrowRight, FaPlay } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import '../styles/animations.css';

// Helper for count-up animation
function AnimatedNumber({ value }) {
  const [currentValue, setCurrentValue] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => setCurrentValue(Math.round(latest)),
      });
      return () => controls.stop();
    }
  }, [inView, value]);

  return <motion.span ref={ref}>{currentValue}</motion.span>;
}

const cardImages = [
  { id: 1, src: "/assets/images/athletictraining.png", alt: "Athletic Training" },
  { id: 2, src: "/assets/images/bodytoning.png", alt: "Body Toning" },
  { id: 3, src: "/assets/images/boxingclass.png", alt: "Boxing Class" },
  { id: 4, src: "/assets/images/strengthandconditioning.png", alt: "Strength and Conditioning" },
];

function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFanned, setIsFanned] = useState(false); // State for card fan animation
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center py-10 md:py-20 overflow-hidden bg-neutral-900"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Enhanced Background Circles */}
        {[...Array(6)].map((_, i) => { // Increased to 6 circles
          const size = 250 + Math.random() * 350; // Adjusted size range
          const duration = 8 + Math.random() * 7; // Slower, more varied pulse duration
          const delay = Math.random() * 3;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full" // Removed opacity-10, will be handled by gradient
              initial={{
                x: `${Math.random() * 100 - 50}%`, // Allow off-screen start
                y: `${Math.random() * 100 - 50}%`,
                scale: 0.6,
              }}
              animate={{
                x: [`${Math.random() * 100 - 50}%`, `${Math.random() * 100 - 50}%`],
                y: [`${Math.random() * 100 - 50}%`, `${Math.random() * 100 - 50}%`],
                scale: [0.7, 1.1, 0.7], // More subtle pulsing scale
                opacity: [0.03, 0.1, 0.03], // Adjusted opacity
              }}
              transition={{
                duration: duration + 8, // Even Slower drift
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: delay,
              }}
              style={{
                background: 'radial-gradient(circle, rgba(191,161,74,0.12) 0%, rgba(191,161,74,0) 65%)', // Softer gradient
                width: `${size}px`,
                height: `${size}px`,
                filter: 'blur(10px)' // Added blur for softer edges
              }}
            />
          );
        })}
        {/* Grid Pattern - slightly more subtle */}
        <div
          className="absolute inset-0 opacity-[0.04]" // Further reduced opacity
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23bfa14a' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        ref={contentRef}
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-6xl mx-auto px-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Logo and Brand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: "circOut" }} // Adjusted delay and ease
              className="inline-flex items-center gap-3 bg-white/5 rounded-2xl p-2 pr-4 backdrop-blur-lg
                hover-lift hover-glow shadow-xl border border-white/10" // Enhanced styling
            >
              <div className="bg-[#bfa14a] rounded-xl p-2.5 animate-pulse-ring shadow-md">
                <FaDumbbell className="text-neutral-900 text-xl" />
              </div>
              <span className="text-white/90 font-medium">Premium Fitness Experience</span>
            </motion.div>

            {/* Main Heading with enhanced animations */}
            <div className="space-y-6"> {/* Increased spacing */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                {"Transform Your".split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 30 }} // Increased y offset
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 + index * 0.18, ease: "circOut" }} // Adjusted params
                    className="inline-block mr-2 lg:mr-3" // Ensure space between words
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 + "Transform Your".split(" ").length * 0.18, ease: "circOut" }}
                  className="text-[#bfa14a] inline-block animate-gradient-shift bg-gradient-to-r from-[#bfa14a] via-[#f0d68c] to-[#c8a956] bg-clip-text text-transparent" // Adjusted gradient colors
                >
                  Body & Mind
                </motion.span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9, ease: "circOut" }} // Adjusted delay
                className="text-lg md:text-xl text-neutral-300 max-w-xl lg:max-w-2xl leading-relaxed" // Increased max-width on lg
              >
                Join the ultimate fitness journey with state-of-the-art facilities and expert guidance. Your transformation starts here.
              </motion.p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-wrap gap-4 slide-in-left" style={{ animationDelay: '0.2s' }}>
              <motion.button
                onClick={scrollToPricing}
                whileHover={{ scale: 1.03, boxShadow: "0px 5px 25px rgba(191, 161, 74, 0.4)" }} // Adjusted hover effect
                whileTap={{ scale: 0.97 }}
                className="group relative px-8 py-4 bg-[#bfa14a] text-neutral-900 rounded-xl font-semibold
                  overflow-hidden transition-all duration-300 shadow-lg hover-glow border-2 border-transparent hover:border-[#ffe599]" // Added border on hover
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Journey
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 
                  group-hover:opacity-100 transition-opacity animate-gradient-shift" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, borderColor: '#bfa14a' }} // Simpler hover for secondary
                whileTap={{ scale: 0.97 }}
                className="group px-8 py-4 rounded-xl font-semibold border-2 border-white/20 text-white
                  transition-all duration-300 flex items-center gap-3 shadow-md hover-glow" // Added hover-glow
              >
                <motion.span
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                  group-hover:bg-[#bfa14a]/20 transition-colors group-hover:animate-pulse-ring"
                  // Removed whileHover from here as parent has it
                >
                  <FaPlay className="text-[#bfa14a] text-sm ml-0.5 group-hover:text-white transition-colors" />
                </motion.span>
                <span className="text-white group-hover:text-[#bfa14a] transition-colors">
                  Watch Video
                </span>
              </motion.button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '2000+', label: 'Active Members' },
                { value: '50+', label: 'Expert Trainers' },
                { value: '15+', label: 'Programs' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40 }} // Increased y offset
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.2, ease: "circOut" }} // Adjusted delay and ease
                  className="text-center hover-lift p-3 rounded-xl hover:bg-white/5 transition-colors duration-200" // Added hover bg
                >
                  <div className="text-3xl lg:text-4xl font-bold text-[#bfa14a] animate-gradient-shift
                    bg-gradient-to-r from-[#bfa14a] via-[#f0d68c] to-[#c8a956] bg-clip-text text-transparent mb-1.5"> {/* Adjusted gradient and margin */}
                    <AnimatedNumber value={parseInt(stat.value)} />{stat.value.includes('+') ? '+' : ''}
                  </div>
                  <div className="text-sm lg:text-base text-neutral-400 tracking-wider">{stat.label}</div> {/* Slightly larger text on lg */}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Right Column - Animated Card Stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              perspective: "1500px",
              rotateX: mousePosition.y * 0.004,
              rotateY: mousePosition.x * 0.004,
            }}
            className="relative w-full min-h-[350px] lg:min-h-[450px] flex items-center justify-center group"
            onHoverStart={() => setIsFanned(true)}
            onHoverEnd={() => setIsFanned(false)}
          >
            {cardImages.map((card, index) => {
              const numCards = cardImages.length;
              const centerOffset = (index - (numCards - 1) / 2); // -1.5, -0.5, 0.5, 1.5 for 4 cards

              return (
                <motion.div
                  key={card.id}
                  className="absolute w-[200px] h-[280px] lg:w-[220px] lg:h-[310px] rounded-xl overflow-hidden shadow-2xl border-2 border-neutral-700/70 bg-neutral-800 cursor-pointer"
                  initial="stacked"
                  animate={isFanned ? "fanned" : "stacked"}
                  variants={{
                    stacked: {
                      x: centerOffset * 8, // Slight horizontal spread for stack
                      y: centerOffset * -6, // Slight vertical spread for stack
                      rotate: centerOffset * 2.5, // Slight rotation for stack
                      scale: 1 - (numCards - 1 - index) * 0.04, // Bottom cards slightly smaller
                      opacity: 1 - (numCards - 1 - index) * 0.15, // Fade out bottom cards
                      zIndex: index,
                      boxShadow: "0px 3px 12px rgba(0,0,0,0.3)",
                    },
                    fanned: {
                      x: centerOffset * 95, // Spread them out (adjust multiplier based on card width)
                      y: -35, // Lift them up
                      rotate: centerOffset * 16, // Fan rotation
                      scale: 1.03,
                      opacity: 1,
                      zIndex: numCards + index,
                      boxShadow: "0px 10px 30px rgba(191, 161, 74, 0.3)",
                    }
                  }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                  <img src={card.src} alt={card.alt} className="w-full h-full object-cover" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Adjusted y
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.4, ease: "circOut" }} // Adjusted delay
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 animate-float" // Adjusted gap
      >
        <div className="text-xs text-neutral-400 font-medium tracking-wider">SCROLL</div> {/* Changed text and styling */}
        <div className="w-5 h-8 rounded-full border-2 border-neutral-500/70 flex items-start justify-center p-1 hover-glow cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}> {/* Added click to scroll */}
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="w-1 h-1 rounded-full bg-[#bfa14a] animate-pulse-ring"
          />
        </div>
      </motion.div>

      <style>
        {`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
        }
      `}
      </style>
    </section>
  );
}

export default Home;