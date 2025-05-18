import React, { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaUserCircle, FaChevronDown, FaInfoCircle, FaPlus, FaTrash, FaInstagram, FaFacebook } from 'react-icons/fa'; 


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
  const nameRef = useRef();
  const bioRef = useRef();
  const specialtyRef = useRef();
  const formRef = useRef();
  const [shake, setShake] = useState(false);
  const [availability, setAvailability] = useState(() => parseScheduleString(formData.schedule));
  const [fieldErrors, setFieldErrors] = useState({});
  // Per-field shake state
  const [fieldShake, setFieldShake] = useState({});

  
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
  }


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

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target; // name will be 'facebook', 'instagram', 'twitter'
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...(prev.socialMedia || {}),
        [name]: value
      }
    }));
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target; // name will be 'yearsOfExperience'
    let processedValue = value;
    if (e.target.type === 'number') {
      processedValue = value === '' ? '' : parseInt(value, 10);
      if (isNaN(processedValue)) processedValue = ''; 
    }
    setFormData(prev => ({
      ...prev,
      experience: {
        ...(prev.experience || {}),
        [name]: processedValue
      }
    }));
  };

  const handleCertificationsChange = (e) => {
    const { value } = e.target; // This will be for the textarea
    setFormData(prev => ({
      ...prev,
      experience: {
        ...(prev.experience || {}),
        certifications: value.split(',').map(cert => cert.trim()).filter(cert => cert !== '')
      }
    }));
  };

  // Handle change for time slots input (comma-separated string to array)
  const handleTimeSlotsChange = (e) => {
    const { value } = e.target;
    const timeSlotsArray = value.split(',').map(slot => slot.trim()).filter(slot => slot !== '' && timeSlots.includes(slot));
    setAvailability(prev => ({
      ...prev,
      [e.target.name]: timeSlotsArray
    }));
  };

  // Validation and error handling on submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const currentFieldErrors = {};
    let firstErrorRef = null;
    let newFieldShake = {};

    if (!formData.name?.trim()) {
      currentFieldErrors.name = 'Full name is required.';
      if (!firstErrorRef) firstErrorRef = nameRef;
      newFieldShake.name = true;
    }
    if (!formData.bio?.trim()) {
      currentFieldErrors.bio = 'Bio is required.';
      if (!firstErrorRef) firstErrorRef = bioRef;
      newFieldShake.bio = true;
    }
    if (!formData.specialty || formData.specialty.length === 0) {
      currentFieldErrors.specialty = 'At least one specialty is required.';
      if (!firstErrorRef) firstErrorRef = specialtyRef;
      newFieldShake.specialty = true;
    }
    // Add other synchronous validations here if needed

    setFieldErrors(currentFieldErrors);
    setFieldShake(newFieldShake);
    setTimeout(() => setFieldShake({}), 500);

    if (Object.keys(currentFieldErrors).length > 0) {
      toast.error('Please fill in all required fields.');
      if (firstErrorRef && firstErrorRef.current && formRef.current) {
        // Get the scrollable form container
        const formEl = formRef.current;
        const fieldEl = firstErrorRef.current;
        // Get bounding rectangles
        const formRect = formEl.getBoundingClientRect();
        const fieldRect = fieldEl.getBoundingClientRect();
        // Check if field is already fully visible in the form
        if (fieldRect.top < formRect.top || fieldRect.bottom > formRect.bottom) {
          // Scroll so the field is centered in the form
          const offset = fieldEl.offsetTop - formEl.offsetHeight / 2 + fieldEl.offsetHeight / 2;
          formEl.scrollTo({ top: offset, behavior: 'smooth' });
        }
        // Focus the field
        const elementToFocus = fieldEl.querySelector('input, textarea, [tabindex]') || fieldEl;
        if (elementToFocus && typeof elementToFocus.focus === 'function') {
          elementToFocus.focus();
        }
      }
      return;
    }
    
    // If there are external (async) errors passed via props, also consider them
    // This part depends on how `errors` prop is populated by the parent component
    if (Object.keys(errors).some(key => errors[key] && touched[key])) {
        // Potentially show a generic message or handle as per existing logic for async errors
        // For now, we assume `handleSubmit` (the prop) handles async error display
    }

    await handleSubmit(e); // Proceed with original submit logic
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss={false} draggable pauseOnHover={false} />
      <form ref={formRef} onSubmit={handleFormSubmit} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <h2 className="text-2xl font-semibold text-white mb-6 pb-4 border-b border-neutral-700">
          {editingTrainer ? '' : ''}
        </h2>
        <div className="space-y-8">

          <section className="p-6 bg-neutral-800/30 border border-neutral-700 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-6">Basic Information</h3>
            {/* Changed grid layout: md:grid-cols-3 for image | fields | fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              {/* Column 1: Image Upload */}
              <div className="md:col-span-1 flex flex-col items-center md:items-start">
                <label className="block text-sm font-medium text-neutral-400 mb-2 self-start md:self-auto">
                  Profile Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-40 h-40 rounded-xl overflow-hidden bg-neutral-700 cursor-pointer
                    hover:opacity-80 transition-opacity group border border-neutral-600 flex items-center justify-center"
                >
                  {formData.img ? (
                    <img
                      src={getImageUrl(formData.img)} 
                      alt="Trainer preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-500 h-full">
                      <FaUserCircle className="w-16 h-16 text-neutral-400" />
                      <span className="mt-2 text-xs">Click to upload</span>
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
                {/* TODO: Consider adding error display for image if validation is added */}
              </div>

              {/* Column 2 & 3: Input Fields */}
              <div className="md:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <InputField label="Full Name" name="name" error={fieldErrors.name} touched={true} required ref={nameRef} 
                    className={fieldShake.name ? 'animate-shake' : ''}>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full bg-neutral-700 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${getErrorClass('name')}`}
                      aria-invalid={(errors.name && touched.name) || fieldErrors.name ? "true" : "false"}
                      aria-describedby={errors.name && touched.name ? "name-error" : (fieldErrors.name ? "name-error" : undefined)}
                    />
                  </InputField>

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
                </div> {/* End of 2x2 grid for basic inputs */}

                <div ref={specialtyRef} tabIndex={-1} className={fieldShake.specialty ? 'animate-shake' : ''}>
                  <DropdownCheckbox
                    label="Specialties"
                    options={specialtyOptions}
                    selectedOptions={Array.isArray(formData.specialty) ? formData.specialty : []}
                    onChange={(value, checked) => handleMultiSelectChange('specialty', value, checked)}
                    error={fieldErrors.specialty}
                    touched={true}
                  />
                </div>

                <div>
                  <DropdownCheckbox
                    label="Expertise Areas"
                    options={expertiseOptions}
                    selectedOptions={Array.isArray(formData.expertise) ? formData.expertise : []}
                    onChange={(value, checked) => handleMultiSelectChange('expertise', value, checked)}
                    error={errors.expertise} // Propagated errors
                    touched={touched.expertise} // Propagated touched state
                  />
                </div>
              </div> {/* End of md:col-span-2 fields area */}
            </div> {/* End of main grid for Basic Information section */}
          </section>

          {/* Section: Details */}
          <section className="p-6 bg-neutral-800/30 border border-neutral-700 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-6">Details & Qualifications</h3>
            <div className="space-y-6">
              {/* Bio */}
              <InputField label="Bio" name="bio" error={fieldErrors.bio} touched={true} required ref={bioRef}
                className={fieldShake.bio ? 'animate-shake' : ''}>
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
    </>
  );
}

export default TrainerForm;

// Add shake animation to CSS if not present:
// .animate-shake { animation: shake 0.5s; }
// @keyframes shake { 10%, 90% { transform: translateX(-2px); } 20%, 80% { transform: translateX(4px); } 30%, 50%, 70% { transform: translateX(-8px); } 40%, 60% { transform: translateX(8px); } }
