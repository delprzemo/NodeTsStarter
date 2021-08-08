import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { SmartStockService } from './smart-stock.service';

// Init shared
const router = Router();
const service = new SmartStockService();

router.post('/learn', async (req: Request, res: Response) => {
    const body = req.body;
    return res.status(OK).end();
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
