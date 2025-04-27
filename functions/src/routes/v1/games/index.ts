import { Request, Response } from 'express';
import { wrapAsync, createRouter } from '../../../utils';
import { getGames, seedDatabase } from '../../../apis/firestore';

export const gamesRouter = createRouter();

gamesRouter.get(
    '/',
    wrapAsync((req: Request, res: Response) => getGames()),
);

gamesRouter.post(
    '/seed',
    wrapAsync(async () => {
        const result = await seedDatabase();
        return {
            message: 'Database seeded successfully',
            count: result.count
        };
    }),
);
