import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaDumbbell, FaChartLine, FaUsers, FaMedal } from 'react-icons/fa';

function AboutUs() {
  const statsRef = useRef(null);

  useEffect(() => {
    const numbers = document.querySelectorAll('.animate-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.getAttribute('data-target'));
          const duration = 2000;
          const increment = target / (duration / 16);
          let current = 0;

          const updateNumber = () => {
            current += increment;
            if (current < target) {
              element.textContent = Math.floor(current).toLocaleString();
              requestAnimationFrame(updateNumber);
            } else {
              element.textContent = target.toLocaleString();
            }
          };

          requestAnimationFrame(updateNumber);
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    numbers.forEach(number => observer.observe(number));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: FaUsers, value: 2500, label: 'Active Members', suffix: '+' },
    { icon: FaDumbbell, value: 50, label: 'Weekly Classes', suffix: '+' },
    { icon: FaChartLine, value: 95, label: 'Success Rate', suffix: '%' },
    { icon: FaMedal, value: 15, label: 'Expert Trainers', suffix: '' }
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from our facilities to our training programs.',
      image: '/assets/images/strengthandconditioning.png'
    },
    {
      title: 'Community',
      description: 'Building a supportive and motivating community where everyone feels welcome and inspired.',
      image: '/assets/images/circuittraining.png'
    },
    {
      title: 'Innovation',
      description: 'Staying at the forefront of fitness technology and training methodologies.',
      image: '/assets/images/dynamicfuntionaltraining.png'
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-900" id="about-us">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/images/AUbg.png"
            alt="Gym Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/80 via-neutral-900/90 to-neutral-900" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#bfa14a]/10 rounded-full px-4 py-2 mb-4">
              <span className="text-[#bfa14a] font-medium">Our Story</span>
              <FaArrowRight className="text-[#bfa14a] text-sm" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Building a <span className="text-[#bfa14a]">Stronger</span> Community
            </h1>
            
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Since 2015, we've been dedicated to helping our members achieve their fitness goals
              through expert guidance, state-of-the-art facilities, and a supportive community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                  bg-[#bfa14a]/10 text-[#bfa14a] mb-4"
                >
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  <span className="animate-number" data-target={stat.value}>0</span>
                  {stat.suffix}
                </div>
                <div className="text-neutral-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Our <span className="text-[#bfa14a]">Mission</span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              To empower individuals to transform their lives through fitness, providing the tools,
              knowledge, and support needed to achieve lasting health and wellness.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-neutral-800/30 p-6 border border-neutral-700/50
                  hover:border-[#bfa14a]/30 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-xl overflow-hidden mb-6
                    bg-gradient-to-br from-[#bfa14a]/10 to-transparent"
                  >
                    <img 
                      src={value.image}
                      alt={value.title}
                      className="w-full h-full object-contain p-4 transition-transform duration-500
                        group-hover:scale-110 group-hover:rotate-3"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#bfa14a] transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#bfa14a]/5 via-transparent to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-neutral-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              State-of-the-Art <span className="text-[#bfa14a]">Facilities</span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Our modern gym is equipped with the latest fitness technology and equipment to support
              your wellness journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { title: 'Cardio Zone', image: 'homeImg.jpg' },
              { title: 'Weight Area', image: 'bodytoning.png' },
              { title: 'Functional Zone', image: 'dynamicfuntionaltraining.png' },
              { title: 'Studio Classes', image: 'zumbaclass.png' },
              { title: 'Recovery Area', image: 'athletictraining.png' },
              { title: 'Boxing Ring', image: 'boxingclass.png' }
            ].map((facility, index) => (
              <motion.div
                key={facility.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-64 overflow-hidden rounded-2xl"
              >
                <img
                  src={`/assets/images/${facility.image}`}
                  alt={facility.title}
                  className="w-full h-full object-cover transition-transform duration-700
                    group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#bfa14a] transition-colors">
                    {facility.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;