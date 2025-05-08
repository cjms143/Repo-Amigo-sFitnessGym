import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaStar, FaCheck, FaTrash } from 'react-icons/fa';

function PlanFormModal({
  isModalOpen,
  onClose,
  editingPlan,
  formData,
  setFormData,
  handleSubmit,
  addFeature,
  removeFeature,
  updateFeature,
  featureCategories
}) {
  if (!isModalOpen) return null;

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    // Allow empty string for user input, but store as 0 or valid number
    setFormData({ ...formData, price: newPrice === '' ? '' : Number(newPrice) });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    // Ensure price is a number before submitting, default to 0 if empty or invalid
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price) || 0
    };
    handleSubmit(e, submissionData); // Pass the modified submissionData
  };


  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.90, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.90, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800"
          >
            <form onSubmit={onFormSubmit}> {/* Changed to onFormSubmit */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bfa14a] to-[#E0C068]">
                  {editingPlan ? 'Edit Fitness Plan' : 'Create New Fitness Plan'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-neutral-500 hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-700"
                >
                  <FaTimes size={20}/>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label htmlFor="planTitleModal" className="block text-sm font-medium text-neutral-300 mb-1.5">
                      Plan Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="planTitleModal"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2.5
                        text-white focus:outline-none focus:ring-2 focus:ring-[#bfa14a] focus:border-[#bfa14a] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="planTypeModal" className="block text-sm font-medium text-neutral-300 mb-1.5">
                      Plan Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="planTypeModal"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2.5
                        text-white focus:outline-none focus:ring-2 focus:ring-[#bfa14a] focus:border-[#bfa14a] transition-all appearance-none"
                      required
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                {/* Price Input */}
                <div>
                  <label htmlFor="planPriceModal" className="block text-sm font-medium text-neutral-300 mb-1.5">
                    Price ({formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-neutral-400">₱</span> {/* Replaced FaDollarSign with ₱ */}
                    </div>
                    <input
                      id="planPriceModal"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price} // Directly use formData.price
                      onChange={handlePriceChange} // Use the new handler
                      placeholder={`Enter ${formData.type} price`}
                      className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg pl-10 pr-4 py-2.5
                        text-white focus:outline-none focus:ring-2 focus:ring-[#bfa14a] focus:border-[#bfa14a] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2.5
                      text-white focus:outline-none focus:ring-2 focus:ring-[#bfa14a] focus:border-[#bfa14a] h-28 resize-y transition-all"
                    placeholder="Briefly describe this plan..."
                  />
                </div>

                {/* Features */}
                <div className="border border-neutral-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-neutral-300">
                      Features ({formData.features.length})
                    </label>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-sm text-[#bfa14a] hover:text-[#d4b65e] transition-colors
                        flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-neutral-700/50"
                    >
                      <FaPlus size={12} /> Add Feature
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-700/30">
                    {formData.features.map((feature, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex flex-col sm:flex-row gap-3 items-start p-3 bg-neutral-700/30 rounded-md border border-neutral-600/50"
                      >
                        <input
                          type="text"
                          value={feature.text}
                          onChange={(e) => updateFeature(index, 'text', e.target.value)}
                          placeholder="Feature description (e.g., 24/7 Gym Access)"
                          className="flex-grow bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2
                            text-white focus:outline-none focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] transition-all text-sm"
                        />
                        <div className="flex gap-2 w-full sm:w-auto">
                          <select
                            value={feature.category}
                            onChange={(e) => updateFeature(index, 'category', e.target.value)}
                            className="w-full sm:w-36 bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2
                              text-white focus:outline-none focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] transition-all text-sm"
                          >
                            {featureCategories.map(cat => (
                              <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => updateFeature(index, 'highlight', !feature.highlight)}
                            title={feature.highlight ? "Mark as Basic" : "Mark as Premium"}
                            className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center text-sm w-12 h-10 ${
                              feature.highlight 
                                ? 'bg-gradient-to-r from-[#bfa14a] to-[#E0C068] text-neutral-900 shadow-sm' 
                                : 'bg-neutral-600 text-neutral-300 hover:bg-neutral-500'
                            }`}
                          >
                            <FaStar />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            title="Remove Feature"
                            className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 rounded-lg transition-all duration-200 w-12 h-10 flex items-center justify-center"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {formData.features.length === 0 && (
                      <p className="text-neutral-500 text-sm text-center py-4">No features added yet. Click "Add Feature" to get started.</p>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-neutral-700/30 border border-neutral-600/50 rounded-lg">
                    <input
                      type="checkbox"
                      id="isPopularModal" // Changed id to avoid conflict
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-5 h-5 rounded border-neutral-500 bg-neutral-600 text-[#bfa14a]
                        focus:ring-2 focus:ring-[#bfa14a] focus:ring-offset-2 focus:ring-offset-neutral-800 cursor-pointer"
                    />
                    <label htmlFor="isPopularModal" className="text-sm font-medium text-neutral-300 cursor-pointer flex items-center gap-1.5">
                      <FaStar className="text-[#bfa14a]" /> Mark as Popular Plan
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-neutral-700/30 border border-neutral-600/50 rounded-lg">
                    <input
                      type="checkbox"
                      id="activeModal" // Changed id to avoid conflict
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-5 h-5 rounded border-neutral-500 bg-neutral-600 text-[#bfa14a]
                        focus:ring-2 focus:ring-[#bfa14a] focus:ring-offset-2 focus:ring-offset-neutral-800 cursor-pointer"
                    />
                    <label htmlFor="activeModal" className="text-sm font-medium text-neutral-300 cursor-pointer flex items-center gap-1.5">
                      <FaCheck className="text-green-500" /> Plan Active
                    </label>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                    Terms & Conditions
                  </label>
                  <textarea
                    value={formData.termsAndConditions}
                    onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                    className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2.5
                      text-white focus:outline-none focus:ring-2 focus:ring-[#bfa14a] focus:border-[#bfa14a] h-24 resize-y transition-all"
                    placeholder="Enter any terms and conditions for this plan (e.g., contract length, cancellation policy)..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-lg text-neutral-300 hover:text-white bg-neutral-700 hover:bg-neutral-600
                      transition-colors duration-300 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#bfa14a] to-[#E0C068] text-neutral-900 rounded-lg
                      hover:from-[#CDAC5A] hover:to-[#E0C068] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto"
                  >
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default PlanFormModal;
