import { Request, Response } from 'express';
import { wrapAsync, createRouter } from '../../../utils';
import {
    getGames,
    getGame,
    addGame,
    updateGame,
    deleteGame,
    seedDatabase
} from '../../../apis/firestore';

export const gamesRouter = createRouter();

gamesRouter.get(
    '/',
    wrapAsync(() => getGames()),
);

gamesRouter.get(
    '/:id',
    wrapAsync((req: Request) => getGame(req.params.id)),
);

gamesRouter.post(
    '/',
    wrapAsync((req: Request) => addGame(req.body)),
)

gamesRouter.put(
    '/:id',
    wrapAsync((req: Request) => updateGame(req.params.id, req.body)),
);

gamesRouter.delete(
    '/:id',
    wrapAsync((req: Request, res: Response) => deleteGame(req.params.id)),
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
