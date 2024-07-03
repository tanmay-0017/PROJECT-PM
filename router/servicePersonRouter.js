import express from 'express';
const router = express.Router();
import {
  getServices,
  createServicePerson,
  getServiceById,
  updateServiceById,
  deleteService,
} from '../Controllers/servicePersonController.js';

router.route('/').get(getServices).post(createServicePerson);
router
  .route('/:id')
  .get(getServiceById)
  .put(updateServiceById)
  .delete(deleteService);

export default router;
