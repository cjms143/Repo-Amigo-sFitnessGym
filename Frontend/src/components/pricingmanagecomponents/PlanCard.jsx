import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaCrown, FaStar } from 'react-icons/fa';

function PlanCard({
  plan,
  index,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  const getPriceDisplay = () => {
    return plan.price ? plan.price.toLocaleString() : 'N/A';
  };

  const getPlanTypeLabel = () => {
    if (!plan.type) return '';
    return plan.type.charAt(0).toUpperCase() + plan.type.slice(1);
  };

  return (
    <motion.div
      key={plan._id}
      layout
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`relative p-6 rounded-2xl border transition-all duration-300 group isolate
        ${plan.isPopular
          ? 'border-amber-400/70 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 shadow-lg shadow-amber-500/20 group-hover:shadow-xl group-hover:shadow-amber-500/30'
          : 'border-neutral-700/50 bg-neutral-800/60 backdrop-blur-sm hover:border-neutral-600 group-hover:shadow-lg group-hover:shadow-neutral-700/20'
        }
        ${!plan.active ? 'opacity-60 grayscale-[30%]' : ''}
      `}
    >
      {!plan.active && (
        <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <span className="text-neutral-300 font-semibold text-lg border border-neutral-600 px-4 py-2 rounded-md bg-neutral-800/70 shadow-md">Inactive</span>
        </div>
      )}
      
      {plan.isPopular && (
        <div className="absolute -top-4 -right-4 p-2.5 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <FaCrown className="text-neutral-900 text-xl" />
        </div>
      )}

      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors duration-300">{plan.title}</h3>
          <p className="text-sm text-neutral-400 capitalize">{getPlanTypeLabel()} Plan</p>
        </div>
        <div className="flex gap-2 z-20"> {/* Ensure buttons are above inactive overlay */}
          <button
            onClick={() => onToggleStatus(plan)}
            title={plan.active ? "Deactivate Plan" : "Activate Plan"}
            className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md transform hover:scale-105 ${ 
              plan.active 
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300' 
                : 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-600/70 hover:text-neutral-200'
            }`}
          >
            {plan.active ? <FaCheck size={16}/> : <FaTimes size={16}/>}
          </button>
          <button
            onClick={() => onEdit(plan)}
            title="Edit Plan"
            className="p-2.5 bg-neutral-700/50 text-neutral-400 hover:bg-neutral-600/70 hover:text-amber-400 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <FaEdit size={16}/>
          </button>
          <button
            onClick={() => onDelete(plan._id)}
            title="Delete Plan"
            className="p-2.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <FaTrash size={16}/>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1.5 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-1">
          <span className="text-2xl text-amber-400/80 self-center">₱</span> {/* Currency symbol */}
          <span className="plan-card-price">{getPriceDisplay()}</span>
          <span className="text-base text-neutral-400 font-normal">/{plan.type}</span>
        </div>
        {plan.description && (
          <p className="text-xs text-neutral-500 min-h-[30px] line-clamp-2">{plan.description}</p>
        )}
      </div>

      <div className="space-y-2.5 mb-6 min-h-[150px]">
        <div className="text-sm font-medium text-neutral-300 mb-2">Key Features:</div>
        <ul className="space-y-2">
          {plan.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-neutral-300 text-sm">
              <div className={`flex-shrink-0 p-1 rounded-full mt-0.5 transition-all duration-300 ${ 
                feature.highlight 
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-neutral-900' 
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {feature.highlight ? <FaStar size={10}/> : <FaCheck size={10} />}
              </div>
              <span className={`${feature.highlight ? 'font-semibold text-amber-300' : 'text-neutral-300'} group-hover:text-white transition-colors duration-200`}>{feature.text}</span>
            </li>
          ))}
          {plan.features.length > 3 && (
            <li className="text-amber-400/80 text-xs pt-1 hover:text-amber-300 transition-colors duration-200 cursor-pointer" onClick={() => onEdit(plan)}>
              + {plan.features.length - 3} more features (click to edit & view)
            </li>
          )}
          {plan.features.length === 0 && (
            <li className="text-neutral-500 text-xs pt-1">No features listed for this plan.</li>
          )}
        </ul>
      </div>

      {/* Plan Stats */}
      <div className="mt-auto pt-5 border-t border-neutral-700/50">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[ 
            { label: 'Views', value: plan.metadata?.views || 0 },
            { label: 'Subscribers', value: plan.metadata?.subscriptions || 0 },
            { label: 'Conv. Rate', value: `${((plan.metadata?.conversionRate || 0) * 100).toFixed(1)}%` }
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-neutral-400 uppercase tracking-wider text-[10px]">{stat.label}</div>
              <div className="text-white font-semibold text-lg mt-0.5 group-hover:text-amber-400 transition-colors duration-300">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default PlanCard;
