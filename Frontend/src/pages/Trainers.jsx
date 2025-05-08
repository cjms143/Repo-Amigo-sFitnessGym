import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrainers } from '../context/TrainerContext';
import { FaArrowRight, FaFilter, FaTimes } from 'react-icons/fa'; // Added filter icons
import TrainerCard from '../components/trainercomponents/TrainerCard';
import TrainerModal from '../components/trainercomponents/TrainerModal';

function Trainers() {
  const { allTrainers, loading, error } = useTrainers();
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false); // State for mobile filter menu

  // Only show active trainers in the public view
  const activeTrainers = allTrainers.filter(trainer => trainer.active);

  // Derive unique specialties from active trainers (handling the array)
  const specialties = [
    'all',
    ...new Set(
      activeTrainers
        .flatMap(trainer => trainer.specialty || []) // Flatten the arrays of specialties
        .filter(Boolean) // Remove any null/undefined specialties
    )
  ];

  // Filter trainers based on whether their specialty array includes the filter
  const filteredTrainers = filter === 'all'
    ? activeTrainers
    : activeTrainers.filter(trainer =>
        Array.isArray(trainer.specialty) && trainer.specialty.includes(filter)
      );

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setIsFilterMenuOpen(false); // Close mobile menu on selection
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 flex items-center justify-center">
        <div className="text-[#bfa14a] text-xl">Loading trainers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!activeTrainers.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 flex items-center justify-center text-center px-4">
        <div className="text-neutral-400 text-xl">No trainers available at the moment. Please check back later.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-200 py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16 md:mb-20">
          <div
            className="inline-flex items-center gap-2 bg-neutral-800/50 border border-neutral-700 rounded-full px-5 py-2 mb-6 shadow-sm"
          >
            <span className="text-[#CDAC5A] font-semibold text-sm tracking-wide">Elite Coaching Team</span>
            <FaArrowRight className="text-[#CDAC5A] text-xs" />
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400 mb-6 tracking-tight"
          >
            Meet Our <span className="text-[#CDAC5A]">World-Class</span> Trainers
          </h1>

          <p
            className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed"
          >
            Dedicated professionals committed to unlocking your potential and guiding you towards peak performance.
          </p>
        </motion.div>

        {/* Filter Section - Enhanced for Mobile */}
        {specialties.length > 1 && (
          <motion.div variants={itemVariants} className="mb-12 md:mb-16">
            {/* Mobile Filter Button */}
            <div className="md:hidden flex justify-end mb-4">
              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 hover:bg-neutral-700 transition-colors"
              >
                <FaFilter size={14} /> Filter by Specialty
              </button>
            </div>

            {/* Desktop Filter Buttons */}
            <div className="hidden md:flex flex-wrap justify-center gap-3">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => handleFilterChange(specialty)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105
                    ${filter === specialty
                      ? 'bg-[#CDAC5A] text-neutral-900 shadow-lg shadow-[#CDAC5A]/20'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'}`
                  }
                >
                  {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                </button>
              ))}
            </div>

            {/* Mobile Filter Menu (Modal-like) */}
            <AnimatePresence>
              {isFilterMenuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4 md:hidden"
                  onClick={() => setIsFilterMenuOpen(false)} // Close on backdrop click
                >
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="bg-neutral-800 rounded-xl p-6 w-full max-w-sm"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Filter by Specialty</h3>
                      <button onClick={() => setIsFilterMenuOpen(false)} className="text-neutral-400 hover:text-white">
                        <FaTimes size={20} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {specialties.map((specialty) => (
                        <button
                          key={specialty}
                          onClick={() => handleFilterChange(specialty)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-colors
                            ${filter === specialty
                              ? 'bg-[#CDAC5A] text-neutral-900 font-semibold'
                              : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`
                          }
                        >
                          {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Trainers Grid */}
        <motion.div
          variants={containerVariants} // Apply stagger to the grid itself
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" // Increased gap
        >
          {/* Use itemVariants for each card */}
          {filteredTrainers.map((trainer, index) => (
            <TrainerCard
              key={trainer._id}
              trainer={trainer}
              index={index} // Pass index for stagger animation if needed inside card, or rely on grid stagger
              onViewProfile={setSelectedTrainer}
              // Apply itemVariants here if TrainerCard doesn't handle its own animation
              // initial="hidden" animate="visible" variants={itemVariants}
            />
          ))}
        </motion.div>

        {/* Message if no trainers match filter */}
        {filteredTrainers.length === 0 && filter !== 'all' && (
           <motion.div variants={itemVariants} className="text-center py-16 text-neutral-400">
             No trainers found matching the "{filter}" specialty.
           </motion.div>
        )}

        {/* Enhanced Trainer Modal */}
        <AnimatePresence>
          <TrainerModal
            trainer={selectedTrainer}
            onClose={() => setSelectedTrainer(null)}
          />
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Trainers;
