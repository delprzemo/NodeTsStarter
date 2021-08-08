import { Router } from 'express';
import SmartStockRouter from './smart-stock/smart-stock.routes';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/smart-stock', SmartStockRouter);

// Export the base-router
export default router;
