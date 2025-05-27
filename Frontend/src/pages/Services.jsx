import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';

function Services() {
  const [activeTab, setActiveTab] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [focusedCard, setFocusedCard] = useState(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const servicesRef = useRef(null);

  const services = {
    training: [
      {
        title: 'Body Toning',
        description: 'Focus on sculpting and defining muscles through targeted exercises.',
        icon: '/assets/images/bodytoning.png',
        features: ['Personalized workout plans', 'Body composition analysis', 'Progress tracking']
      },
      {
        title: 'Strength & Conditioning',
        description: 'Build strength, power, and endurance for improved performance.',
        icon: '/assets/images/strengthandconditioning.png',
        features: ['Performance assessment', 'Compound exercises', 'Recovery guidance']
      },
      {
        title: 'Circuit Training',
        description: 'High-energy workouts to boost cardiovascular fitness and endurance.',
        icon: '/assets/images/circuittraining.png',
        features: ['Interval training', 'Full-body workout', 'Calorie burning']
      },
      {
        title: 'Athletic Training',
        description: 'Sport-specific exercises for improved strength, speed, and agility.',
        icon: '/assets/images/athletictraining.png',
        features: ['Sports conditioning', 'Agility drills', 'Performance metrics']
      },
      {
        title: 'Weight Management',
        description: 'Customized programs for weight loss or muscle gain goals.',
        icon: '/assets/images/weightlossgain.png',
        features: ['Nutrition guidance', 'Progress monitoring', 'Goal setting']
      },
      {
        title: 'Running Clinic',
        description: 'Improve your running form, endurance, and speed.',
        icon: '/assets/images/runningclinic.png',
        features: ['Gait analysis', 'Endurance building', 'Race preparation']
      }
    ],
    classes: [
      {
        title: 'Tabata Classes',
        description: 'High-intensity interval training for maximum results.',
        icon: '/assets/images/tabataclass.png',
        features: ['20/10 intervals', 'Fat burning', 'Metabolic boost']
      },
      {
        title: 'Functional Training',
        description: 'Practical exercises that mirror daily activities.',
        icon: '/assets/images/dynamicfuntionaltraining.png',
        features: ['Movement patterns', 'Core strength', 'Balance training']
      },
      {
        title: 'Zumba Classes',
        description: 'Fun, dance-based cardio workouts set to energetic music.',
        icon: '/assets/images/zumbaclass.png',
        features: ['Dance fitness', 'Cardio boost', 'Mood elevation']
      },
      {
        title: 'Yoga',
        description: 'Mind-body connection through poses and breathing.',
        icon: '/assets/images/yogaclass.png',
        features: ['Flexibility', 'Stress relief', 'Mind-body balance']
      },
      {
        title: 'Boxing',
        description: 'Total body workout using boxing techniques.',
        icon: '/assets/images/boxingclass.png',
        features: ['Technique training', 'Core strength', 'Stress relief']
      },
      {
        title: 'Muay Thai',
        description: 'Combat training focusing on strikes and self-defense.',
        icon: '/assets/images/muaythaiclass.png',
        features: ['Strike training', 'Conditioning', 'Self-defense']
      }
    ]
  };

  useEffect(() => {
    const handleScroll = () => {
      if (servicesRef.current) {
        const rect = servicesRef.current.getBoundingClientRect();
        setHasScrolled(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToServices = (tab) => {
    if (tab === null) {
      setActiveTab(null);
      window.scrollTo({ top: servicesRef.current.offsetTop - 80, behavior: 'smooth' });
    } else {
      setActiveTab(tab);
      const yOffset = -80;
      const y = servicesRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCardKeyDown = (e, service, type) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      
    }
  };

  const ScrollButton = ({ direction }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`absolute top-1/2 -translate-y-1/2 ${direction === 'left' ? 'left-2' : 'right-2'}
        z-20 w-10 h-10 rounded-full bg-neutral-800/80 backdrop-blur-sm border border-white/10
        text-white flex items-center justify-center transition-colors
        hover:bg-[#bfa14a] hover:border-[#bfa14a]/50 group`}
    >
      {direction === 'left' 
        ? <FaChevronLeft className="group-hover:text-neutral-900" />
        : <FaChevronRight className="group-hover:text-neutral-900" />}
    </motion.button>
  );

  return (
    <main className="w-full bg-neutral-900 py-20 px-4" ref={servicesRef}>
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16" data-aos="fade-down">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#bfa14a]/10 rounded-full px-4 py-2 mb-4"
          >
            <span className="text-[#bfa14a] font-medium">Our Services</span>
            <FaArrowRight className="text-[#bfa14a] text-sm" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Comprehensive <span className="text-[#bfa14a]">Fitness Solutions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-neutral-400 max-w-2xl mx-auto"
          >
            Discover our range of specialized programs and classes designed to help you achieve your fitness goals
          </motion.p>
        </div>

        {/* Enhanced Service Type Selection */}
        {!activeTab && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {['training', 'classes'].map((type, index) => (
              <motion.button
                key={type}
                onClick={() => scrollToServices(type)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                className="group relative overflow-hidden rounded-2xl bg-neutral-800/50 border border-[#bfa14a]/30 
                  p-8 text-left transition-all duration-300 hover:border-[#bfa14a] hover:bg-[#bfa14a]/5"
              >
                <h3 className="text-2xl font-bold text-[#bfa14a] mb-3">
                  {type === 'training' ? 'Personal Training' : 'Group Classes'}
                </h3>
                <p className="text-neutral-300 mb-4">
                  {type === 'training'
                    ? 'Customized one-on-one training programs tailored to your specific goals'
                    : 'Energetic group workouts led by expert instructors in various disciplines'}
                </p>
                <span className="text-sm text-[#bfa14a] font-semibold inline-flex items-center gap-2">
                  Explore Programs
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#bfa14a]/10 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              </motion.button>
            ))}
          </div>
        )}

        {/* Enhanced Navigation Tabs */}
        {activeTab && (
          <div className={`sticky top-0 z-30 -mx-4 px-4 transition-all duration-300 
            ${hasScrolled ? 'bg-neutral-900/95 shadow-lg backdrop-blur-sm' : ''}`}
          >
            <div className="flex items-center gap-4 max-w-7xl mx-auto py-4">
              <button
                onClick={() => scrollToServices(null)}
                className="px-3 py-3 rounded-lg text-[#bfa14a] hover:bg-[#bfa14a]/10 
                  transition-all duration-300"
                aria-label="Back to service selection"
              >
                <FaChevronLeft size={20} />
              </button>
              
              <div className="h-6 w-px bg-[#bfa14a]/20"/>
              
              <motion.div className="flex gap-4" layout>
                <button
                  onClick={() => setActiveTab('training')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300
                    ${activeTab === 'training' 
                      ? 'bg-[#bfa14a] text-neutral-900' 
                      : 'bg-neutral-800 text-[#bfa14a] hover:bg-[#bfa14a]/10'}`}
                >
                  Personal Training
                </button>
                <button
                  onClick={() => setActiveTab('classes')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300
                    ${activeTab === 'classes' 
                      ? 'bg-[#bfa14a] text-neutral-900' 
                      : 'bg-neutral-800 text-[#bfa14a] hover:bg-[#bfa14a]/10'}`}
                >
                  Group Classes
                </button>
              </motion.div>
            </div>
          </div>
        )}

        {/* Service Cards Grid */}
        {activeTab && (
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {services[activeTab].map((service, index) => (
                  <motion.div
                    key={service.title} 
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, delay: index * 0.1, ease: "circOut" }}
                    className="h-full" 
                  >
                    {/* START: Inline Service Card Structure */}
                    <div className="bg-neutral-800/60 backdrop-blur-md rounded-2xl shadow-xl border border-neutral-700/70 overflow-hidden h-full flex flex-col group transition-all duration-300 hover:border-[#bfa14a]/60 hover:shadow-[#bfa14a]/20 hover-lift">
                      <div className="relative w-full h-48 md:h-52 overflow-hidden">
                        <img 
                          src={service.icon} 
                          alt={service.title} 
                          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />
                        {/* Subtle overlay for text contrast or effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-100 group-hover:opacity-80 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-5 md:p-6 flex-grow flex flex-col">
                        <h4 className="text-xl lg:text-2xl font-bold text-white mb-2.5 transition-colors duration-300 group-hover:text-[#bfa14a]">
                          {service.title}
                        </h4>
                        <p className="text-neutral-300 text-sm mb-5 flex-grow leading-relaxed">
                          {service.description}
                        </p>
                        <button 
                          onClick={() => alert(`Details for ${service.title}:\n${service.details}`)} 
                          className="mt-auto self-start text-sm font-medium text-[#bfa14a] hover:text-[#e6c976] transition-colors duration-200 group-hover:underline flex items-center gap-1.5 hover-glow focus:outline-none"
                        >
                          Learn More 
                          <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                    {/* END: Inline Service Card Structure */}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}

export default Services;
