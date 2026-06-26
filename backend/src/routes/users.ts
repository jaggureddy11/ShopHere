import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.route('/addresses')
  .get(getAddresses)
  .post(addAddress);

router.route('/addresses/:addressId')
  .put(updateAddress)
  .delete(deleteAddress);

export default router;
