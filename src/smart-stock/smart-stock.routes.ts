import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { SmartStockService } from './smart-stock.service';

// Init shared
const router = Router();
const service = new SmartStockService();

router.post('/learn', async (req: Request, res: Response) => {
    const body = req.body as {input: any[], output: any[], file: string};
    await service.trainModel(body.input, body.output, body.file);
    return res.status(OK).end();
});

router.post('/predict', async (req: Request, res: Response) => {
    const body = req.body as {input: any[], file: string};
    const predict = await service.predict(body.input, body.file); 
    return res.status(OK).json({predict});
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
