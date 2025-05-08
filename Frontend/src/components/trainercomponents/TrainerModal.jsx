import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaYoutube, 
  FaEnvelope, FaTimes, FaPhone, FaCertificate, FaCalendarAlt, FaUserTie } from 'react-icons/fa';

const socialIconMap = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube
};

// Define the base URL for your backend server
const BACKEND_URL = 'http://localhost:5000';

// Helper to display tags
const Tag = ({ text }) => (
  <span className="px-3 py-1 text-xs rounded-full bg-[#CDAC5A]/15 text-[#CDAC5A] border border-[#CDAC5A]/30 font-medium whitespace-nowrap">
    {text}
  </span>
);

function TrainerModal({ trainer, onClose }) {
  if (!trainer) return null;

  // Ensure specialties and expertise are arrays
  const specialties = Array.isArray(trainer.specialty) ? trainer.specialty : (trainer.specialty ? [trainer.specialty] : []);
  const expertise = Array.isArray(trainer.expertise) ? trainer.expertise : (trainer.expertise ? [trainer.expertise] : []);

  // Construct the full image URL
  const imageUrl = trainer.img ? `${BACKEND_URL}${trainer.img}` : `${BACKEND_URL}/assets/images/Logo.png`; // Use backend URL for fallback too

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: "spring", damping: 20, stiffness: 200, duration: 0.4 }}
        className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl border border-neutral-700/50 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-700/50 flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaUserTie className="text-[#CDAC5A]"/> Trainer Profile
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-700/50 text-neutral-400 hover:bg-neutral-600 hover:text-white transition-all flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column (Image & Basic Info) */}
            <div className="md:col-span-1 space-y-6">
              <div className="aspect-square rounded-lg overflow-hidden border border-neutral-700 shadow-lg">
                <img
                  src={imageUrl} // Use the full URL
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{trainer.name}</h3>
                {/* Updated Specialty Display using Tags */}
                {specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {specialties.map((spec, i) => <Tag key={`spec-${i}`} text={spec} />)}
                  </div>
                )}
                <div className="space-y-2 text-sm text-neutral-300">
                  <div className="flex items-center gap-2">
                    <FaPhone size={14} className="text-[#CDAC5A] flex-shrink-0" />
                    <span>{trainer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope size={14} className="text-[#CDAC5A] flex-shrink-0" />
                    <span>{trainer.email}</span>
                  </div>
                </div>
              </div>
              {/* Social Links */}
              <div className="flex gap-3 flex-wrap">
                {Object.entries(trainer.socialMedia || {}).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIconMap[platform];
                  if (!Icon) return null; // Handle cases where platform might not be in map
                  
                  return (
                    <a
                      key={platform}
                      href={url.startsWith('http') ? url : `https://${url}`} // Ensure URL is absolute
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-neutral-700/60 text-neutral-400
                        hover:bg-[#CDAC5A]/20 hover:text-[#CDAC5A] transition-colors
                        flex items-center justify-center border border-neutral-600/50"
                      title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Column (Details) */}
            <div className="md:col-span-2 space-y-8">
              {/* Experience and Expertise */}
              <div>
                <h4 className="text-xl font-semibold text-white mb-4 border-l-4 border-[#CDAC5A] pl-3">Experience & Expertise</h4>
                <p className="text-neutral-300 mb-4 text-lg">
                  {trainer.experience ? `${trainer.experience} Years of Professional Experience` : 'Experienced Professional'}
                </p>
                {expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((exp, i) => <Tag key={`exp-${i}`} text={exp} />)}
                  </div>
                )}
              </div>

              {/* Qualifications */}
              {trainer.qualifications?.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4 border-l-4 border-[#CDAC5A] pl-3">Qualifications</h4>
                  <ul className="list-none space-y-3 pl-1">
                    {trainer.qualifications.map((qual, i) => (
                      <li key={i} className="bg-neutral-800/40 p-4 rounded-lg border border-neutral-700/50 flex items-start gap-3">
                        <FaCertificate className="text-[#CDAC5A] mt-1 flex-shrink-0" size={16}/>
                        <div>
                          <span className="font-medium text-white block text-base">{qual.title || 'N/A'}</span>
                          {qual.issuer && <span className="text-sm text-neutral-400 block">Issued by: {qual.issuer}</span>}
                          {qual.year && <span className="text-sm text-neutral-400 block">Year: {qual.year}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bio */}
              {trainer.bio && (
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4 border-l-4 border-[#CDAC5A] pl-3">About {trainer.name.split(' ')[0]}</h4>
                  <p className="text-neutral-300 whitespace-pre-line leading-relaxed prose prose-invert prose-sm max-w-none">
                    {trainer.bio}
                  </p>
                </div>
              )}

              {/* Availability - Updated to use the structured array */}
              {trainer.availability?.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4 border-l-4 border-[#CDAC5A] pl-3 flex items-center gap-2">
                     <FaCalendarAlt /> Availability
                  </h4>
                  <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700/50 space-y-2">
                    {trainer.availability.map((daySchedule) => (
                      <div key={daySchedule.day} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-neutral-200">{daySchedule.day}:</span>
                        <span className="text-neutral-300">
                          {daySchedule.slots?.length > 0 ? daySchedule.slots.join(', ') : 'Not Available'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Modal Footer - Action Button */}
        <div className="p-5 border-t border-neutral-700/50 flex-shrink-0 bg-neutral-800/50">
           <a
              href={`mailto:${trainer.email}?subject=Training Inquiry - ${trainer.name}`}
              className="w-full flex items-center justify-center gap-2 px-6 py-3
                bg-gradient-to-r from-[#CDAC5A] to-[#bfa14a] text-neutral-900 rounded-lg font-bold hover:from-[#bfa14a] hover:to-[#CDAC5A] 
                transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-base"
            >
              <FaEnvelope size={16} />
              Contact {trainer.name.split(' ')[0]}
            </a>
        </div>
      </motion.div>
    </div>
  );
}

export default TrainerModal;
