const PricingPlan = require('../models/PricingPlan');
const Promotion = require('../models/Promotion');
const Event = require('../models/Event');

// Plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await PricingPlan.find().sort({ price: 1 }); // Default sort by price
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Error fetching plans', error: error.message });
  }
};

exports.managePlan = async (req, res) => {
  const { id } = req.params;
  const {
    title, description, type, price, features, isPopular, availability, active, termsAndConditions, metadata
  } = req.body;

  try {
    let plan;
    if (id) { // Update existing plan
      plan = await PricingPlan.findById(id);
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      plan.title = title;
      plan.description = description;
      plan.type = type;
      plan.price = Number(price); // Ensure price is a number
      plan.features = features.map(f => ({ text: f.text, category: f.category, highlight: f.highlight, description: f.description }));
      plan.isPopular = isPopular;
      plan.availability = availability;
      plan.active = active;
      plan.termsAndConditions = termsAndConditions;
      if (metadata) { // Preserve existing metadata if not fully overwritten
        plan.metadata = { ...plan.metadata, ...metadata };
      }
      // findByIdAndUpdate will trigger the 'findOneAndUpdate' hook for updatedAt
      const updatedPlan = await PricingPlan.findByIdAndUpdate(id, plan, { new: true, runValidators: true });
      res.json(updatedPlan);
    } else { // Create new plan
      plan = new PricingPlan({
        title,
        description,
        type,
        price: Number(price), // Ensure price is a number
        features: features.map(f => ({ text: f.text, category: f.category, highlight: f.highlight, description: f.description })),
        isPopular,
        availability,
        active,
        termsAndConditions,
        metadata
      });
      await plan.save(); // This will trigger the 'save' hook for updatedAt
      res.status(201).json(plan);
    }
  } catch (error) {
    console.error('Error managing plan:', error);
    if (error.code === 11000) { // Duplicate key error (e.g., unique title)
        console.error('Duplicate key error. Conflicting value:', error.keyValue); // Server-side log
        return res.status(409).json({
            message: 'A plan with this title already exists.',
            error: error.message,
            keyValue: error.keyValue // Add keyValue to the response
        });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error managing plan', error: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await PricingPlan.findByIdAndDelete(id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ message: 'Error deleting plan', error: error.message });
  }
};

// Promotions
exports.getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate('applicablePlans');
    res.json(promotions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.managePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    let promotion;
    
    if (id) {
      promotion = await Promotion.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      }).populate('applicablePlans');
      
      if (!promotion) {
        return res.status(404).json({
          success: false,
          message: 'Promotion not found'
        });
      }
    } else {
      promotion = await Promotion.create(req.body);
      promotion = await promotion.populate('applicablePlans');
    }
    
    res.json(promotion);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.applyPromotion = async (req, res) => {
  try {
    const { code, planId } = req.body;
    
    const promotion = await Promotion.findOne({
      code,
      active: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired promotion code'
      });
    }

    // Check max uses
    if (promotion.maxUses && promotion.currentUses >= promotion.maxUses) {
      return res.status(400).json({
        success: false,
        message: 'Promotion code has reached maximum uses'
      });
    }
    
    // Check if promotion is applicable to the plan
    if (promotion.applicablePlans?.length > 0 && 
        !promotion.applicablePlans.includes(planId)) {
      return res.status(400).json({
        success: false,
        message: 'Promotion not applicable to this plan'
      });
    }
    
    // Get plan price and calculate discount
    const plan = await PricingPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }
    
    let discount = 0;
    if (promotion.type === 'percentage') {
      discount = (plan.price.monthly * promotion.value) / 100;
    } else {
      discount = promotion.value;
    }
    
    // Increment usage count
    promotion.currentUses += 1;
    await promotion.save();
    
    res.status(200).json({
      success: true,
      data: {
        discount,
        finalPrice: plan.price.monthly - discount,
        plan,
        promotion: {
          code: promotion.code,
          type: promotion.type,
          value: promotion.value
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('applicablePlans')
      .sort({ startDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.manageEvent = async (req, res) => {
  try {
    const { id } = req.params;
    let event;
    
    if (id) {
      event = await Event.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      }).populate('applicablePlans');
      
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
    } else {
      event = await Event.create(req.body);
      event = await event.populate('applicablePlans');
    }
    
    res.json(event);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Get basic plan metrics
    const plans = await PricingPlan.find();
    const planMetrics = plans.map(plan => ({
      planId: plan._id,
      title: plan.title,
      metrics: {
        views: plan.metadata.views,
        subscriptions: plan.metadata.subscriptions,
        conversionRate: plan.metadata.conversionRate,
      }
    }));
    
    // Get active promotions count
    const activePromotionsCount = await Promotion.countDocuments({
      active: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });
    
    // Get upcoming events count
    const upcomingEventsCount = await Event.countDocuments({
      active: true,
      startDate: { $gte: new Date() }
    });
    
    res.json({
      plans: planMetrics,
      promotions: {
        active: activePromotionsCount
      },
      events: {
        upcoming: upcomingEventsCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};