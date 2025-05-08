const express = require('express');
const router = express.Router();
const {
  getPlans,
  managePlan,
  deletePlan,
  getPromotions,
  managePromotion,
  deletePromotion,
  applyPromotion,
  getEvents,
  manageEvent,
  deleteEvent,
  getAnalytics
} = require('../controllers/pricingController');
const { protect } = require('../middleware/auth');

// Plan routes
router.route('/plans')
  .get(getPlans)
  .post(protect, managePlan);

router.route('/plans/:id')
  .put(protect, managePlan)
  .delete(protect, deletePlan);

// Promotion routes
router.route('/promotions')
  .get(getPromotions)
  .post(protect, managePromotion);

router.route('/promotions/:id')
  .put(protect, managePromotion)
  .delete(protect, deletePromotion);

router.post('/promotions/apply', protect, applyPromotion);

// Event routes
router.route('/events')
  .get(getEvents)
  .post(protect, manageEvent);

router.route('/events/:id')
  .put(protect, manageEvent)
  .delete(protect, deleteEvent);

// Analytics
router.get('/analytics', protect, getAnalytics);

module.exports = router;