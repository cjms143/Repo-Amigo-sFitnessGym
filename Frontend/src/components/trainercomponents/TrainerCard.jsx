import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaArrowRight, FaStar } from 'react-icons/fa';


const BACKEND_URL = import.meta.env.VITE_API_URL;


const formatSpecialties = (specialties) => {
  if (!Array.isArray(specialties) || specialties.length === 0) {
    return 'General Fitness'; 
  }
  
  return specialties.slice(0, 3).join(' • '); 
};

function TrainerCard({ trainer, index, onViewProfile }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1, 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const specialtiesDisplay = formatSpecialties(trainer.specialty);
  
  const imagePath = trainer.img || '';
  const imageUrl = imagePath
    ? `${import.meta.env.VITE_API_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
    : null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }} 
      className="bg-neutral-800/50 border border-neutral-700 rounded-xl overflow-hidden
                 shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
      onClick={() => onViewProfile(trainer)}
    >
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={trainer.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
            <FaUserCircle className="w-20 h-20 text-neutral-500" />
          </div>
        )}
         {/* Featured Badge */}
         {trainer.featured && (
            <div className="absolute top-3 right-3 bg-[#bfa14a] text-neutral-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                <FaStar size={10}/> Featured
            </div>
         )}
         {/* Overlay for hover effect */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1 truncate">{trainer.name}</h3>
          {/* Updated Specialty Display */}
          <p className="text-sm text-[#bfa14a] font-medium mb-3 truncate" title={Array.isArray(trainer.specialty) ? trainer.specialty.join(', ') : ''}>
            {specialtiesDisplay}
            {Array.isArray(trainer.specialty) && trainer.specialty.length > 3 ? '...' : ''}
          </p>
          <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
            {trainer.bio || 'Experienced trainer dedicated to helping you achieve your fitness goals.'}
          </p>
        </div>

        {/* Footer / Action */}
        <div className="mt-auto pt-3 border-t border-neutral-700/50 flex justify-between items-center">
           <span className="text-xs text-neutral-500">
             {trainer.experience ? `${trainer.experience} Years Exp.` : 'Experienced'}
           </span>
           <div className="flex items-center gap-1 text-sm text-[#bfa14a] group-hover:text-[#d4b65e] transition-colors">
             View Profile <FaArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
           </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TrainerCard;
