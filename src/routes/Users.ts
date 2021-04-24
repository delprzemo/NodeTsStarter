import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { getConnection } from "typeorm";
import { User } from "../entities/User";
import { paramMissingError } from '../shared/constants';
import { UserService } from 'src/users/users.service';

// Init shared
const router = Router();
const userService = new UserService();


/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const users = await userService.getAll();
    return res.status(OK).json({users});
});

/******************************************************************************
 *                      Get User - "GET /api/users/:id"
 ******************************************************************************/

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    const user = await userService.get(id);
    if (!user) {
        res.status(404);
        res.end();
        return;
    }
    return res.status(OK).json({user});
});


/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    const user = req.body;

    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    await userService.add({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age
    });

    return res.status(CREATED).end();
});


/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    const { user } = req.body;
    if (!user && !user.id) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    await userService.update({
        firstName: user.firstName, 
        lastName: user.lastName,
        age: user.age,
        id: user.id
    })

    return res.status(OK).end();
});


/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;

    await userService.delete(id);
    return res.status(OK).end();
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
