import { Request, Response } from 'express';
import { wrapAsync, createRouter } from '../../../utils';
import { getGames } from '../../../apis/firestore';

export const gamesRouter = createRouter();

gamesRouter.get(
    '/',
    wrapAsync((req: Request, res: Response) => getGames()),
);
