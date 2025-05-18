import React, { useState, useRef, useEffect } from 'react';

import { FaUserCircle, FaPlus, FaTrash, FaChevronDown, FaInfoCircle, FaInstagram, FaFacebook } from 'react-icons/fa'; 


const specialtyOptions = [
  "Strength Training", "Yoga", "Pilates", "CrossFit", "Cardio Specialist",
  "Nutrition Coach", "Weight Loss/Gain", "Body Toning", "Circuit Training",
  "Muay Thai", "Boxing", "Zumba", "Running Clinic", "Athletic Training",
  "Dynamic Functional Training", "Tabata",
];

const expertiseOptions = [
  'Weight Training', 'Cardio', 'HIIT', 'Yoga', 'Pilates', 'CrossFit',
  'Martial Arts', 'Nutrition', 'Sports Performance', 'Rehabilitation',
  'Senior Fitness', 'Pre/Post Natal', 'Group Training', 'Personal Training',
  'Weight Loss'
];


const DropdownCheckbox = ({ label, options, selectedOptions, onChange, error, touched }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    onChange(value, checked);
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayValue = selectedOptions.length > 0
    ? `${selectedOptions.length} selected`
    : `Select ${label.toLowerCase()}...`;

  const showError = error && touched;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-neutral-400 mb-1">
        {label} *
      </label>
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full bg-neutral-700 border rounded-lg px-4 py-2 text-left flex justify-between items-center
          text-white focus:outline-none transition-colors
          ${showError
            ? 'border-red-500 focus:border-red-500'
            : 'border-neutral-600 focus:border-[#bfa14a]'}`}
        aria-invalid={showError ? "true" : "false"} 
        aria-describedby={showError ? `${label.toLowerCase().replace(/\s+/g, '-')}-error` : undefined}
      >
        <span className={selectedOptions.length === 0 ? 'text-neutral-500' : ''}>{displayValue}</span>
        <FaChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-700">
          {options.map(option => (
            <label key={option} className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={handleCheckboxChange}
                className="w-4 h-4 rounded border-neutral-500 text-[#bfa14a] bg-neutral-600 focus:ring-[#bfa14a] focus:ring-offset-neutral-800"
              />
              <span className="text-sm text-neutral-300">{option}</span>
            </label>
          ))}
        </div>
      )}
      {/* Inline Error Message */}
      {showError && (
        <p id={`${label.toLowerCase().replace(/\s+/g, '-')}-error`} className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <FaInfoCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
};


const InputField = ({ label, name, error, touched, children, required = false, className = '' }) => {
  const showError = error && touched;
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-400 mb-1">
        {label} {required && '*'}
      </label>
      {children}
      {/* Inline Error Message */}
      {showError && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <FaInfoCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
};







const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['Morning', 'Afternoon', 'Evening']; 


const parseScheduleString = (scheduleString) => {
  if (!scheduleString || typeof scheduleString !== 'string') return {};
  const availability = {};
  daysOfWeek.forEach(day => availability[day] = []); 

  const lines = scheduleString.split('\n');
  lines.forEach(line => {
    const parts = line.split(':');
    if (parts.length === 2) {
      const day = parts[0].trim();
      const slots = parts[1].split(',').map(s => s.trim()).filter(s => timeSlots.includes(s));
      if (daysOfWeek.includes(day)) {
        availability[day] = slots;
      }
    }
  });
  return availability;
};


const formatAvailabilityToString = (availabilityObject) => {
  return daysOfWeek
    .map(day => {
      const slots = availabilityObject[day] || [];
      if (slots.length > 0) {
        return `${day}: ${slots.join(', ')}`;
      }
      return null;
    })
    .filter(line => line !== null)
    .join('\n');
};



function TrainerForm({
  formData,
  setFormData,
  handleSubmit,
  resetForm,
  editingTrainer,
  errors = {}, 
  touched = {}, 
  handleBlur,
  
}) {
  const fileInputRef = useRef(null);
  
  const [availability, setAvailability] = useState(() => parseScheduleString(formData.schedule));

  
  useEffect(() => {
    setAvailability(parseScheduleString(formData.schedule));
  }, [formData.schedule]);

  
  useEffect(() => {
    const newScheduleString = formatAvailabilityToString(availability);
    
    if (newScheduleString !== formData.schedule) {
      setFormData(prev => ({
        ...prev,
        schedule: newScheduleString
      }));
      
      
      
      
      
      
    }
    
    
  }, [availability]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('social_')) {
      const platform = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value 
      }));
    }
    
  };

  
  const handleMultiSelectChange = (fieldName, optionValue, isChecked) => {
    setFormData(prev => {
      const currentSelection = Array.isArray(prev[fieldName]) ? prev[fieldName] : [];
      let newSelection;
      if (isChecked) {
        newSelection = [...currentSelection, optionValue];
      } else {
        newSelection = currentSelection.filter(item => item !== optionValue);
      }
      
      if (handleBlur) {
        handleBlur({ target: { name: fieldName } });
      }
      return { ...prev, [fieldName]: newSelection };
    });
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          img: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  
  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...(prev.qualifications || []), { title: '', issuer: '', year: '' }]
    }));
  };

  const removeQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const updateQualification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((qual, i) =>
        i === index ? { ...qual, [field]: value } : qual
      )
    }));
  };
  

  
  const getErrorClass = (fieldName) => {
    
    const fieldParts = fieldName.split('.');
    let errorValue = errors;
    let touchedValue = touched;
    for (const part of fieldParts) {
      errorValue = errorValue?.[part];
      touchedValue = touchedValue?.[part];
    }

    return errorValue && touchedValue
      ? 'border-red-500 focus:border-red-500'
      : 'border-neutral-600 focus:border-[#bfa14a]';
  };

  
  const handleResetForm = () => {
    resetForm(); 
    setAvailability({}); 
  };

  
  const handleAvailabilityChange = (day, slot) => {
    setAvailability(prev => {
      const currentSlots = prev[day] || [];
      const newSlots = currentSlots.includes(slot)
        ? currentSlots.filter(s => s !== slot) 
        : [...currentSlots, slot]; 
      return { ...prev, [day]: newSlots };
    });
  };

  
  const getImageUrl = (imgData) => {
    if (!imgData) return undefined;
    
    if (typeof imgData === 'string' && imgData.startsWith('data:image')) return imgData;
    
    return `${import.meta.env.VITE_API_URL}${imgData.startsWith('/') ? '' : '/'}${imgData}`;
  };

  return (
    
    <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-150px)] scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-700">
      <h2 className="text-2xl font-semibold text-white mb-6 pb-4 border-b border-neutral-700">
        {editingTrainer ? 'Edit Trainer Profile' : 'Add New Trainer'}
      </h2>
      <div className="space-y-8"> {/* Increased spacing between sections */}

        {/* Section: Basic Information */}
        <section className="p-6 bg-neutral-800/30 border border-neutral-700 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"> {/* Adjusted gap */}
            {/* Image Upload */}
            <div className="md:col-span-2 mb-4"> {/* Span across columns and add margin */}
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Profile Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-32 h-32 rounded-xl overflow-hidden bg-neutral-700 cursor-pointer
                  hover:opacity-80 transition-opacity group border border-neutral-600"
              >
                {formData.img ? (
                  <img
                    src={getImageUrl(formData.img)} 
                    alt="Trainer preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaUserCircle className="w-12 h-12 text-neutral-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm text-center px-2">Change Image</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Name */}
            <InputField label="Full Name" name="name" error={errors.name} touched={touched.name} required>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full bg-neutral-700 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${getErrorClass('name')}`}
                aria-invalid={errors.name && touched.name ? "true" : "false"}
                aria-describedby={errors.name && touched.name ? "name-error" : undefined}
              />
            </InputField>

            {/* Email */}
            <InputField label="Email" name="email" error={errors.email} touched={touched.email} required>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full bg-neutral-700 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${getErrorClass('email')}`}
                aria-invalid={errors.email && touched.email ? "true" : "false"}
                aria-describedby={errors.email && touched.email ? "email-error" : undefined}
              />
            </InputField>

            {/* Phone */}
            <InputField label="Phone Number" name="phone" error={errors.phone} touched={touched.phone} required>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full bg-neutral-700 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${getErrorClass('phone')}`}
                aria-invalid={errors.phone && touched.phone ? "true" : "false"}
                aria-describedby={errors.phone && touched.phone ? "phone-error" : undefined}
              />
            </InputField>

            {/* Experience */}
            <InputField label="Experience (Years)" name="experience" error={errors.experience} touched={touched.experience} required>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                onBlur={handleBlur}
                min="0"
                placeholder="e.g., 5"
                className={`w-full bg-neutral-700 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${getErrorClass('experience')}`}
                aria-invalid={errors.experience && touched.experience ? "true" : "false"}
                aria-describedby={errors.experience && touched.experience ? "experience-error" : undefined}
              />
            </InputField>

            {/* Specialty Dropdown Checkbox */}
            <DropdownCheckbox
              label="Specialties"
              options={specialtyOptions}
              selectedOptions={Array.isArray(formData.specialty) ? formData.specialty : []}
              onChange={(value, checked) => handleMultiSelectChange('specialty', value, checked)}
              error={errors.specialty}
              touched={touched.specialty}
            />

            {/* Expertise Dropdown Checkbox */}
            <DropdownCheckbox
              label="Expertise Areas"
              options={expertiseOptions}
              selectedOptions={Array.isArray(formData.expertise) ? formData.expertise : []}
              onChange={(value, checked) => handleMultiSelectChange('expertise', value, checked)}
              error={errors.expertise}
              touched={touched.expertise}
            />
          </div>
        </section>

        {/* Section: Details */}
        <section className="p-6 bg-neutral-800/30 border border-neutral-700 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Details & Qualifications</h3>
          <div className="space-y-6">
            {/* Bio */}
            <InputField label="Bio" name="bio" error={errors.bio} touched={touched.bio} required>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                onBlur={handleBlur}
                rows="5" 
                placeholder="Brief introduction about the trainer, their philosophy, and what clients can expect..."
                className={`w-full bg-neutral-700 border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#bfa14a] transition-colors resize-y ${getErrorClass('bio')}`}
                aria-invalid={errors.bio && touched.bio ? "true" : "false"}
                aria-describedby={errors.bio && touched.bio ? "bio-error" : undefined}
              />
            </InputField>

            {/* Qualifications */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-neutral-400">
                  Qualifications
                </label>
                <button
                  type="button"
                  onClick={addQualification}
                  className="text-sm text-[#bfa14a] hover:text-[#d4b65e] transition-colors
                      flex items-center gap-1"
                >
                  <FaPlus size={12} /> Add Qualification
                </button>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-700">
                {(formData.qualifications || []).map((qual, index) => (
                  <div key={index} className="p-3 bg-neutral-700/50 rounded-lg border border-neutral-600/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-neutral-300">Qualification #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeQualification(index)}
                        className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                        title="Remove Qualification"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={qual.title}
                      onChange={(e) => updateQualification(index, 'title', e.target.value)}
                      placeholder="Certification/Degree Title"
                      className="w-full bg-neutral-600 border border-neutral-500 rounded-md px-3 py-1.5 text-sm
                          text-white focus:outline-none focus:border-[#bfa14a] transition-colors"
                    />
                    <input
                      type="text"
                      value={qual.issuer}
                      onChange={(e) => updateQualification(index, 'issuer', e.target.value)}
                      placeholder="Issuing Body (e.g., NASM, University)"
                      className="w-full bg-neutral-600 border border-neutral-500 rounded-md px-3 py-1.5 text-sm
                          text-white focus:outline-none focus:border-[#bfa14a] transition-colors"
                    />
                    <input
                      type="number"
                      value={qual.year}
                      onChange={(e) => updateQualification(index, 'year', e.target.value)}
                      placeholder="Year Obtained"
                      min="1950"
                      max={new Date().getFullYear() + 1} 
                      className="w-full bg-neutral-600 border border-neutral-500 rounded-md px-3 py-1.5 text-sm
                          text-white focus:outline-none focus:border-[#bfa14a] transition-colors"
                    />
                  </div>
                ))}
                {(formData.qualifications || []).length === 0 && (
                  <p className="text-sm text-neutral-500 text-center py-4 border border-dashed border-neutral-600 rounded-lg">No qualifications added yet.</p>
                )}
              </div>
              {/* Potential error display for qualifications array if needed */}
              {errors.qualifications && touched.qualifications && typeof errors.qualifications === 'string' && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <FaInfoCircle size={12} /> {errors.qualifications}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Section: Availability & Contact - UPDATED */}
        <section className="p-6 bg-neutral-800/30 border border-neutral-700 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Availability & Contact</h3>
          <div className="space-y-6">

            {/* Availability Selector */}
            <InputField label="Weekly Availability" name="schedule" error={errors.schedule} touched={touched.schedule}>
              <div className="space-y-3 p-4 bg-neutral-700/50 rounded-lg border border-neutral-600/50">
                {daysOfWeek.map(day => (
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <span className="w-24 font-medium text-neutral-300 text-sm mb-1 sm:mb-0">{day}</span>
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map(slot => {
                        const isSelected = availability[day]?.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleAvailabilityChange(day, slot)}
                            className={`px-3 py-1 rounded text-xs transition-colors
                              ${isSelected
                                ? 'bg-[#bfa14a] text-neutral-900 font-semibold'
                                : 'bg-neutral-600 hover:bg-neutral-500 text-neutral-300'}`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-neutral-500">Select available time slots for each day. This information will be displayed publicly.</p>
            </InputField>
            {/* Display the generated schedule string for debugging/confirmation (Optional) */}
            {/* <div className="mt-2">
              <label className="block text-xs font-medium text-neutral-400 mb-1">Generated Schedule String (for saving):</label>
              <pre className="text-xs p-2 bg-neutral-900 rounded text-neutral-300 whitespace-pre-wrap">{formData.schedule || 'No availability selected'}</pre>
            </div> */}

            {/* Social Media - Modernized */}
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-3">
                Social Media Links (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Instagram */}
                <InputField label="Instagram URL" name="social_instagram" error={errors.socialMedia?.instagram} touched={touched.socialMedia?.instagram}>
                  <div className="relative flex items-center">
                    <FaInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input
                      type="url"
                      id="social_instagram"
                      name="social_instagram"
                      value={formData.socialMedia?.instagram || ''}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="instagram.com/username"
                      
                      className={`w-full bg-neutral-700 border rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#bfa14a] transition-colors ${getErrorClass('socialMedia.instagram')}`}
                      aria-invalid={errors.socialMedia?.instagram && touched.socialMedia?.instagram ? "true" : "false"}
                      aria-describedby={errors.socialMedia?.instagram && touched.socialMedia?.instagram ? "social_instagram-error" : undefined}
                    />
                  </div>
                </InputField>

                {/* Facebook */}
                <InputField label="Facebook URL" name="social_facebook" error={errors.socialMedia?.facebook} touched={touched.socialMedia?.facebook}>
                  <div className="relative flex items-center">
                    <FaFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <input
                      type="url"
                      id="social_facebook"
                      name="social_facebook"
                      value={formData.socialMedia?.facebook || ''}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="facebook.com/profile"
                      
                      className={`w-full bg-neutral-700 border rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#bfa14a] transition-colors ${getErrorClass('socialMedia.facebook')}`}
                      aria-invalid={errors.socialMedia?.facebook && touched.socialMedia?.facebook ? "true" : "false"}
                      aria-describedby={errors.socialMedia?.facebook && touched.socialMedia?.facebook ? "social_facebook-error" : undefined}
                    />
                  </div>
                </InputField>
                {/* Add more social media inputs here following the same pattern if needed */}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-neutral-700">
        <button
          type="button"
          onClick={handleResetForm} 
          className="px-6 py-2 rounded-lg text-neutral-400 hover:text-white
            transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[#bfa14a] text-neutral-900 rounded-lg font-medium
            hover:bg-[#CDAC5A] transition-colors"
        >
          {editingTrainer ? 'Update Trainer' : 'Add Trainer'}
        </button>
      </div>
    </form>
  );
}

export default TrainerForm;
