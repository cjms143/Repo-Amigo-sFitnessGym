import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff, FaPhone, FaUser } from 'react-icons/fa';

function TrainerList({ trainers, onEdit, onDelete, onToggleStatus }) {
  if (!trainers || trainers.length === 0) {
    return <p className="text-neutral-400 text-center col-span-full">No trainers found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainers.map((trainer, index) => {
        // Use import.meta.env.VITE_API_URL for image URLs
        const imageUrl = trainer.img ? `${import.meta.env.VITE_API_URL}${trainer.img}` : '/assets/images/Logo.png'; // Keep fallback relative

        return (
          <motion.div
            key={trainer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`relative overflow-hidden group rounded-xl transition-all duration-300
              backdrop-blur-sm border
              ${trainer.active 
                ? 'bg-neutral-800/30 border-[#bfa14a]/20 hover:border-[#bfa14a]/40' 
                : 'bg-neutral-800/20 border-red-500/20 hover:border-red-500/40 opacity-75'}`}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-700">
                    <img
                      src={imageUrl} // Use the full URL
                      alt={trainer.name}
                      className="w-full h-full object-cover transition-transform duration-700 
                        group-hover:scale-110"
                    />
                  </div>
                  <button
                    onClick={() => onToggleStatus(trainer._id)}
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center
                      transition-colors ${trainer.active ? 'bg-[#bfa14a]' : 'bg-red-500'}`}
                    title={trainer.active ? 'Deactivate trainer' : 'Activate trainer'}
                  >
                    {trainer.active ? <FaToggleOn className="text-neutral-900" /> : <FaToggleOff className="text-white" />}
                  </button>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#bfa14a] transition-colors">
                    {trainer.name}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-2">{trainer.specialty}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 rounded-md bg-[#bfa14a]/10 text-[#bfa14a]">
                      {trainer.experience || '0'} Years Exp.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  <FaPhone className="text-[#bfa14a]" />
                  <span>{trainer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  <FaUser className="text-[#bfa14a]" />
                  <span className="truncate" title={trainer.schedule}>{trainer.schedule || 'Not set'}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => onEdit(trainer)}
                  className="flex-1 px-4 py-2 rounded-lg bg-neutral-700/50 text-[#bfa14a] 
                    hover:bg-[#bfa14a]/10 transition-colors flex items-center justify-center gap-2"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => onDelete(trainer._id)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 
                    hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default TrainerList;
