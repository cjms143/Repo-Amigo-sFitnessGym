import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuestionCircle, FaHeadphones, FaEnvelope, FaArrowRight } from 'react-icons/fa';

function FAQs() {
  const [open, setOpen] = useState([]);
  const [activeHover, setActiveHover] = useState(null);
  const containerRef = useRef(null);

  const categories = [
    {
      title: 'Membership',
      icon: <FaQuestionCircle className="text-[#bfa14a] text-xl" />,
      faqs: [
        { 
          question: 'What memberships do you offer?',
          answer: 'We offer three main membership tiers: Basic Plan, Pro Fitness, and Elite Performance. Each comes with different benefits and access levels to suit your fitness journey.'
        },
        {
          question: 'Can I freeze my membership?',
          answer: 'Yes, you can freeze your membership for up to 3 months per year. Contact our front desk or member services to arrange this.'
        },
        {
          question: 'Is there a joining fee?',
          answer: 'Our joining fees vary by membership type and ongoing promotions. We often run special offers that waive the joining fee.'
        }
      ]
    },
    {
      title: 'Facilities & Classes',
      icon: <FaHeadphones className="text-[#bfa14a] text-xl" />,
      faqs: [
        {
          question: 'What facilities do you have?',
          answer: 'Our facilities include state-of-the-art cardio and strength equipment, free weights area, functional training zone, group fitness studios, sauna, and locker rooms.'
        },
        {
          question: 'Do you offer group classes?',
          answer: 'Yes! We offer a wide variety of group classes including Zumba, Yoga, HIIT, Spinning, and more. Class schedules vary by membership tier.'
        },
        {
          question: 'Can I book classes in advance?',
          answer: 'Yes, members can book classes up to 7 days in advance through our mobile app or website. Premium members get priority booking.'
        }
      ]
    },
    {
      title: 'General Info',
      icon: <FaEnvelope className="text-[#bfa14a] text-xl" />,
      faqs: [
        {
          question: 'What are your opening hours?',
          answer: ' Were open Monday-Friday from 6 AM to 12 AM, and Saturday-Sunday from 7 AM to 10 PM.'
        },
        {
          question: 'Do you have parking?',
          answer: 'Yes, we provide free   parking for all members during their workout sessions.'
        },
        {
          question: 'How do I get started?',
          answer: 'You can start by booking a tour of our facility or signing up directly through our website. All new members receive a complimentary fitness consultation.'
        }
      ]
    }
  ];

  const toggle = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpen(open => 
      open.includes(key) 
        ? open.filter(k => k !== key)
        : [...open, key]
    );
  };

  const isOpen = (categoryIndex, faqIndex) => {
    return open.includes(`${categoryIndex}-${faqIndex}`);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-neutral-900 py-20 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-neutral-900/80 to-neutral-900" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23bfa14a' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#bfa14a]/10 rounded-full px-4 py-2 mb-4"
          >
            <span className="text-[#bfa14a] font-medium">Got Questions?</span>
            <FaArrowRight className="text-[#bfa14a] text-sm" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Frequently Asked <span className="text-[#bfa14a]">Questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-neutral-400 max-w-2xl mx-auto"
          >
            Find answers to common questions about our gym, memberships, and services
          </motion.p>
        </div>

        {/* FAQ Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 + 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-6">
                {category.icon}
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const isCurrentOpen = isOpen(categoryIndex, faqIndex);
                  const isHovered = activeHover === `${categoryIndex}-${faqIndex}`;
                  
                  return (
                    <motion.div
                      key={faqIndex}
                      className={`group relative overflow-hidden rounded-xl transition-all duration-300
                        ${isCurrentOpen ? 'bg-[#bfa14a]/5' : 'bg-neutral-800/50'}
                        border ${isCurrentOpen ? 'border-[#bfa14a]/20' : 'border-transparent'}
                        hover:border-[#bfa14a]/20`}
                      onMouseEnter={() => setActiveHover(`${categoryIndex}-${faqIndex}`)}
                      onMouseLeave={() => setActiveHover(null)}
                    >
                      <button
                        className="w-full text-left p-4 pr-12"
                        onClick={() => toggle(categoryIndex, faqIndex)}
                      >
                        <p className={`font-medium transition-colors duration-200
                          ${isCurrentOpen || isHovered ? 'text-[#bfa14a]' : 'text-white'}`}>
                          {faq.question}
                        </p>
                        <span className={`absolute right-4 top-4 w-6 h-6 flex items-center justify-center
                          transition-transform duration-300 ${isCurrentOpen ? 'rotate-45' : ''}`}>
                          <span className={`absolute w-full h-0.5 rounded-full
                            ${isCurrentOpen || isHovered ? 'bg-[#bfa14a]' : 'bg-white'}`} />
                          <span className={`absolute w-0.5 h-full rounded-full
                            ${isCurrentOpen || isHovered ? 'bg-[#bfa14a]' : 'bg-white'}`} />
                        </span>
                      </button>

                      <AnimatePresence>
                        {isCurrentOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 pb-4"
                          >
                            <p className="text-neutral-400">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center bg-[#bfa14a]/5 rounded-2xl p-8 border border-[#bfa14a]/20"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
          <p className="text-neutral-400 mb-6">
            Can't find the answer you're looking for? Please contact our friendly team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:amigosfitnessgym.management@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#bfa14a] text-neutral-900 rounded-lg
                font-semibold hover:bg-[#CDAC5A] transition-colors"
            >
              <FaEnvelope />
              <span>Email Us</span>
            </a>
            <a
              href="tel:+639760760570"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 text-white rounded-lg
                font-semibold hover:bg-neutral-700 transition-colors"
            >
              <FaHeadphones />
              <span>Call Us</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


export default FAQs;