import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle, FaDumbbell } from 'react-icons/fa';
import PricingComponent from '../components/PricingComponent';
import Appointment from '../components/Appointment';
import AllFeaturesModal from '../components/AllFeaturesModal';
import '../styles/animations.css'; 

function Pricing() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 100]); 
  const opacityBg = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  
  const imageSectionRef = useRef(null);
  const { scrollYProgress: scrollYProgressImageSection } = useScroll({
    target: imageSectionRef,
    offset: ["start end", "end start"] 
  });

  
  const imageY = useTransform(scrollYProgressImageSection, [0, 1], ["-15%", "15%"]); 
  const imageOpacity = useTransform(scrollYProgressImageSection, [0, 0.3, 0.7, 1], [0, 1, 1, 0]); 

  
  const textOpacity = useTransform(scrollYProgressImageSection, [0.2, 0.5, 0.8], [0, 1, 0]); 
  const textY = useTransform(scrollYProgressImageSection, [0.2, 0.5, 0.8], ["40px", "0px", "-40px"]);

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedPlanName, setSelectedPlanName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null); 
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pricing/plans`); 
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch plans. Please try again later.');
        }
        const data = await response.json();
        
        const activePlans = Array.isArray(data) ? data.filter(plan => plan.active) : [];
        setPlans(activePlans);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    setSelectedPlanName(plan.title);
    setIsAppointmentOpen(true);
  };

  const showAllFeatures = (features, planName) => {
    setSelectedFeatures(features);
    setSelectedPlanName(planName);
    setShowFeaturesModal(true);
  };

  return (
    <section 
      ref={containerRef}
      id="pricing" 
      className="relative w-full min-h-screen py-20 md:py-28 bg-neutral-900 overflow-hidden"
    >
      {/* Animated Background Elements - Similar to Home page */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: yBg, opacity: opacityBg }}
      >
        {/* Re-using background circles logic from Home - adjust as needed */}
        {[...Array(5)].map((_, i) => { 
          const size = 200 + Math.random() * 350;
          const duration = 10 + Math.random() * 8;
          const delay = Math.random() * 2;
          return (
            <motion.div
              key={`pricing-bg-circle-${i}`}
              className="absolute rounded-full"
              initial={{
                x: `${Math.random() * 100 - 50}%`,
                y: `${Math.random() * 100 - 50}%`,
                scale: 0.5,
              }}
              animate={{
                x: [`${Math.random() * 100 - 50}%`, `${Math.random() * 100 - 50}%`],
                y: [`${Math.random() * 100 - 50}%`, `${Math.random() * 100 - 50}%`],
                scale: [0.6, 1, 0.6],
                opacity: [0.02, 0.08, 0.02],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: delay,
              }}
              style={{
                background: 'radial-gradient(circle, rgba(191,161,74,0.1) 0%, rgba(191,161,74,0) 60%)',
                width: `${size}px`,
                height: `${size}px`,
                filter: 'blur(8px)'
              }}
            />
          );
        })}
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23bfa14a' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '28px 28px'
          }}
        />
      </motion.div>

      {/* Page Content */}
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
          className="text-center mb-16 md:mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            {"Choose Your".split(" ").map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: "circOut" }}
                className="inline-block mr-2 lg:mr-3"
              >
                {word}
              </motion.span>
            ))}
            <br className="sm:hidden" />
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + "Choose Your".split(" ").length * 0.15, ease: "circOut" }}
              className="text-[#bfa14a] inline-block animate-gradient-shift bg-gradient-to-r from-[#bfa14a] via-[#f0d68c] to-[#c8a956] bg-clip-text text-transparent"
            >
              Perfect Plan
            </motion.span>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "circOut" }}
            className="mt-4 text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed"
          >
            Select a plan that best suits your fitness goals and budget. All plans include access to our top-notch facilities and expert trainers.
          </motion.p>
        </motion.div>

        {/* Plans Container Wrapper - This div will center its content and manage the row of plans */}
        <div className="flex flex-nowrap justify-center items-stretch"> {/* Changed items-start to items-stretch */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center w-full"> {/* Added w-full for loading/error states to take up space if needed */} 
              <FaSpinner className="text-amber-400 text-5xl mb-6 animate-spin" />
              <h2 className="text-2xl font-semibold text-white mb-2">Loading Our Fitness Plans...</h2>
              <p className="text-neutral-400">Please wait a moment as we prepare the best options for you.</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-neutral-800/50 border border-red-500/30 p-8 rounded-xl shadow-lg text-center w-full"> {/* Added w-full */} 
              <FaExclamationTriangle className="text-red-400 text-5xl mb-6" />
              <h2 className="text-2xl font-semibold text-red-400 mb-2">Oops! Something Went Wrong</h2>
              <p className="text-neutral-300 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-900 rounded-lg
                  hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Retry
              </button>
            </div>
          ) : Array.isArray(plans) && plans.length > 0 ? (
            
            plans.map((plan, index) => (
              <motion.div
                key={plan._id || index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="flex-shrink-0 m-2.5 flex" 
              >
                <PricingComponent
                  plan={plan}
                  index={index} 
                  onChoosePlan={handlePlanSelection}
                  onViewAllFeatures={() => showAllFeatures(plan.features, plan.title)}
                />
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-neutral-800/50 border border-neutral-700/50 p-8 rounded-xl shadow-lg text-center w-full"> {/* Added w-full */} 
              <FaDumbbell className="text-amber-400 text-5xl mb-6" />
              <h2 className="text-2xl font-semibold text-white mb-2">No Plans Available</h2>
              <p className="text-neutral-400">We currently don't have any active plans. Please check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* New Parallax Image Section */}
      <motion.section
        ref={imageSectionRef}
        className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center mt-16 md:mt-24 mb-10 md:mb-16"
      >
        <motion.div
          className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url('/assets/images/PricingBG.jpg')`,
            y: imageY, 
            opacity: imageOpacity, 
            scale: 1.1 
          }}
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div> {/* Darker Overlay for better text contrast */}
        
        <motion.div 
          className="relative z-20 text-center px-6 max-w-3xl mx-auto"
          style={{ opacity: textOpacity, y: textY }} 
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Invest in <span className="text-[#bfa14a] animate-gradient-shift bg-gradient-to-r from-[#bfa14a] via-[#f0d68c] to-[#c8a956] bg-clip-text text-transparent">Your Future Fitness</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-200 max-w-xl mx-auto mb-10 leading-relaxed">
            Our flexible plans are designed to support your journey, providing the tools and motivation you need to succeed and transform.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(191, 161, 74, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const pricingSection = document.getElementById('pricing'); 
              pricingSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="px-10 py-4 bg-gradient-to-r from-[#bfa14a] to-[#d4b65e] text-neutral-900 rounded-xl font-semibold 
              transition-all duration-300 shadow-xl hover-glow border-2 border-transparent hover:border-[#ffe599]"
          >
            Review Our Plans
          </motion.button>
        </motion.div> 
      </motion.section>

      {/* Modals */}
      <AllFeaturesModal
        open={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
        features={selectedFeatures}
        planName={selectedPlanName}
      />

      <Appointment
        open={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        plan={selectedPlan}
      />
    </section>
  );
}

export default Pricing;