import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { SmartStockService } from './smart-stock.service';

// Init shared
const router = Router();
const service = new SmartStockService();

router.post('/learn', async (req: Request, res: Response) => {
    const body = req.body as {Input: any[], Output: any[], File: string, Epochs: number, LearningRate: number};
    const trainingResult = await service.trainModel(body.Input, body.Output, body.File, body.Epochs, body.LearningRate);
    return res.status(OK).json({trainingResult});
});

router.post('/predict', async (req: Request, res: Response) => {
    const body = req.body as {Input: any[], File: string};
    const predict = await service.predict(body.Input, body.File); 
    return res.status(OK).json({Predict: predict});
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
